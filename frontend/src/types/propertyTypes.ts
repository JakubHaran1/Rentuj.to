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

type ListingLocationType = {
  city: string;
  street: string;
  home_number: number;
  floor_number: number;
  number_of_levels: number;
  number_of_rooms: number;
  square_meters: number;
  building_type: BuildingType;
};

type ListingOwnerType = Omit<UserType, "avatar"> & {
  avatar: { img: string; user: string }[];
};

type ListingDefaultType = ListingLocationType &
  PropertyCoordinatesType & {
    pk: number;
    owner: ListingOwnerType;
    description: string | null;
    title: string;
    is_active: boolean;
    price: number;
    date_active: string | null;
    filters: ListingFilterType[];
    apartment_photos: GalleryImage[];
  };

type ListingCreateType = ListingLocationType &
  PropertyCoordinatesType & {
    title: string;
    description: string | null;
    price: number;
    date_active: string | null;
    filters: ListingFilterAssignmentType[];
    apartment_photos: GalleryImage[];
  };

type GeoApiResponseType = {
  properties: {
    city?: string;
    street?: string;
    name: string;
    formatted: string;
    lat: number;
    lon: number;
  };
};

type MainFiltersType = {
  search?: string;
  price__lte: number | "";
  building_type: BuildingType | "";
  number_of_levels: number | "";
  number_of_rooms: number | "";
  square_meters__gte: number | "";
};

type SearchFiltersType = {
  mainFilters: MainFiltersType;
  filters: ListingFilterAssignmentType[];
};

export type {
  BuildingType,
  ListingCreateType,
  GeoApiResponseType,
  PropertyCoordinatesType,
  MainFiltersType,
  ListingDefaultType,
  ListingFilterAssignmentType,
  ListingFilterType,
  ListingFilterNameType,
  SearchFiltersType,
};
