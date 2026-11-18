import { privateApi } from "../api/private";
import { publicApi } from "../api/public";
import type { GalleryImage } from "../types/imgTypes";
import type {
  ListingCreateType,
  PropertyCoordinatesType,
  ListingDefaultType,
  ListingFilterNameType,
  PropertyType,
  PropertyCreateType,
} from "../types/propertyTypes";

function toPropertyCreateData(
  property: PropertyCreateType,
): PropertyCreateType {
  return {
    title: property.title,
    city: property.city,
    street: property.street,
    home_number: property.home_number,
    floor_number: property.floor_number,
    number_of_levels: property.number_of_levels,
    number_of_rooms: property.number_of_rooms,
    square_meters: property.square_meters,
    building_type: property.building_type,
    latitude: property.latitude,
    longitude: property.longitude,
  };
}

export const RentalService = {
  // Listing helper functions
  prepareListingDataToSend(
    data: ListingCreateType,
    imgs: GalleryImage[],
    croppedImgs: GalleryImage[],
    coordinates: PropertyCoordinatesType,
  ): ListingCreateType {
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
      property: {
        ...toPropertyCreateData(data.property),
        ...coordinates,
      },
      apartment_photos: apartmentPhotos,
    };
    return dataToSend;
  },

  toListingFormState(listing: ListingDefaultType): ListingCreateType {
    const { property, ...details } = listing;

    return {
      property: toPropertyCreateData(property),
      title: details.title,
      apartment_photos: details.apartment_photos,
      description: details.description,
      price: details.price,
      date_active: details.date_active,
      filters: details.filters.map(({ pk, value }) => ({ pk, value })),
    };
  },

  // Property related methods
  async getPropertyList(query_param = ""): Promise<PropertyType[]> {
    const resp = await publicApi.get<PropertyType[]>("rentals/properties", {
      params: {
        owner_id: query_param || undefined,
      },
    });
    return resp.data;
  },

  async createProperty(data: PropertyCreateType): Promise<PropertyType> {
    const resp = await privateApi.post<PropertyType>(
      "rentals/properties",
      toPropertyCreateData(data),
    );
    return resp.data;
  },

  async getPropertyDetail(pk: string): Promise<PropertyType> {
    const resp = await publicApi.get<PropertyType>(`rentals/properties/${pk}`);
    return resp.data;
  },

  async deleteProperty(id: number): Promise<void> {
    await privateApi.delete(`rentals/properties/${id}`);
  },

  async getPropertyRelatedListings(pk: string): Promise<ListingDefaultType[]> {
    const resp = await publicApi.get<ListingDefaultType[]>(
      `rentals/properties/${pk}/listings`,
    );
    return resp.data;
  },

  // Listing related methods
  async getListingsList(query_param = ""): Promise<ListingDefaultType[]> {
    const resp = await publicApi.get<ListingDefaultType[]>("rentals/listings", {
      params: {
        property__owner_id: query_param || undefined,
      },
    });
    return resp.data;
  },

  async createListingItem(data: ListingCreateType) {
    const { apartment_photos, ...listingData } = data;
    const formData = new FormData();
    const images: { file_key: string; is_main: boolean }[] = [];

    formData.append(
      "listing",
      JSON.stringify({
        ...listingData,
        property: toPropertyCreateData(listingData.property),
      }),
    );

    apartment_photos.forEach((el) => {
      if (typeof el.pk === "number" || !el.file) {
        return;
      }
      formData.append(el.pk, el.file);
      images.push({ file_key: el.pk, is_main: el.is_main });
    });

    formData.append("images", JSON.stringify(images));
    const resp = await privateApi.post<ListingDefaultType>(
      "rentals/listings",
      formData,
    );

    return resp;
  },

  // async updateListing(id: number, data: ListingCreateType) {
  //   const { apartment_photos, ...payload } = data;
  //   const resp = await privateApi.put<ListingDefaultType>(
  //     "rentals/listings",
  //     payload,
  //   );

  //   await Promise.all(
  //     apartment_photos.map((photo) => {
  //       if (typeof photo.pk === "number" || !photo.file) {
  //         return Promise.resolve();
  //       }

  //       const formData = new FormData();
  //       formData.append("listing", String(resp.data.pk));
  //       formData.append("img", photo.file);
  //       formData.append("is_main", String(photo.is_main));

  //       return privateApi.post("rentals/property-imgs", formData);
  //     }),
  //   );
  //   return resp;
  // },

  async deleteListing(id: number): Promise<void> {
    await privateApi.delete(`rentals/listings/${id}`);
  },

  async getListingDetail(pk: string): Promise<ListingDefaultType> {
    const resp = await publicApi.get<ListingDefaultType>(
      `rentals/listings/${pk}`,
    );
    return resp.data;
  },

  // Filters related methods
  async getListingFilters(): Promise<ListingFilterNameType[]> {
    const resp =
      await publicApi.get<ListingFilterNameType[]>("rentals/filters");
    return resp.data;
  },

  // Favourite related methods
  getFavourite(): ListingDefaultType[] {
    const fav = localStorage.getItem("rentals_fav");
    return fav ? JSON.parse(fav) : [];
  },

  getFavouriteIdList(): number[] {
    const fav = localStorage.getItem("rentals_pks");
    return fav ? JSON.parse(fav) : [];
  },

  saveFavourite(data: ListingDefaultType) {
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
