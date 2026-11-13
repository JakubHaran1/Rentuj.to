import { privateApi } from "../api/private";
import { publicApi } from "../api/public";
import type { GalleryImage } from "../types/imgTypes";
import type {
  CreateListingType,
  PropertyCoordinatesType,
  PropertyListingType,
  RentalFilterType,
} from "../types/propertyTypes";

export const RentalService = {
  // Property helper functions
  preparePropertyDataToSend(
    data: CreateListingType,
    imgs: GalleryImage[],
    croppedImgs: GalleryImage[],
    coordinates: PropertyCoordinatesType,
  ): CreateListingType {
    // Prepare apartment photos by replacing original images with cropped ones if available and marking the first image as main.
    const apartmentPhotos = imgs
      .map(
        (image) =>
          croppedImgs.find((croppedImage) => croppedImage.pk === image.pk) ??
          image,
      )
      .filter((image) => image.file && image.file.size > 0)
      .map((image, index) => ({ ...image, is_main: index === 0 }));

    const dataToSend = {
      ...data,
      date_active: data.date_active || null,
      latitude: coordinates.latitude,
      longitude: coordinates.longitude,
      apartment_photos: apartmentPhotos,
    };
    return dataToSend;
  },

  toFormState(listing: PropertyListingType): CreateListingType {
    const { property, ...details } = listing;

    return {
      property: {
        title: property.title,
        city: property.city,
        street: property.street,
        home_number: property.home_number,
        floor_number: property.floor_number,
      },
      latitude: property.latitude,
      longitude: property.longitude,
      apartment_photos: details.apartment_photos,
      description: details.description,
      number_of_levels: property.number_of_levels,
      number_of_rooms: property.number_of_rooms,
      square_meters: property.square_meters,
      price: details.price,
      building_type: property.building_type,
      date_active: details.date_active,
      filters: details.filters.map(({ pk, value }) => ({ pk, value })),
    };
  },

  // Properties related methods
  async getPropertiesList(query_param = ""): Promise<PropertyListingType[]> {
    const resp = await publicApi.get<PropertyListingType[]>(
      "rentals/listings",
      {
        params: {
          owner_id: query_param || undefined,
        },
      },
    );
    return resp.data;
  },

  async deleteProperty(id: number): Promise<void> {
    await privateApi.delete(`rentals/listings/${id}`);
  },

  async createPropertyItem(data: CreateListingType) {
    const {
      property,
      apartment_photos,
      number_of_levels,
      number_of_rooms,
      square_meters,
      building_type,
      latitude,
      longitude,
      description,
      price,
      date_active,
      filters,
    } = data;

    const resp = await privateApi.post<PropertyListingType>(
      "rentals/listings",
      {
        description,
        price,
        date_active,
        filters,
        property: {
          ...property,
          number_of_levels,
          number_of_rooms,
          square_meters,
          building_type,
          latitude,
          longitude,
        },
      },
    );

    await Promise.all(
      apartment_photos.map((photo) => {
        if (typeof photo.pk === "number" || !photo.file) {
          return Promise.resolve();
        }

        const formData = new FormData();
        formData.append("listing", String(resp.data.pk));
        formData.append("img", photo.file);
        formData.append("is_main", String(photo.is_main));

        return privateApi.post("rentals/property-imgs", formData);
      }),
    );
    return resp;
  },

  // Filters related methods
  async getPropertyFilters(): Promise<RentalFilterType[]> {
    const resp = await publicApi.get<RentalFilterType[]>("rentals/filters");
    return resp.data;
  },

  async getPropertyDetail(pk: string): Promise<PropertyListingType> {
    const resp = await publicApi.get<PropertyListingType>(
      `rentals/listings/${pk}`,
      {},
    );
    return resp.data;
  },

  // Favourite related methods
  getFavourite(): PropertyListingType[] {
    const fav = localStorage.getItem("rentals_fav");
    return fav ? JSON.parse(fav) : [];
  },

  getFavouriteIdList(): number[] {
    const fav = localStorage.getItem("rentals_pks");
    return fav ? JSON.parse(fav) : [];
  },

  saveFavourite(data: PropertyListingType) {
    const fav = this.getFavourite();

    let fav_set;

    if (fav.some((el) => el.pk === data.pk)) {
      fav_set = fav.filter((el) => el.pk !== data.pk);
    } else {
      fav_set = [...fav, data];
    }
    const fav_json = JSON.stringify(fav_set);

    const fav_pks = fav_set.map((el) => el.pk);
    const pks_json = JSON.stringify(fav_pks);

    localStorage.setItem("rentals_fav", fav_json);
    localStorage.setItem("rentals_pks", pks_json);
  },
};
