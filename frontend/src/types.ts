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
  name: string;
  user_type: UserRoleType;
  // TODO: usunac nulla
  avatar: string | null;
  last_login: string;
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

type UserResponseType = accessTokenType & {
  user: UserType;
};

type DrfErrorBodyType = {
  detail?: unknown;
  non_field_errors?: unknown;
};

export type {
  accessTokenType,
  LoginCredentialsType,
  UserRoleType,
  UserType,
  RegisterUserType,
  UserResponseType,
  DrfErrorBodyType,
};
