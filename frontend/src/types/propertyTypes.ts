import type { GalleryImage } from "./imgTypes";
import type { UserType } from "./userTypes";

type BuildingType =
  | "DETACHED"
  | "SEMI_DETACHED"
  | "TERRACED"
  | "APARTMENT_BUILDING"
  | "BLOCK_OF_FLATS"
  | "TENEMENT"
  | "ROOM_IN_SHARED_APARTMENT";

type RentalFilterType = {
  pk: number;
  name: string;
};

type RentalFilterAssignmentType = Pick<RentalFilterType, "pk"> & {
  value: -1 | 0 | 1;
};

type RentalFilterResponseType = RentalFilterType & RentalFilterAssignmentType;

type PropertyCoordinatesType = {
  latitude: number | null;
  longitude: number | null;
};

type PropertyFormType = {
  title: string;
  city: string;
  street: string;
  home_number: number;
  floor_number: number;
};

type PropertyType = PropertyFormType &
  PropertyCoordinatesType & {
    pk: number;
    number_of_levels: number;
    number_of_rooms: number;
    square_meters: number;
    building_type: BuildingType;
  };

type PropertyListingType = {
  pk: number;
  property: PropertyType;
  description: string | null;
  title: string;
  is_active: boolean;
  owner: UserType;
  price: number;
  date_active: string | null;
  filters: RentalFilterResponseType[];
  apartment_photos: GalleryImage[];
};

type CreateListingType = PropertyCoordinatesType & {
  property: PropertyFormType;
  description: string | null;
  number_of_levels: number;
  number_of_rooms: number;
  square_meters: number;
  price: number;
  building_type: BuildingType;
  date_active: string | null;
  filters: RentalFilterAssignmentType[];
  apartment_photos: GalleryImage[];
};

type GeoApiResponseType = {
  properties: {
    address_line1: string;
    formatted: string;
    lat: number;
    lon: number;
  };
};

type MainFiltersStateType = {
  price: number;
  buildingType: BuildingType;
  numberOfLevels: number;
  numberOfRooms: number;
  squareMeters: number;
};

export type {
  BuildingType,
  CreateListingType,
  GeoApiResponseType,
  PropertyCoordinatesType,
  MainFiltersStateType,
  PropertyFormType,
  PropertyListingType,
  RentalFilterAssignmentType,
  RentalFilterResponseType,
  RentalFilterType,
};
