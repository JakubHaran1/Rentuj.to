import { privateApi } from "../api/private";
import { publicApi } from "../api/public";
import type {
  CreatePropertyDataType,
  PropertyDetailType,
  PropertyListingType,
  RentalFiltersType,
} from "../types/propertyTypes";

export const RentalService = {
  async getPropertiesList(query_param = ""): Promise<PropertyListingType[]> {
    const resp = await publicApi.get<PropertyListingType[]>(
      "rentals/properties",
      {
        params: {
          property_details__owner_id: query_param,
        },
      },
    );
    return resp.data;
  },

  async getPropertyItem(id: string): Promise<PropertyDetailType> {
    const resp = await publicApi.get<PropertyDetailType>(
      `rentals/properties/${id}`,
    );
    return resp.data;
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

    const files =
      apartment_photos instanceof FileList
        ? Array.from(apartment_photos)
        : apartment_photos;

    await Promise.all(
      files.map((file) => {
        const formData = new FormData();
        formData.append(
          "property_details",
          String(resp.data.property_details.pk),
        );
        formData.append("img", file);

        return privateApi.post("rentals/property-imgs", formData);
      }),
    );
    return resp;
  },

  async getRentalFilters(): Promise<RentalFiltersType[]> {
    const resp = await publicApi.get<RentalFiltersType[]>("rentals/filters");
    return resp.data;
  },
  async getRentalDetail(pk: string): Promise<PropertyListingType> {
    const resp = await publicApi.get<PropertyListingType>(
      `rentals/properties/${pk}`,
      {},
    );
    return resp.data;
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
