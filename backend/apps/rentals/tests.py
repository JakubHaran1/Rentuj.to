from datetime import date
import json
from tempfile import TemporaryDirectory
from io import BytesIO
from PIL import Image

from django.contrib.auth import get_user_model
from django.test import TestCase, override_settings
from django.urls import reverse
from django.core.files.uploadedfile import SimpleUploadedFile
from django.core.files.base import ContentFile

from .models import BuildingType, Listing, PropertyFilter, PropertyFilterName, PropertyImg

from rest_framework.test import APIClient

User = get_user_model()


@override_settings(
    EMAIL_BACKEND="django.core.mail.backends.locmem.EmailBackend",
    FRONTEND_URL="http://frontend.test",
)
class ListingViewTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="resend@example.com",
            password="Old-Password!4829",
            name="resend",
            second_name="Test",
            birth_date=date(2000, 1, 1),
            is_active=True,
        )
        self.listing = Listing.objects.create(
            title="Jasne mieszkanie blisko centrum",
            city="Warszawa",
            street="Marszałkowska",
            home_number=10,
            floor_number=2,
            number_of_levels=1,
            number_of_rooms=2,
            square_meters=48.5,
            owner=self.user,
            building_type=BuildingType.APARTMENT_BUILDING,
            is_active=True,
            description="Mieszkanie po remoncie.",
            price=3200,
        )

        return super().setUp()

    def test_returning_listing_list_for_unathorized_user(self):
        response = self.client.get(
            reverse(
                "listing-list"
            )
        )
        self.assertEqual(response.status_code, 200)

    def test_returning_listing_detail_for_unathorized_user(self):
        response = self.client.get(
            reverse(
                "listing-detail",
                kwargs={"pk": self.listing.pk}
            )
        )
        self.assertEqual(response.status_code, 200)

    def test_returning_only_active_listings(self):
        no_active_listing = Listing.objects.create(
            title="Jasne mieszkanie blisko centrum2",
            city="Warszawa2",
            street="Marszałkowska2",
            home_number=10,
            floor_number=2,
            number_of_levels=1,
            number_of_rooms=2,
            square_meters=48.5,
            owner=self.user,
            building_type=BuildingType.APARTMENT_BUILDING,
            is_active=False,
            description="Mieszkanie po remoncie.",
            price=3200,
        )

        response = self.client.get(
            reverse(
                "listing-list"
            )
        )
        listings = response.json()
        self.assertEqual(len(listings), 1)
        self.assertEqual(listings[0]["pk"], self.listing.pk)

    def test_create_listing_by_user_from_request(self):
        self.client.force_login(self.user)
        data = {
            "listing": json.dumps({
                "title": "Mieszkanie w centrum",
                "city": "Warszawa",
                "street": "Marszałkowska",
                "square_meters": 48.5,
                "building_type": "APARTMENT_BUILDING",
                "price": 3200,
            }),
            "images": json.dumps([]),
        }
        response = self.client.post(
            reverse(
                "listing-list"
            ),
            data=data
        )
        self.assertEqual(response.status_code, 201)
        created_listing = Listing.objects.get(pk=response.json()["pk"])
        self.assertEqual(created_listing.owner.pk, self.user.pk)

    def test_invalid_create_listing_by_user_from_request(self):
        self.client.force_login(self.user)
        len_before = len(Listing.objects.all())

        data = {
            "listing": json.dumps({
                "title": "Mieszkanie w centrum",
                "city": "Warszawa",
                "street": "",
                "square_meters": 48.5,
                "building_type": "APARTMENT_BUILDING",
                "price": 3200,
            }),
            "images": json.dumps([]),
        }
        response = self.client.post(
            reverse(
                "listing-list"
            ),
            data=data
        )
        len_after = len(Listing.objects.all())
        self.assertEqual(response.status_code, 400)
        self.assertEqual(len_before, len_after)

    def test_authorized_user_can_update_and_delete_listings(self):
        self.client.force_login(self.user)
        data = {
            "listing": json.dumps({
                "price": 1000
            }),
            "images": json.dumps([])
        }
        response = self.client.patch(
            reverse(
                "listing-detail",
                kwargs={"pk": self.listing.pk}
            ),
            content_type="application/json",
            data=data,

        )
        self.assertEqual(response.status_code, 201)
        listing = Listing.objects.get(pk=self.listing.pk)
        self.assertEqual(listing.price, 1000.00)
        response = self.client.delete(
            reverse(
                "listing-detail",
                kwargs={"pk": self.listing.pk}
            ),
        )
        self.assertEqual(response.status_code, 204)

    def test_unauthorized_user_can_not_update_and_delete_listings(self):
        data = {
            "listing": json.dumps({
                "price": 1000
            }),
            "images": json.dumps([])
        }
        response = self.client.patch(
            reverse(
                "listing-detail",
                kwargs={"pk": self.listing.pk}
            ),
            content_type="application/json",
            data=data,

        )
        self.assertEqual(response.status_code, 401)
        listing = Listing.objects.get(pk=self.listing.pk)
        self.assertNotEqual(listing.price, 1000.00)
        response = self.client.delete(
            reverse(
                "listing-detail",
                kwargs={"pk": self.listing.pk}
            ),
        )
        self.assertEqual(response.status_code, 401)

    def test_admin_can_create_filter_names(self):
        admin = User.objects.create_superuser(
            email="admin@example.com",
            password="Admin-Password!4829",
            name="Admin",
            second_name="Test",
            birth_date=date(2000, 1, 1),
        )
        self.client.force_login(admin)
        data = json.dumps({"name": "Homemade dinners"})
        response = self.client.post(
            reverse(
                "propertyfiltername-list",
            ),
            data=data,
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 201)

    def test_default_user_can_not_create_filter_names(self):
        self.client.force_login(self.user)
        data = json.dumps({"name": "Homemade dinners"})
        response = self.client.post(
            reverse(
                "propertyfiltername-list",
            ),
            data=data,
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 403)


