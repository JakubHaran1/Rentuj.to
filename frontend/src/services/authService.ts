import { publicApi } from "../api/public";
import type { LoginCredentialsType, UserResponse } from "../types";

export const AuthService = {
  async login(loginCredentials: LoginCredentialsType): Promise<UserResponse> {
    const url = "/users/token";
    const resp = await publicApi.post<UserResponse>(url, loginCredentials);
    localStorage.setItem("access", resp.data.access);
    localStorage.setItem("refresh", resp.data.refresh);
    return resp.data;
  },
  logout() {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
  },
};
