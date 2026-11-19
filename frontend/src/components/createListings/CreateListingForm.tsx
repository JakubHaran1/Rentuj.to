import { useFormContext } from "react-hook-form";
import type { Dispatch, SetStateAction } from "react";
import type {
  GeoApiResponseType,
  ListingCreateType,
  PropertyCoordinatesType,
} from "../../types/propertyTypes";
import Input from "../common/Input";
import ImgGallery from "../imgGallery/ImgGallery";
import Button from "../common/Button";
import ErrorMessage from "../common/ErrorMessage";
import { handleDrfPostError } from "../../services/helpers";
import { GeoService } from "../../services/geoService";
import type { GalleryImage } from "../../types/imgTypes";
import CreatePropertyForm from "./CreatePropertyForm";
import RentalFilters from "./RentalFilters";

const listingFields = [
  "title",
  "description",
  "price",
  "date_active",
  "city",
  "street",
  "home_number",
  "floor_number",
  "number_of_levels",
  "number_of_rooms",
  "square_meters",
  "building_type",
] as const;

type CreateListingFormProps = {
  imgs: GalleryImage[];
  setImgs: Dispatch<SetStateAction<GalleryImage[]>>;
  croppedImgs: GalleryImage[];
  setCroppedImgs: Dispatch<SetStateAction<GalleryImage[]>>;
  mode: "create" | "edit";

  onSubmitForm: (
    data: ListingCreateType,
    imgs: GalleryImage[],
    croppedImgs: GalleryImage[],
    coordinates: PropertyCoordinatesType,
  ) => void | Promise<void>;
};

function CreateListingForm({
  imgs,
  setImgs,
  croppedImgs,
  setCroppedImgs,
  onSubmitForm,
  mode = "create",
}: CreateListingFormProps) {
  const formCreate = useFormContext<ListingCreateType>();

  const price = formCreate.watch("price");
  const maxPrice = 20000;

  return (
    <form
      className="space-y-8"
      noValidate
      onSubmit={formCreate.handleSubmit(async (data) => {
        formCreate.clearErrors("root.server");
        try {
          const coordinatesData = await GeoService.geocoding<
            GeoApiResponseType[]
          >(
            data.city,
            data.street,
            data.home_number,
          );
          const coordinate =
            coordinatesData.length === 1
              ? coordinatesData[0]?.properties
              : undefined;
          const coordinates: PropertyCoordinatesType = {
            latitude: coordinate?.lat ?? null,
            longitude: coordinate?.lon ?? null,
          };
          await onSubmitForm(data, imgs, croppedImgs, coordinates);
          formCreate.reset();
        } catch (error: unknown) {
          const errorMessage = "Unable to submit the listing. Please try again.";
          formCreate.setError("root.server", {
            type: "server",
            message: errorMessage,
          });
          handleDrfPostError(error, formCreate, listingFields, errorMessage);
        }
      })}
    >
      <CreatePropertyForm />
      <fieldset>
        <legend className="text-xl font-semibold text-[#16324f] dark:text-white">
          Listing details
        </legend>
        <div className="grid gap-x-5 md:grid-cols-2">
          <div className="col-span-2">
            <Input
              label="Listing title"
              type="string"
              min={0}
              error={formCreate.formState.errors.title?.message}
              {...formCreate.register("title")}
            />
          </div>
          <div className="mt-5 w-full rounded-xl border border-[#c2c9d2] bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-950 md:col-span-2">
            <div className="flex items-end gap-3">
              <Input
                className="mt-0 py-1"
                labelClassName="mt-0 w-36 shrink-0 text-xs"
                label="Price"
                type="number"
                min={0}
                max={maxPrice}
                step={100}
                value={price}
                error={formCreate.formState.errors.price?.message}
                {...formCreate.register("price", {
                  required: "Price field is required",
                  valueAsNumber: true,
                  min: {
                    value: 0,
                    message: "Price cannot be negative",
                  },
                  max: {
                    value: maxPrice,
                    message: `Price cannot exceed ${maxPrice} PLN`,
                  },
                })}
              />
              <span className="mb-2 text-xs text-[#6b7280] dark:text-slate-300">
                PLN
              </span>
              <Input
                className="mt-0 py-1"
                labelClassName="mb-0 min-w-0 flex-1 text-xs"
                label="Price slider"
                type="range"
                min={0}
                max={maxPrice}
                step={100}
                value={price}
                onChange={(event) => {
                  formCreate.setValue("price", Number(event.target.value), {
                    shouldDirty: true,
                    shouldValidate: true,
                  });
                }}
              />
            </div>
          </div>
          <Input
            label="Active from"
            type="date"
            error={formCreate.formState.errors.date_active?.message}
            {...formCreate.register("date_active")}
          />
          <label className="mt-5 block text-sm font-medium text-[#1f2937] dark:text-slate-200 md:col-span-2">
            Description
            <textarea
              maxLength={250}
              rows={5}
              aria-describedby={
                formCreate.formState.errors.description
                  ? "description-error"
                  : undefined
              }
              aria-invalid={
                formCreate.formState.errors.description ? true : undefined
              }
              className="mt-1.5 w-full resize-y rounded-lg border border-[#c2c9d2] bg-white px-3 py-2.5 text-sm outline-none transition placeholder:text-[#9ca3af] focus:border-[#2f80ed] focus:ring-2 focus:ring-[#2f80ed]/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              {...formCreate.register("description", {
                required: "Description field is required",
              })}
            />
            {formCreate.formState.errors.description?.message && (
              <span
                className="mt-1 block text-sm font-normal text-red-600 dark:text-red-400"
                id="description-error"
                role="alert"
              >
                {formCreate.formState.errors.description.message}
              </span>
            )}
          </label>
        </div>
      </fieldset>
      <RentalFilters mode="set" />
      <ImgGallery
        imgs={imgs}
        setImgs={setImgs}
        croppedImgs={croppedImgs}
        setCroppedImgs={setCroppedImgs}
      />
      <ErrorMessage txt={formCreate.formState.errors.root?.server?.message} />
      {mode === "create" ? (
        <Button type="submit">Create listing</Button>
      ) : (
        <Button type="submit">Update listing</Button>
      )}
    </form>
  );
}

export default CreateListingForm;
