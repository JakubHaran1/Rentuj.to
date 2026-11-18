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

type ListingFilterNameType = {
  pk: number;
  name: string;
};

type ListingFilterAssignmentType = Pick<ListingFilterNameType, "pk"> & {
  value: -1 | 0 | 1;
};

type ListingFilterType = ListingFilterNameType & ListingFilterAssignmentType;

type PropertyCoordinatesType = {
  latitude: number | null;
  longitude: number | null;
};

type PropertyDefaultType = {
  title: string;
  city: string;
  street: string;
  home_number: number;
  floor_number: number;
  number_of_levels: number;
  number_of_rooms: number;
  square_meters: number;
  building_type: BuildingType;
};

type PropertyCreateType = PropertyDefaultType & PropertyCoordinatesType;

type PropertyOwnerType = Omit<UserType, "avatar"> & {
  avatar: { img: string; user: string }[];
};

type PropertyType = PropertyCreateType & {
  pk: number;
  owner: PropertyOwnerType;
};

type ListingDefaultType = {
  pk: number;
  property: PropertyType;
  description: string | null;
  title: string;
  is_active: boolean;
  price: number;
  date_active: string | null;
  filters: ListingFilterType[];
  apartment_photos: GalleryImage[];
};

type ListingCreateType = {
  property: PropertyCreateType;
  title: string;
  description: string | null;
  price: number;
  date_active: string | null;
  filters: ListingFilterAssignmentType[];
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

type MainFiltersType = {
  price: number;
  buildingType: BuildingType;
  numberOfLevels: number;
  numberOfRooms: number;
  squareMeters: number;
};

export type {
  BuildingType,
  ListingCreateType,
  GeoApiResponseType,
  PropertyCoordinatesType,
  MainFiltersType,
  ListingDefaultType,
  PropertyType,
  PropertyCreateType,
  PropertyDefaultType,
  ListingFilterAssignmentType,
  ListingFilterType,
  ListingFilterNameType,
};
