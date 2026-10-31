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
  id: string;
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
type AuthStatus = "loading" | "authenticated" | "unauthenticated";

// Property types
type PropertyType = {
  title: string;
  city: string;
  street: string;
  home_number: number;
  flat_number: number;
  floor_number: number;
};

type PropertyDetailType = {
  property: PropertyType;
  owner: UserType;
  description: string;
  number_of_levels: number;
  number_of_rooms: number;
  square_meters: number;
  price: number;
  latitude: number;
  longitude: number;
  apartment_photos: string[] | FileList;
};

type PropertyListingType = {
  pk: number;
  title: string;
  city: string;
  street: string;
  home_number: number;
  flat_number: number;
  floor_number: number;
  property_details: PropertyDetailType;
};
type CreatePropertyDataType = Omit<PropertyDetailType, "owner">;

type CreateFormStateType = Omit<
  PropertyDetailType,
  "latitude" | "longitude" | "owner"
> & { address: string };
export type {
  accessTokenType,
  LoginCredentialsType,
  UserRoleType,
  UserType,
  EditUserType,
  RegisterUserType,
  UserResponseType,
  DrfErrorBodyType,
  ConfirmPasswordType,
  AuthStatus,
  PropertyType,
  PropertyDetailType,
  CreatePropertyDataType,
  PropertyListingType,
  CreateFormStateType,
};
