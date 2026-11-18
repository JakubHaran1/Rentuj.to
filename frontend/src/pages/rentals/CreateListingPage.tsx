import { FormProvider, useForm } from "react-hook-form";
import { useState } from "react";

import type { GalleryImage } from "../../types/imgTypes";
import type {
  ListingCreateType,
  PropertyCoordinatesType,
} from "../../types/propertyTypes";

import { RentalService } from "../../services/RentalService";
import CreateListingForm from "../../components/createListings/CreateListingForm";
function CreateListing() {
  const [imgs, setImgs] = useState<GalleryImage[]>([]);
  const [croppedImgs, setCroppedImgs] = useState<GalleryImage[]>([]);

  const formCreate = useForm<ListingCreateType>({
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      date_active: "",
      filters: [],
      apartment_photos: [],
      property: {
        title: "",
        city: "",
        street: "",
        home_number: 0,
        floor_number: 0,
        number_of_levels: 0,
        number_of_rooms: 0,
        square_meters: 0,
        building_type: "APARTMENT_BUILDING",
        latitude: null,
        longitude: null,
      },
    },
  });

  const onSubmitForm = async (
    data: ListingCreateType,
    imgs: GalleryImage[],
    croppedImgs: GalleryImage[],
    coordinates: PropertyCoordinatesType,
  ) => {
    const dataToSend = RentalService.prepareListingDataToSend(
      data,
      imgs,
      croppedImgs,
      coordinates,
    );

    await RentalService.createListingItem(dataToSend);
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
            onSubmitForm={onSubmitForm}
            mode="create"
          />
        </FormProvider>
      </section>
    </main>
  );
}

export default CreateListing;
