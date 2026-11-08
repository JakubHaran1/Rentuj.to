type accessTokenType = {
  access: string;
  refresh: string;
};

type LoginCredentialsType = {
  email: string;
  password: string;
};

type UserRoleType = "OWNER" | "RENTER";

type UserType = {
  pk: string;
  name: string;
  second_name: string;
  email: string;
  user_type: UserRoleType;
  avatar: string | FileList;
  last_login: string | null;
  created: string;
};

type RegisterUserType = {
  name: string;
  second_name: string;
  email: string;
  password: string;
  confirm_password: string;
  avatar: string | FileList;
  birth_date: string;
  user_type?: UserRoleType;
};

type EditUserType = Pick<
  RegisterUserType,
  "name" | "second_name" | "email" | "password" | "confirm_password"
> & {
  avatar?: FileList;
};

type UserResponseType = {
  user: UserType;
  access?: string;
  refresh?: string;
};

type ConfirmPasswordType = {
  uidb64: string;
  token: string;
  confirm: string;
  password: string;
};
type AuthStatus = "loading" | "authenticated" | "unauthenticated";

export type {
  accessTokenType,
  LoginCredentialsType,
  UserRoleType,
  UserType,
  EditUserType,
  RegisterUserType,
  UserResponseType,
  ConfirmPasswordType,
  AuthStatus,
};
