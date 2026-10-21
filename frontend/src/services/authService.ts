import { publicApi } from "../api/public";
import { privateApi } from "../api/private";
import type {
  LoginCredentialsType,
  RegisterUserType,
  UserResponseType,
  ConfirmPasswordType,
  EditUserType,
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

  async activeAccount(
    uidb64: string,
    token: string,
  ): Promise<{ detail: string }> {
    const resp = await publicApi.post(`users/activate/${uidb64}/${token}`);
    return resp.data;
  },

  async remindPassword(email: string): Promise<{ detail: string }> {
    const formData = new FormData();
    formData.append("email", email);
    const resp = await publicApi.post(
      "users/password/forget-password",
      formData,
    );
    return resp.data;
  },
  async changePassword(data: ConfirmPasswordType): Promise<{ detail: string }> {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });
    const resp = await publicApi.post(
      `users/password/reset/${data.uidb64}/${data.token}`,
      formData,
    );
    return resp.data;
  },
  async editUserData(
    data: Partial<EditUserType>,
    userId: string,
  ): Promise<{ detail: string }> {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value === undefined) return;
      if (value instanceof FileList) {
        const file = value.item(0);
        if (file) formData.append(key, file);
      } else {
        formData.append(key, value);
      }
    });
    const resp = await privateApi.patch(`/users/${userId}`, formData);
    return resp.data;
  },
};
