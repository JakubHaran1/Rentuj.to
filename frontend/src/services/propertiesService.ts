import { privateApi } from "../api/private";
import { publicApi } from "../api/public";
import type {
  CreatePropertyDataType,
  PropertyDetailType,
  PropertyListingType,
} from "../types";

export const PropertiesService = {
  async getPropertiesList(query_param = ""): Promise<PropertyListingType[]> {
    const resp = await publicApi.get<PropertyListingType[]>(
      "rentals/properties",
      {
        params: {
          search: query_param,
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
};
