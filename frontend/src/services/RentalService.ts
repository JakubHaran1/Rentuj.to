import { privateApi } from "../api/private";
import { publicApi } from "../api/public";
import type { GalleryImageResponse, GalleryImage } from "../types/imgTypes";
import type {
  CreatePropertyDataType,
  PropertyListingResponseType,
  PropertyListingType,
  RentalFiltersType,
} from "../types/propertyTypes";

const toGalleryImage = (photo: GalleryImageResponse): GalleryImage => ({
  id: String(photo.pk),
  pk: photo.pk,
  file: null,
  previewUrl: photo.img,
  isMain: photo.is_main,
});

const toPropertyListing = (
  listing: PropertyListingResponseType,
): PropertyListingType => ({
  ...listing,
  property_details: {
    ...listing.property_details,
    apartment_photos:
      listing.property_details.apartment_photos.map(toGalleryImage),
  },
});

export const RentalService = {
  async getPropertiesList(query_param = ""): Promise<PropertyListingType[]> {
    const resp = await publicApi.get<PropertyListingResponseType[]>(
      "rentals/properties",
      {
        params: {
          property_details__owner_id: query_param,
        },
      },
    );
    return resp.data.map(toPropertyListing);
  },

  async deleteProperty(id: number): Promise<void> {
    await privateApi.delete(`rentals/properties/${id}`);
  },

  async createPropertyItem(data: CreatePropertyDataType) {
    const { property, apartment_photos, ...propertyDetails } = data;

    const resp = await privateApi.post<{
      property_details: { pk: number };
    }>("rentals/properties", {
      ...property,
      property_details: propertyDetails,
    });

    await Promise.all(
      apartment_photos.map((photo) => {
        if (!photo.file) return Promise.resolve();

        const formData = new FormData();
        formData.append(
          "property_details",
          String(resp.data.property_details.pk),
        );
        formData.append("img", photo.file);
        formData.append("is_main", String(photo.isMain));

        return privateApi.post("rentals/property-imgs", formData);
      }),
    );
    return resp;
  },

  async getPropertyFilters(): Promise<RentalFiltersType[]> {
    const resp = await publicApi.get<RentalFiltersType[]>("rentals/filters");
    return resp.data;
  },
  async getPropertyDetail(pk: string): Promise<PropertyListingType> {
    const resp = await publicApi.get<PropertyListingResponseType>(
      `rentals/properties/${pk}`,
      {},
    );
    return toPropertyListing(resp.data);
  },
  getFavourite(): PropertyListingType[] {
    const fav = localStorage.getItem("rentals_fav");
    return fav ? JSON.parse(fav) : [];
  },

  getFavouriteIds(): number[] {
    const fav = localStorage.getItem("rentals_pks");
    return fav ? JSON.parse(fav) : [];
  },

  saveFavourite(data: PropertyListingType) {
    const fav = this.getFavourite();

    let fav_set;

    if (fav.some((el) => el.pk === data.pk)) {
      fav_set = fav.filter((el) => el.pk !== data.pk);
    } else {
      fav_set = [...fav, data];
    }
    const fav_json = JSON.stringify(fav_set);

    const fav_pks = fav_set.map((el) => el.pk);
    const pks_json = JSON.stringify(fav_pks);

    localStorage.setItem("rentals_fav", fav_json);
    localStorage.setItem("rentals_pks", pks_json);
  },
};
