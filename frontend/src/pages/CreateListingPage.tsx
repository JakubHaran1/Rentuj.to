import { FormProvider, useForm } from "react-hook-form";
import { useState } from "react";

import type { GalleryImage } from "../types/imgTypes";
import type {
  CreateFormStateType,
  ListingCoordinatesType,
} from "../types/propertyTypes";

import { RentalService } from "../services/RentalService";
import CreateListingForm from "../components/createListings/CreateListingForm";
function CreateListing() {
  const [imgs, setImgs] = useState<GalleryImage[]>([]);
  const [croppedImgs, setCroppedImgs] = useState<GalleryImage[]>([]);

  const formCreate = useForm<CreateFormStateType>({
    defaultValues: {
      address: "",
      description: "",
      number_of_levels: 0,
      number_of_rooms: 0,
      square_meters: 0,
      price: 0,
      building_type: "APARTMENT_BUILDING",
      date_active: "",
      filters: [],
      property: {
        title: "",
        city: "",
        street: "",
        home_number: 0,
        floor_number: 0,
      },
    },
  });

  const onSubmitCreate = async (
    data: CreateFormStateType,
    imgs: GalleryImage[],
    croppedImgs: GalleryImage[],
    coordinates: ListingCoordinatesType,
  ) => {
    const apartmentPhotos = imgs
      .map(
        (image) =>
          croppedImgs.find((croppedImage) => croppedImage.id === image.id) ??
          image,
      )
      .map((image) => image.file)
      .filter((file) => file.size > 0);

    const dataToSend = {
      ...data,
      date_active: data.date_active || null,
      latitude: coordinates.latitude,
      longitude: coordinates.longitude,
      apartment_photos: apartmentPhotos,
    };

    await RentalService.createPropertyItem(dataToSend);
    setImgs([]);
    setCroppedImgs([]);
  };

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="rounded-2xl border border-[#c2c9d2] bg-[#e9edf2] p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-[#16324f] dark:text-white">
            Create a listing
          </h1>
          <p className="mt-2 text-sm text-[#6b7280] dark:text-slate-300">
            Add the property details that will be shown in your listing.
          </p>
        </div>
        <FormProvider {...formCreate}>
          <CreateListingForm
            imgs={imgs}
            setImgs={setImgs}
            croppedImgs={croppedImgs}
            setCroppedImgs={setCroppedImgs}
            onSubmitCreate={onSubmitCreate}
          />
        </FormProvider>
      </section>
    </main>
  );
}

export default CreateListing;
