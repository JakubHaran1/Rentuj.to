import { privateApi } from "../api/private";
import { publicApi } from "../api/public";
import type { GalleryImage } from "../types/imgTypes";
import type {
  ListingCreateType,
  PropertyCoordinatesType,
  ListingDefaultType,
  ListingFilterNameType,
} from "../types/propertyTypes";

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
      ...coordinates,
      apartment_photos: apartmentPhotos,
    };
    return dataToSend;
  },

  toListingFormState(listing: ListingDefaultType): ListingCreateType {
    return {
      title: listing.title,
      city: listing.city,
      street: listing.street,
      home_number: listing.home_number,
      floor_number: listing.floor_number,
      number_of_levels: listing.number_of_levels,
      number_of_rooms: listing.number_of_rooms,
      square_meters: listing.square_meters,
      building_type: listing.building_type,
      latitude: listing.latitude,
      longitude: listing.longitude,
      apartment_photos: listing.apartment_photos,
      description: listing.description,
      price: listing.price,
      date_active: listing.date_active,
      filters: listing.filters.map(({ pk, value }) => ({ pk, value })),
    };
  },

  // Listing related methods
  async getListingsList(query_param = ""): Promise<ListingDefaultType[]> {
    const resp = await publicApi.get<ListingDefaultType[]>("rentals/listings", {
      params: {
        owner_id: query_param || undefined,
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
      JSON.stringify(listingData),
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
