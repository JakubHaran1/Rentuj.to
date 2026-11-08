import type { UseFormReturn } from "react-hook-form";
import { useState, type ChangeEvent, type RefObject } from "react";
import type {
  CreateFormStateType,
  MainFiltersStateType,
  GeoApiResponseType,
} from "../../types/propertyTypes";
import Input from "../common/Input";
import Suggestions from "./Suggestions";
import BuildingType from "./BuildingType";
import ImgGallery from "../imgGallery/ImgGallery";
import Button from "../common/Button";
import { GeoService } from "../../services/geoService";
import type { GalleryImage } from "../../types/imgTypes";
import RentalFilters from "./RentalFilters";

type CreateListingFormProps = {
  formCreate: UseFormReturn<CreateFormStateType>;
  cityRef: RefObject<HTMLDivElement | null>;
  streetRef: RefObject<HTMLDivElement | null>;
  fieldState: string;
  setFieldState: React.Dispatch<React.SetStateAction<string>>;
  fieldSuggestion: string[];
  setFieldSuggestion: React.Dispatch<React.SetStateAction<string[]>>;
  imgs: GalleryImage[];
  setImgs: React.Dispatch<React.SetStateAction<GalleryImage[]>>;
  croppedImgs: GalleryImage[];
  setCroppedImgs: React.Dispatch<React.SetStateAction<GalleryImage[]>>;
  onSubmitCreate: (data: CreateFormStateType) => void | Promise<void>;
};

