type accessTokenType = {
  access: string;
  refresh: string;
};

type LoginCredentialsType = {
  email: string;
  password: string;
};

type UserRoleType = "OWNER" | "RENTER";

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
  user: {
    id: string;
    name: string;
    second_name: string;
    email: string;
    user_type: UserRoleType;
    // TODO: usunac nulla
    avatar: FileList;
    last_login: string;
    created: string;
  };
  access?: string;
  refresh?: string;
};

type DrfErrorBodyType = {
  detail?: unknown;
  non_field_errors?: unknown;
};
type ConfirmPasswordType = {
  uidb64: string;
  token: string;
  confirm: string;
  password: string;
};
export type {
  accessTokenType,
  LoginCredentialsType,
  UserRoleType,
  EditUserType,
  RegisterUserType,
  UserResponseType,
  DrfErrorBodyType,
  ConfirmPasswordType,
};
