// import { useForm } from "react-hook-form";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import type { PropertyDetailType } from "../types";
import { PropertiesService } from "../services/propertiesService";
import { GeoService } from "../services/geoService";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { useForm } from "react-hook-form";

type CreateFormStateType = Omit<
  PropertyDetailType,
  "latitude" | "longitude" | "owner"
> & { address: string };

type GeoApiResponseType = {
  properties: {
    address_line1: string;
  };
};

function CreateListing() {
  const [fieldState, setFieldState] = useState("");
  const [fieldSuggestion, setFieldSuggestion] = useState<string[]>([]);
  const cityRef = useRef<HTMLDivElement>(null);
  const streetRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState<{
    formatted: string;
    lat: string;
    lon: string;
  }>({ formatted: "", lat: "", lon: "" });
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
    console.log("c");

    const { city, street, home_number } = data.property;
    console.log("c", data.property.title);

    const coordinates_data = await GeoService.geocoding(
      city,
      street,
      home_number,
    );
    // if (coordinates_data.length > 1) {
    //   console.log("we can not localize your apartment, (add a choose logic )");
    //   return;

    const coordinate = coordinates_data[0];
    const { formatted, lat, lon } = coordinate;
    setCoords({ formatted, lat, lon });
    const dataToSend = { latitude: lat, longitude: lon, ...data };
    const resp = await PropertiesService.createPropertyItem(dataToSend);
    console.log(resp);
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
                {...formCreate.register("property.title", {
                  required: "Title field is required",
                })}
              />

              <div className="relative md:col-span-2" ref={cityRef}>
                <Input
                  label="City"
                  maxLength={80}
                  {...cityField}
                  onChange={(e) => {
                    cityField.onChange(e);
                    void onAddressChange(e, "city");
                  }}
                />

                {fieldState !== "city" || fieldSuggestion.length == 0 ? (
                  ""
                ) : (
                  <ul className="absolute z-20 mt-2 max-h-72 w-full overflow-y-auto rounded-xl border border-[#c2c9d2] bg-white py-1 text-sm text-[#1f2937] shadow-xl ring-1 ring-black/5 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:ring-white/10">
                    {fieldSuggestion.map((suggestion) => (
                      <li
                        key={suggestion}
                        className="border-b border-slate-100 last:border-b-0 dark:border-slate-800"
                      >
                        <button
                          type="button"
                          className="block w-full px-4 py-3 text-left transition-colors hover:bg-slate-100 focus:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#2f80ed] dark:hover:bg-slate-800 dark:focus:bg-slate-800"
                          onClick={() => {
                            formCreate.setValue("property.city", suggestion, {
                              shouldValidate: true,
                              shouldDirty: true,
                            });
                            setFieldState("");
                          }}
                        >
                          {suggestion}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="relative" ref={streetRef}>
                <Input
                  label="Street"
                  maxLength={80}
                  {...streetField}
                  onChange={(e) => {
                    streetField.onChange(e);
                    void onAddressChange(e, "street");
                  }}
                />

                {fieldState !== "street" || fieldSuggestion.length == 0 ? (
                  ""
                ) : (
                  <ul className="absolute z-20 mt-2 max-h-72 w-full overflow-y-auto rounded-xl border border-[#c2c9d2] bg-white py-1 text-sm text-[#1f2937] shadow-xl ring-1 ring-black/5 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:ring-white/10">
                    {fieldSuggestion.map((suggestion) => (
                      <li
                        key={suggestion}
                        className="border-b border-slate-100 last:border-b-0 dark:border-slate-800"
                      >
                        <button
                          type="button"
                          className="block w-full px-4 py-3 text-left transition-colors hover:bg-slate-100 focus:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#2f80ed] dark:hover:bg-slate-800 dark:focus:bg-slate-800"
                          onClick={() => {
                            formCreate.setValue("property.street", suggestion, {
                              shouldValidate: true,
                              shouldDirty: true,
                            });
                            setFieldState("");
                            setFieldSuggestion([]);
                          }}
                        >
                          {suggestion}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <Input
                label="Home number"
                type="number"
                min={0}
                {...formCreate.register("property.home_number", {
                  required: "Home number field is required",
                  valueAsNumber: true,
                })}
              />
              <Input
                label="Flat number"
                type="number"
                min={0}
                {...formCreate.register("property.flat_number", {
                  required: "Flat number field is required",
                  valueAsNumber: true,
                })}
              />
              <Input
                label="Floor number"
                type="number"
                min={0}
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
                {...formCreate.register("number_of_levels", {
                  required: "Number of levels field is required",
                })}
              />
              <Input
                label="Number of rooms"
                type="number"
                min={1}
                {...formCreate.register("number_of_rooms", {
                  required: "Number of rooms field is required",
                })}
              />
              <Input
                label="Price"
                type="number"
                min={0}
                {...formCreate.register("price", {
                  required: "Price field is required",
                })}
              />
              <Input
                label="Square meters"
                type="number"
                min={0}
                step="0.01"
                {...formCreate.register("square_meters", {
                  required: "Square meters field is required",
                })}
              />
              <label className="mt-5 block text-sm font-medium text-[#1f2937] dark:text-slate-200 md:col-span-2">
                Description
                <textarea
                  maxLength={250}
                  rows={5}
                  className="mt-1.5 w-full resize-y rounded-lg border border-[#c2c9d2] bg-white px-3 py-2.5 text-sm outline-none transition placeholder:text-[#9ca3af] focus:border-[#2f80ed] focus:ring-2 focus:ring-[#2f80ed]/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  {...formCreate.register("description", {
                    required: "Description field is required",
                  })}
                />
              </label>
            </div>
          </fieldset>

          <fieldset>
            <legend className="text-xl font-semibold text-[#16324f] dark:text-white">
              Apartment photos
            </legend>
            <Input
              label="Images"
              type="file"
              accept="image/*"
              multiple
              {...formCreate.register("apartment_photos")}
            />
          </fieldset>

          <Button type="submit">Create listing</Button>
        </form>
      </section>
    </main>
  );
}

export default CreateListing;