@override_settings(
    EMAIL_BACKEND="django.core.mail.backends.locmem.EmailBackend",
    FRONTEND_URL="http://frontend.test",
)
class ListingFiltersTest(TestCase):
    def setUp(self):
        self.filter_name_one = PropertyFilterName.objects.create(
            name="Internet Gateway")

        self.filter_name_two = PropertyFilterName.objects.create(
            name="Load Balancer")

        self.filter_name_three = PropertyFilterName.objects.create(
            name="Simple storage")

        self.user = User.objects.create_user(
            email="resend@example.com",
            password="Old-Password!4829",
            name="resend",
            second_name="Test",
            birth_date=date(2000, 1, 1),
            is_active=True,
        )

        self.listing = Listing.objects.create(
            title="Jasne mieszkanie blisko centrum",
            city="Warszawa",
            street="Marszałkowska",
            home_number=10,
            floor_number=2,
            number_of_levels=1,
            number_of_rooms=2,
            square_meters=48.5,
            owner=self.user,
            building_type=BuildingType.APARTMENT_BUILDING,
            is_active=True,
            description="Mieszkanie po remoncie.",
            price=3200,
        )

        self.filter_relation_one = PropertyFilter.objects.create(
            listing=self.listing,
            rental_filter=self.filter_name_one,
            value=-1,
        )

        return super().setUp()

    def test_edit_filters_in_listing(self):

        self.client.force_login(self.user)

        listing_edit_data = {"listing": json.dumps({
            "filters": [
                {
                    "pk": self.filter_name_two.pk,
                    "value": 0
                },
                {
                    "pk": self.filter_name_three.pk,
                    "value": -1
                }
            ]
        }),
            "images": json.dumps([]), }

        listing_filters_len_before = len(self.listing.filters.all())

        response_edit = self.client.patch(
            reverse(
                "listing-detail",
                kwargs={"pk": self.listing.pk}
            ),
            data=listing_edit_data,
            content_type="application/json"
        )

        self.assertEqual(response_edit.status_code, 201)
        listing_filters_len_after = len(self.listing.filters.all())
        self.assertNotEqual(listing_filters_len_before,
                            listing_filters_len_after)

        filters = dict(self.listing.property_filters.values_list(
            "rental_filter_id", "value"))

        self.assertEqual(filters[self.filter_name_two.pk], 0)
        self.assertEqual(filters[self.filter_name_three.pk], -1)

    def test_create_lisiting_with_filters(self):

        self.client.force_login(self.user)

        listing_data = {"listing": json.dumps({
            "title": "Mieszkanie w centrum",
            "city": "Warszawa",
            "street": "Opolska",
            "square_meters": 48.5,
            "building_type": "APARTMENT_BUILDING",
            "price": 3200,
            "filters": [
                {
                    "pk": self.filter_name_two.pk,
                    "value": -1
                },
                {
                    "pk": self.filter_name_three.pk,
                    "value": 1
                }
            ]
        }),
            "images": json.dumps([]), }

        response = self.client.post(
            reverse(
                "listing-list"
            ),
            data=listing_data
        )

        self.assertEqual(response.status_code, 201)
        listing = Listing.objects.get(pk=response.json()["pk"])
        filters_arr = listing.filters.values_list("pk", flat=True)
        self.assertIn(self.filter_name_two.pk, filters_arr)
        self.assertIn(self.filter_name_three.pk, filters_arr)

    def test_returning_listing_with_filters(self):
        self.client.force_login(self.user)

        response = self.client.get(
            reverse("listing-list"),
            {
                "search": self.listing.city,
                "filter": f"{self.filter_name_one.pk}:{self.filter_relation_one.value}",
            },
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()[0]["pk"], self.listing.pk)


