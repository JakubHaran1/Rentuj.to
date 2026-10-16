import { publicApi } from "../api/public";
import type {
  LoginCredentialsType,
  RegisterUserType,
  UserResponseType,
} from "../types";

export const AuthService = {
  async login(
    loginCredentials: LoginCredentialsType,
  ): Promise<UserResponseType> {
    const resp = await publicApi.post<UserResponseType>(
      "/users/token",
      loginCredentials,
    );
    localStorage.setItem("access", resp.data.access);
    localStorage.setItem("refresh", resp.data.refresh);
    return resp.data;
  },
  logout() {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    window.dispatchEvent(new Event("auth:logout"));
  },
  async register(
    data: RegisterUserType,
  ): Promise<{ status: number; detail: string }> {
    const formData = new FormData();
    Object.entries(data).forEach(([k, v]) => {
      if (v === undefined) return;

      if (v instanceof FileList) {
        const file = v.item(0);
        if (file) formData.append(k, file);
        console.log(data.avatar);
      } else {
        formData.append(k, v);
        console.log(v);
      }
    });
    const resp = await publicApi.post("/users/", formData);
    return { status: resp.status, detail: resp.data.detail };
  },
};
