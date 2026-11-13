import { AxiosError } from "axios";
import Button from "../components/common/Button";
import CreateListingForm from "../components/createListings/CreateListingForm";
import { useParams } from "react-router-dom";
import { RentalService } from "../services/RentalService";
import { useEffect, useState } from "react";
import type {
  CreateListingType,
  PropertyCoordinatesType,
  PropertyListingType,
} from "../types/propertyTypes";
import { handleDrfGetError } from "../services/helpers";

import ErrorMessage from "../components/common/ErrorMessage";
import type { GalleryImage } from "../types/imgTypes";

function EditListingPage() {
  const { pk } = useParams();
  const [rentalError, setRentalError] = useState("");

  const [rentalOffert, setRentalOffert] = useState<PropertyListingType | null>(
    null,
  );
  const [imgs, setImgs] = useState<GalleryImage[]>([]);
  const [croppedImgs, setCroppedImgs] = useState<GalleryImage[]>([]);

  useEffect(() => {
    async function handlegetPropertyDetail() {
      try {
        if (!pk) throw new AxiosError("No rental identifier");
        const resp = await RentalService.getPropertyDetail(pk);

        setRentalOffert(resp);
        setImgs(resp.apartment_photos);
      } catch (error: unknown) {
        handleDrfGetError(error, setRentalError);
      }
    }
    handlegetPropertyDetail();
  }, [pk]);

  const onSubmitForm = async (
    data: CreateListingType,
    imgs: GalleryImage[],
    croppedImgs: GalleryImage[],
    coordinates: PropertyCoordinatesType,
  ) => {
    const dataToSend = RentalService.preparePropertyDataToSend(
      data,
      imgs,
      croppedImgs,
      coordinates,
    );

    await RentalService.createPropertyItem(dataToSend);
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
        ) : !rentalOffert ? (
          <p className="text-sm text-[#6b7280] dark:text-slate-400">
            Loading...
          </p>
        ) : (
          <CreateListingForm
            initialData={RentalService.toFormState(rentalOffert)}
            imgs={imgs}
            setImgs={setImgs}
            croppedImgs={croppedImgs}
            setCroppedImgs={setCroppedImgs}
            onSubmitForm={onSubmitForm}
          />
        )}
      </section>
    </main>
  );
}

export default EditListingPage;