@override_settings(
    EMAIL_BACKEND="django.core.mail.backends.locmem.EmailBackend",
    FRONTEND_URL="http://frontend.test",
    MEDIA_ROOT="/tmp/test-media"
)
def create_img_obj():
    bufor = BytesIO()
    Image.new("RGB", (1000, 1000), color="pink").save(
        bufor, format="PNG")
    return bufor.getvalue()


class ListingImgsTest(TestCase):
    def setUp(self):
        media_root = TemporaryDirectory()
        self.addCleanup(media_root.cleanup)

        settings_override = override_settings(
            MEDIA_ROOT=media_root.name)
        settings_override.enable()
        self.addCleanup(settings_override.disable)
        self.user = User.objects.create_user(
            email="resend@example.com",
            password="Old-Password!4829",
            name="resend",
            second_name="Test",
            birth_date=date(2000, 1, 1),
            is_active=True,
        )

        self.listing = Listing.objects.create(
            title="Jasne mieszkanie blisko centrum",
            city="Warszawa",
            street="Marszałkowska",
            home_number=10,
            floor_number=2,
            number_of_levels=1,
            number_of_rooms=2,
            square_meters=48.5,
            owner=self.user,
            building_type=BuildingType.APARTMENT_BUILDING,
            is_active=True,
            description="Mieszkanie po remoncie.",
            price=3200,
        )
        self.listing_img = PropertyImg.objects.create(
            img=ContentFile(create_img_obj(), name="listing-img.png"), listing=self.listing, is_main=True)

    def test_edit_ListingImg_connected_to_listing(self):

        uploaded_file = SimpleUploadedFile(
            "listing-img-edit.png", create_img_obj(), content_type="image/png")
        self.client.force_login(self.user)

        data = {
            "listing": json.dumps({}),
            "images": json.dumps([{"pk": self.listing_img.pk, "file_key": "image-1"}]),
            "image-1": uploaded_file
        }
        client = APIClient()

        client.force_authenticate(user=self.user)

        response = client.patch(
            reverse("listing-detail", kwargs={"pk": self.listing.pk}),
            data=data,
            format="multipart",
        )
        self.assertEqual(response.status_code, 201)
        img_obj = PropertyImg.objects.get(pk=self.listing_img.pk)
        self.assertEqual(img_obj.img.name.split(
            "/")[-1], "listing-img-edit.webp")

    def test_add_ListingImg_to_listing_while_one_other_exsist(self):

        uploaded_file = SimpleUploadedFile(
            "listing-img-edit.png", create_img_obj(), content_type="image/png")
        self.client.force_login(self.user)

        data = {
            "listing": json.dumps({}),
            "images": json.dumps([{"file_key": "image-1"}]),
            "image-1": uploaded_file
        }
        client = APIClient()

        client.force_authenticate(user=self.user)
        len_before = len(self.listing.apartment_photos.values_list("pk"))
        response = client.patch(
            reverse("listing-detail", kwargs={"pk": self.listing.pk}),
            data=data,
            format="multipart",
        )
        len_after = len(self.listing.apartment_photos.values_list("pk"))
        self.assertEqual(response.status_code, 201)
        self.assertNotEqual(len_before, len_after)

        img_obj = PropertyImg.objects.filter(
            listing=self.listing
        ).exclude(pk=self.listing_img.pk).get()

        self.assertEqual(
            img_obj.img.name.split("/")[-1],
            "listing-img-edit.webp",
        )

    def test_add_and_change_order_ListingImg_while_one_other_connected(self):
        uploaded_file = uploaded_file = SimpleUploadedFile(
            "listing-img-edit.png", create_img_obj(), content_type="image/png")
        self.client.force_login(self.user)

        data = {
            "listing": json.dumps({}),
            "images": json.dumps([{"file_key": "image-0"}, {"pk": self.listing_img.pk, "file_key": "image-1"}, ]),
            "image-0": uploaded_file,
            "image-1": self.listing_img.img,
        }
        client = APIClient()

        client.force_authenticate(user=self.user)
        len_before = len(self.listing.apartment_photos.values_list("pk"))
        response = client.patch(
            reverse("listing-detail", kwargs={"pk": self.listing.pk}),
            data=data,
            format="multipart",
        )
        len_after = len(self.listing.apartment_photos.values_list("pk"))
        self.assertEqual(response.status_code, 201)
        self.assertNotEqual(len_before, len_after)

        img_obj = PropertyImg.objects.filter(
            listing_id=self.listing.pk
        ).exclude(pk=self.listing_img.pk).get()
        self.assertEqual(img_obj.position, 0)
