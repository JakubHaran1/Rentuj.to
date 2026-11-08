import type { UserType } from "./userTypes";

// Property types
type PropertyType = {
  title: string;
  city: string;
  street: string;
  home_number: number;
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
  building_type: BuildingType;
  date_active: string | null;
  filters: RentalFilterResponseType[];
  apartment_photos: PropertyImageType[] | FileList;
};

type PropertyImageType = {
  pk: number;
  img: string;
};

type BuildingType =
  | "DETACHED"
  | "SEMI_DETACHED"
  | "TERRACED"
  | "APARTMENT_BUILDING"
  | "BLOCK_OF_FLATS"
  | "TENEMENT"
  | "ROOM_IN_SHARED_APARTMENT";

type PropertyListingType = {
  pk: number;
  title: string;
  city: string;
  street: string;
  home_number: number;
  floor_number: number;
  property_details: PropertyDetailType | null;
};
type CreatePropertyDataType = Omit<
  PropertyDetailType,
  "owner" | "latitude" | "longitude" | "apartment_photos" | "filters"
> & {
  date_active: string | null;
  latitude: number | null;
  longitude: number | null;
  apartment_photos: File[];
  filters: RentalFilterAssignmentType[];
};

type CreateFormStateType = Omit<
  PropertyDetailType,
  "latitude" | "longitude" | "owner" | "filters"
> & {
  address: string;
  filters: RentalFilterAssignmentType[];
};

type GeoApiResponseType = {
  properties: {
    address_line1: string;
    formatted: string;
    lat: number;
    lon: number;
  };
};

type ListingCoordinatesType = {
  latitude: number | null;
  longitude: number | null;
};

type RentalFiltersType = {
  pk: number;
  name: string;
};

type RentalFilterAssignmentType = {
  id: number;
  value: -1 | 0 | 1;
};

type RentalFilterResponseType = RentalFilterAssignmentType & {
  name: string;
};

type MainFiltersStateType = {
  price: number;
  buildingType: BuildingType;
  numberOfLevels: number;
  numberOfRooms: number;
  squareMeters: number;
};

export type {
  PropertyType,
  PropertyDetailType,
  BuildingType,
  CreatePropertyDataType,
  PropertyListingType,
  CreateFormStateType,
  GeoApiResponseType,
  ListingCoordinatesType,
  RentalFiltersType,
  RentalFilterAssignmentType,
  RentalFilterResponseType,
  MainFiltersStateType,
  PropertyImageType,
};
