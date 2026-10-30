import { publicApi } from "../api/public";
import type { CreatePropertyDataType, PropertyDetailType } from "../types";

export const PropertiesService = {
  async getPropertiesList(query_param = ""): Promise<PropertyDetailType[]> {
    const resp = await publicApi.get<PropertyDetailType[]>(
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
  async createPropertyItem(
    data: CreatePropertyDataType,
  ): Promise<{ status: number }> {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (typeof value == "string") formData.append(key, value);
      else if (key == "property")
        formData.append("property", JSON.stringify(value));
      else if (value instanceof FileList) {
        const file = value.item(0);
        if (file) formData.append(key, file);
      }
    });
    const resp = await publicApi.post<{ status: number }>(
      `rentals/properties/`,
      formData,
    );
    return resp;
  },
};