function CreateListingForm({
  formCreate,
  cityRef,
  streetRef,
  fieldState,
  setFieldState,
  fieldSuggestion,
  setFieldSuggestion,
  imgs,
  setImgs,
  croppedImgs,
  setCroppedImgs,
  onSubmitCreate,
}: CreateListingFormProps) {
  const cityField = formCreate.register("property.city", {
    required: "City field is required",
  });
  const streetField = formCreate.register("property.street", {
    required: "Street field is required",
  });
  const price = formCreate.watch("price");
  const selectedRentalFilters = formCreate.watch("filters");
  const maxPrice = 20000;

  const [mainFilters, setMainFilters] = useState<MainFiltersStateType>({
    price: 250,
    buildingType: "APARTMENT_BUILDING",
    numberOfLevels: 0,
    numberOfRooms: 1,
    squareMeters: 0,
  });

  const onAddressChange = async (
    e: ChangeEvent<HTMLInputElement>,
    type: string,
  ) => {
    const address = e.target.value;

    if (address.length < 3) return;
    const dataArr: string[] = [];
    const data = await GeoService.addressAutocomplete(address, type);

    data.forEach((prop: GeoApiResponseType) =>
      dataArr.push(prop.properties.address_line1),
    );
    setFieldState(type);
    setFieldSuggestion(dataArr);
  };

  const onMainFilterChange = <K extends keyof MainFiltersStateType>(
    key: K,
    value: MainFiltersStateType[K],
  ) => {
    setMainFilters((prev) => ({ ...prev, [key]: value }));
  };
  const onRentalFilterChange = (filterId: number, value: -1 | 0 | 1) => {
    const currentFilters = formCreate.getValues("filters");
    const nextFilters = [
      ...currentFilters.filter((filter) => filter.id !== filterId),
      { id: filterId, value },
    ];

    formCreate.setValue("filters", nextFilters, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };
  return (
    <form
      className="space-y-8"
      noValidate
      onSubmit={formCreate.handleSubmit(onSubmitCreate)}
    >
      <fieldset>
        <legend className="text-xl font-semibold text-[#16324f] dark:text-white">
          Property
        </legend>
        <div className="grid gap-x-5 md:grid-cols-2">
          <Input
            label="Title"
            maxLength={150}
            labelClassName="mt-5 md:col-span-2"
            error={formCreate.formState.errors.property?.title?.message}
            {...formCreate.register("property.title", {
              required: "Title field is required",
            })}
          />

          <div className="relative md:col-span-2" ref={cityRef}>
            <Input
              label="City"
              maxLength={80}
              error={formCreate.formState.errors.property?.city?.message}
              {...cityField}
              onChange={(e) => {
                cityField.onChange(e);
                onAddressChange(e, "city");
              }}
            />

            {fieldState !== "city" || fieldSuggestion.length == 0 ? (
              ""
            ) : (
              <div className="absolute w-full z-20">
                <Suggestions
                  suggestions={fieldSuggestion}
                  getKey={(suggestion) => suggestion}
                  renderSuggestion={(suggestion) => suggestion}
                  onSuggestionClick={(suggestion) => {
                    formCreate.setValue("property.city", suggestion, {
                      shouldValidate: true,
                      shouldDirty: true,
                    });
                    setFieldState("");
                    setFieldSuggestion([]);
                  }}
                />
              </div>
            )}
          </div>

          <div className="relative" ref={streetRef}>
            <Input
              label="Street"
              maxLength={80}
              error={formCreate.formState.errors.property?.street?.message}
              {...streetField}
              onChange={(e) => {
                streetField.onChange(e);
                onAddressChange(e, "street");
              }}
            />

            {fieldState !== "street" || fieldSuggestion.length == 0 ? (
              ""
            ) : (
              <div className="absolute w-full z-20">
                <Suggestions
                  suggestions={fieldSuggestion}
                  getKey={(suggestion) => suggestion}
                  renderSuggestion={(suggestion) => suggestion}
                  onSuggestionClick={(suggestion) => {
                    formCreate.setValue("property.street", suggestion, {
                      shouldValidate: true,
                      shouldDirty: true,
                    });
                    setFieldState("");
                    setFieldSuggestion([]);
                  }}
                />
              </div>
            )}
          </div>
          <Input
            label="Home number"
            type="number"
            min={0}
            error={formCreate.formState.errors.property?.home_number?.message}
            {...formCreate.register("property.home_number", {
              required: "Home number field is required",
              valueAsNumber: true,
            })}
          />
          <Input
            label="Floor number"
            type="number"
            min={0}
            error={formCreate.formState.errors.property?.floor_number?.message}
            {...formCreate.register("property.floor_number", {
              required: "Floor number field is required",
              valueAsNumber: true,
            })}
          />
        </div>
      </fieldset>
      <fieldset>
        <legend className="text-xl font-semibold text-[#16324f] dark:text-white">
          Property details
        </legend>
        <div className="grid gap-x-5 md:grid-cols-2">
          <Input
            label="Number of levels"
            type="number"
            min={0}
            error={formCreate.formState.errors.number_of_levels?.message}
            {...formCreate.register("number_of_levels", {
              required: "Number of levels field is required",
            })}
          />
          <Input
            label="Number of rooms"
            type="number"
            min={1}
            error={formCreate.formState.errors.number_of_rooms?.message}
            {...formCreate.register("number_of_rooms", {
              required: "Number of rooms field is required",
            })}
          />
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
                onChange={(event) => {
                  const nextPrice = Math.min(
                    maxPrice,
                    Math.max(0, Number(event.target.value)),
                  );
                  formCreate.setValue("price", nextPrice, {
                    shouldDirty: true,
                    shouldValidate: true,
                  });
                }}
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
            label="Square meters"
            type="number"
            min={0}
            step="0.01"
            error={formCreate.formState.errors.square_meters?.message}
            {...formCreate.register("square_meters", {
              required: "Square meters field is required",
            })}
          />
          <div className="mt-4">
            <BuildingType
              error={formCreate.formState.errors.building_type?.message}
              {...formCreate.register("building_type", {
                required: "Building type field is required",
              })}
            />
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
      <RentalFilters
        mainFilters={mainFilters}
        onMainFilterChange={onMainFilterChange}
        onRentalFilterChange={onRentalFilterChange}
        selectedRentalFilters={selectedRentalFilters}
        // mode="set"
      />
      <ImgGallery
        imgs={imgs}
        setImgs={setImgs}
        croppedImgs={croppedImgs}
        setCroppedImgs={setCroppedImgs}
      />

      <Button type="submit">Create listing</Button>
    </form>
  );
}

export default CreateListingForm;
