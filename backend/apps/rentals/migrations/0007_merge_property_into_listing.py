from django.conf import settings
from django.core.validators import MinValueValidator
from django.db import migrations, models
import django.db.models.deletion


BUILDING_CHOICES = [
    ("DETACHED", "Detached house"),
    ("SEMI_DETACHED", "Semi-detached house"),
    ("TERRACED", "Terraced house"),
    ("APARTMENT_BUILDING", "Apartment building"),
    ("BLOCK_OF_FLATS", "Block of flats"),
    ("TENEMENT", "Tenement building"),
    ("ROOM_IN_SHARED_APARTMENT", "Room in a shared apartment"),
]


def copy_property_data(apps, schema_editor):
    Listing = apps.get_model("rentals", "Listing")
    database = schema_editor.connection.alias
    fields = (
        "city", "street", "home_number", "floor_number", "number_of_levels",
        "number_of_rooms", "square_meters", "latitude", "longitude",
        "building_type", "owner_id",
    )
    for listing in Listing.objects.using(database).select_related("property").iterator():
        property_obj = listing.property
        values = {field: getattr(property_obj, field) for field in fields}
        if not listing.title:
            values["title"] = property_obj.title
        Listing.objects.using(database).filter(pk=listing.pk).update(**values)


class Migration(migrations.Migration):
    dependencies = [
        ("rentals", "0006_alter_propertyfiltername_options"),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.RunSQL(
            """
            DROP TRIGGER rentals_listing_active_listing ON rentals_listing;
            DROP TRIGGER rentals_property_active_listing ON rentals_property;
            DROP FUNCTION rentals_enforce_active_listing();
            DROP FUNCTION rentals_check_active_listing(bigint);
            """
        ),
        migrations.AddField("listing", "city", models.CharField(max_length=80, null=True)),
        migrations.AddField("listing", "street", models.CharField(max_length=80, null=True)),
        migrations.AddField("listing", "home_number", models.IntegerField(default=0, null=True, validators=[MinValueValidator(0)])),
        migrations.AddField("listing", "floor_number", models.IntegerField(default=0, null=True, validators=[MinValueValidator(0)])),
        migrations.AddField("listing", "number_of_levels", models.IntegerField(default=0, null=True, validators=[MinValueValidator(0)])),
        migrations.AddField("listing", "number_of_rooms", models.IntegerField(default=0, null=True, validators=[MinValueValidator(0)])),
        migrations.AddField("listing", "square_meters", models.FloatField(null=True, validators=[MinValueValidator(0)])),
        migrations.AddField("listing", "latitude", models.FloatField(null=True)),
        migrations.AddField("listing", "longitude", models.FloatField(null=True)),
        migrations.AddField("listing", "building_type", models.CharField(choices=BUILDING_CHOICES, null=True)),
        migrations.AddField("listing", "owner", models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name="listings", to=settings.AUTH_USER_MODEL)),
        migrations.RunPython(copy_property_data),
        migrations.RunSQL("SET CONSTRAINTS ALL IMMEDIATE", migrations.RunSQL.noop),
        migrations.RemoveConstraint("listing", "one_active_listing_per_property"),
        migrations.RemoveField("listing", "property"),
        migrations.DeleteModel("Property"),
        migrations.AlterField("listing", "city", models.CharField(max_length=80)),
        migrations.AlterField("listing", "street", models.CharField(max_length=80)),
        migrations.AlterField("listing", "home_number", models.IntegerField(default=0, validators=[MinValueValidator(0)])),
        migrations.AlterField("listing", "floor_number", models.IntegerField(default=0, validators=[MinValueValidator(0)])),
        migrations.AlterField("listing", "number_of_levels", models.IntegerField(default=0, validators=[MinValueValidator(0)])),
        migrations.AlterField("listing", "number_of_rooms", models.IntegerField(default=0, validators=[MinValueValidator(0)])),
        migrations.AlterField("listing", "square_meters", models.FloatField(validators=[MinValueValidator(0)])),
        migrations.AlterField("listing", "building_type", models.CharField(choices=BUILDING_CHOICES)),
        migrations.AlterField("listing", "owner", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="listings", to=settings.AUTH_USER_MODEL)),
    ]
