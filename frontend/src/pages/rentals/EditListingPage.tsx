import { AxiosError } from "axios";
import Button from "../../components/common/Button";
import CreateListingForm from "../../components/createListings/CreateListingForm";
import { useParams } from "react-router-dom";
import { RentalService } from "../../services/RentalService";
import { useEffect, useState } from "react";
import type {
  ListingCreateType,
  PropertyCoordinatesType,
} from "../../types/propertyTypes";
import { handleDrfGetError } from "../../services/helpers";

import ErrorMessage from "../../components/common/ErrorMessage";
import type { GalleryImage } from "../../types/imgTypes";
import { FormProvider, useForm } from "react-hook-form";

function EditRentalPage() {
  const { pk } = useParams();
  const [rentalError, setRentalError] = useState("");

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
  });
  const { reset } = formCreate;
  useEffect(() => {
    async function handlegetListingDetail() {
      try {
        if (!pk) throw new AxiosError("No rental identifier");
        const resp = await RentalService.getListingDetail(pk);

        setImgs(resp.apartment_photos);
        reset(RentalService.toListingFormState(resp));
      } catch (error: unknown) {
        handleDrfGetError(error, setRentalError);
      }
    }
    handlegetListingDetail();
  }, [reset, pk]);

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
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-[#16324f] dark:text-white">
              Edit listing
            </h1>
            <p className="mt-2 text-sm text-[#6b7280] dark:text-slate-300">
              Update the property details shown in your listing.
            </p>
          </div>
          <Button to="/my-listings" variant="secondary">
            Back to my listings
          </Button>
        </div>
        {rentalError ? (
          <ErrorMessage txt={rentalError} />
        ) : !imgs.length ? (
          <p className="text-sm text-[#6b7280] dark:text-slate-400">
            Loading...
          </p>
        ) : (
          <FormProvider {...formCreate}>
            <CreateListingForm
              imgs={imgs}
              setImgs={setImgs}
              croppedImgs={croppedImgs}
              setCroppedImgs={setCroppedImgs}
              onSubmitForm={onSubmitForm}
              mode="edit"
            />
          </FormProvider>
        )}
      </section>
    </main>
  );
}

export default EditRentalPage;
