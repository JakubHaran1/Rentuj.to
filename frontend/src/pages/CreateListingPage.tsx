import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { useForm } from "react-hook-form";

import Button from "../components/common/Button";
import Input from "../components/common/Input";
import ImgGallery from "../components/imgGallery/ImgGallery";
import Suggestions from "../components/create_listings/Suggestions";
import type { GalleryImage } from "../components/imgGallery/imgTypes";
import type { CreateFormStateType } from "../types";

import { PropertiesService } from "../services/propertiesService";
import { GeoService } from "../services/geoService";
type coordsType = {
  address_line1: string;
  formatted: string;
  lat: string;
  lon: string;
};
type GeoApiResponseType = {
  properties: {
    address_line1: string;
    formatted: string;
    lat: number;
    lon: number;
  };
};

const emptyCoords: coordsType = {
  address_line1: "",
  formatted: "",
  lat: "",
  lon: "",
};

function CreateListing() {
  const [fieldState, setFieldState] = useState("");
  const [fieldSuggestion, setFieldSuggestion] = useState<string[]>([]);

  const cityRef = useRef<HTMLDivElement>(null);
  const streetRef = useRef<HTMLDivElement>(null);

  const [coords, setCoords] = useState<coordsType>(emptyCoords);

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
      property: {
        title: "",
        city: "",
        street: "",
        home_number: 0,
        flat_number: 0,
        floor_number: 0,
      },
    },
  });
  const resetCreateForm = () => {
    formCreate.reset();
    setCoords(emptyCoords);
    setFieldState("");
    setFieldSuggestion([]);
    setImgs([]);
    setCroppedImgs([]);
  };
  const cityField = formCreate.register("property.city", {
    required: "City field is required",
  });
  const streetField = formCreate.register("property.street", {
    required: "Street field is required",
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

  const onSubmitCreate = async (data: CreateFormStateType) => {
    setFieldSuggestion([]);

    const apartmentPhotos = imgs
      .map(
        (image) =>
          croppedImgs.find((croppedImage) => croppedImage.id === image.id) ??
          image,
      )
          .map((image) => image.file)
          .filter((file) => file.size > 0);

    const { city, street, home_number } = data.property;
    console.log("c", data.property.title);

    const coordinates_data = await GeoService.geocoding<GeoApiResponseType[]>(
      city,
      street,
      home_number,
    );

    const locations = coordinates_data.map(
      ({ properties: { address_line1, formatted, lat, lon } }): coordsType => ({
        address_line1,
        formatted,
        lat: String(lat),
        lon: String(lon),
      }),
    );

    if (locations.length !== 1) {
      setCoords(emptyCoords);
      const dataToSend = {
        ...data,
        latitude: null,
        longitude: null,
        apartment_photos: apartmentPhotos,
      };

      await PropertiesService.createPropertyItem(dataToSend);
      resetCreateForm();
      return;
    }

    const coordinate = locations[0];
    if (!coordinate) {
      setCoords(emptyCoords);
      const dataToSend = {
        ...data,
        latitude: null,
        longitude: null,
        apartment_photos: apartmentPhotos,
      };
      await PropertiesService.createPropertyItem(dataToSend);
      resetCreateForm();
      return;
    }

    const { address_line1, formatted, lat, lon } = coordinate;
    setCoords({ address_line1, formatted, lat, lon });
    const dataToSend = {
      ...data,
      latitude: Number(lat),
      longitude: Number(lon),
      apartment_photos: apartmentPhotos,
    };

    await PropertiesService.createPropertyItem(dataToSend);
    resetCreateForm();
  };

  useEffect(() => {
    const closeSuggestionList = (e: MouseEvent) => {
      if (!(e.target instanceof Node)) return;
      if (
        !cityRef.current?.contains(e.target) &&
        !streetRef.current?.contains(e.target)
      ) {
        setFieldState("");
        setFieldSuggestion([]);
      }
    };
    document.addEventListener("click", closeSuggestionList);
  }, []);

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="rounded-2xl border border-[#c2c9d2] bg-[#e9edf2] p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-[#16324f] dark:text-white">
            Create a listing
          </h1>
          <p className="mt-2 text-sm text-[#6b7280] dark:text-slate-300">
            Add the property details that will be shown in your listing.
            {coords.formatted}
          </p>
        </div>
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
                    setCoords(emptyCoords);
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
                    setCoords(emptyCoords);
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
                error={
                  formCreate.formState.errors.property?.home_number?.message
                }
                {...formCreate.register("property.home_number", {
                  required: "Home number field is required",
                  valueAsNumber: true,
                })}
              />
              <Input
                label="Flat number"
                type="number"
                min={0}
                error={
                  formCreate.formState.errors.property?.flat_number?.message
                }
                {...formCreate.register("property.flat_number", {
                  required: "Flat number field is required",
                  valueAsNumber: true,
                })}
              />
              <Input
                label="Floor number"
                type="number"
                min={0}
                error={
                  formCreate.formState.errors.property?.floor_number?.message
                }
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
                error={
                  formCreate.formState.errors.number_of_levels?.message
                }
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
              <Input
                label="Price"
                type="number"
                min={0}
                error={formCreate.formState.errors.price?.message}
                {...formCreate.register("price", {
                  required: "Price field is required",
                })}
              />
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
          <ImgGallery
            imgs={imgs}
            setImgs={setImgs}
            croppedImgs={croppedImgs}
            setCroppedImgs={setCroppedImgs}
          />

          <Button type="submit">Create listing</Button>
        </form>
      </section>
    </main>
  );
}

export default CreateListing;
