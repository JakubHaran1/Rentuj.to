import type { GalleryImage, GalleryImageResponse } from "./imgTypes";
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
  pk: number;
  owner: UserType;
  description: string | null;
  number_of_levels: number;
  number_of_rooms: number;
  square_meters: number;
  price: number;
  latitude: number | null;
  longitude: number | null;
  building_type: BuildingType;
  date_active: string | null;
  filters: RentalFilterResponseType[];
  apartment_photos: GalleryImage[];
};

type PropertyDetailResponseType = Omit<PropertyDetailType, "apartment_photos"> & {
  apartment_photos: GalleryImageResponse[];
};

type PropertyListingResponseType = Omit<
  PropertyListingType,
  "property_details"
> & {
  property_details: PropertyDetailResponseType;
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
  property_details: PropertyDetailType;
};

type CreatePropertyDataType = Omit<
  PropertyDetailType,
  "pk" | "owner" | "apartment_photos" | "filters"
> & {
  property: PropertyType;
  filters: RentalFilterAssignmentType[];
  apartment_photos: GalleryImage[];
};

type CreateFormStateType = Omit<
  PropertyDetailType,
  "pk" | "owner" | "latitude" | "longitude" | "filters" | "apartment_photos"
> & {
  property: PropertyType;
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
  PropertyDetailResponseType,
  PropertyListingResponseType,
};
