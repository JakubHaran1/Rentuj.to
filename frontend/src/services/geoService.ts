import axios from "axios";
import type { GeoApiResponseType } from "../types/propertyTypes";

const GEO_API = import.meta.env.VITE_GEO_API_KEY;
export const GeoService = {
  async addressAutocomplete(address: string, type?: string) {
    const resp = await axios.get<{ features: GeoApiResponseType[] }>(
      `https://api.geoapify.com/v1/geocode/autocomplete`,
      {
        params: {
          text: address,
          type: type,
          lang: "en",
          limit: 5,
          apiKey: GEO_API,
        },
      },
    );
    return resp.data.features;
  },
  async geocoding<T>(city: string, street: string, number: number): Promise<T> {
    const resp = await axios.get(`https://api.geoapify.com/v1/geocode/search`, {
      params: {
        text: `${city}, ${street}, ${number}`,
        apiKey: GEO_API,
      },
      headers: {
        Accept: "application/json",
      },
    });

    return resp.data.features;
  },
};
