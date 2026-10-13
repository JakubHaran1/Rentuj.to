import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { publicApi } from "./public";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000/api/";

type ApiErrorBody = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

export const privateApi = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 1000,
});

privateApi.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = window.localStorage.getItem("access");

  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }

  return config;
});

privateApi.interceptors.response.use(
  (response) => response,
  async (wrn: AxiosError) => {
    const originalRequest = wrn.config as ApiErrorBody | undefined;
    if (!originalRequest) {
      return Promise.reject(wrn);
    }
    if (
      (wrn.response?.status == 401 || wrn.response?.status == 403) &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        const refresh = localStorage.getItem("refresh");
        if (!refresh) return Promise.reject(wrn);
        const access = await publicApi.post<{ access: string }>(
          "token/refresh",
          {
            refresh: refresh,
          },
        );
        const access_token = access.data.access;
        localStorage.setItem("access", access_token);
        originalRequest.headers.Authorization = `Bearer ${access}`;
        return privateApi(originalRequest);
      } catch (err) {
        localStorage.clear();
        return Promise.reject(err);
      }
    }
  },
);
