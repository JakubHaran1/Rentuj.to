import axios from "axios";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000/api";

const publicApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

const getPubData = async <T>(url: string): Promise<T> => {
  const resp = await publicApi.get(url);
  return resp.data;
};
const postPubData = async <T>(url: string, data: unknown): Promise<T> => {
  const resp = await publicApi.post(url, data);
  return resp.data;
};

export { getPubData, postPubData, publicApi };
