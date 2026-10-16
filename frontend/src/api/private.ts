import axios, { type InternalAxiosRequestConfig } from "axios";
import type { accessTokenType } from "../types";
import { API_BASE_URL, publicApi } from "./public";

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
  _accessToken?: string;
};

export const privateApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

privateApi.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const retryableConfig = config as RetryableRequestConfig;
  const token = window.localStorage.getItem("access");

  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }
  retryableConfig._accessToken = token ?? undefined;

  return config;
});

let refreshPromise: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
  const refresh = window.localStorage.getItem("refresh");
  if (!refresh) {
    throw new Error("No refresh token available.");
  }

  const response = await publicApi.post<Partial<accessTokenType>>(
    "/users/token/refresh",
    { refresh },
  );
  const access = response.data.access;
  if (!access) {
    throw new Error(
      "The token refresh response did not include an access token.",
    );
  }

  window.localStorage.setItem("access", access);
  if (response.data.refresh) {
    window.localStorage.setItem("refresh", response.data.refresh);
  }

  return access;
}

function clearAuthSession() {
  window.localStorage.removeItem("access");
  window.localStorage.removeItem("refresh");
  window.dispatchEvent(new Event("auth:logout"));
}

privateApi.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (!axios.isAxiosError(error)) {
      return Promise.reject(error);
    }

    const originalRequest = error.config as RetryableRequestConfig | undefined;
    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;
    const currentAccess = window.localStorage.getItem("access");
    // check access tokens -  equal: refresg access token to header /  not equal: it means the other request perform refreshing - add to header
    if (currentAccess && originalRequest._accessToken !== currentAccess) {
      originalRequest.headers.set("Authorization", `Bearer ${currentAccess}`);
      return await privateApi(originalRequest);
    }

    if (!refreshPromise) {
      refreshPromise = refreshAccessToken().finally(() => {
        refreshPromise = null;
      });
    }

    try {
      const access = await refreshPromise;
      originalRequest.headers.set("Authorization", `Bearer ${access}`);
      return await privateApi(originalRequest);
    } catch (refreshError: unknown) {
      clearAuthSession();
      return Promise.reject(refreshError);
    }
  },
);
