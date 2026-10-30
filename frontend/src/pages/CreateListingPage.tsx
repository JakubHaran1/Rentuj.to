import { useForm } from "react-hook-form";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import type { PropertyDetailType } from "../types";
import { PropertiesService } from "../services/propertiesService";

type CreateFormState = Omit<
  PropertyDetailType,
  "latitude" | "longitude" | "owner"
>;

function CreateListing() {
  const formCreate = useForm<CreateFormState>({
    defaultValues: {
      property: {
        title: "",
        city: "",
        street: "",
        home_number: 0,
        flat_number: 0,
        floor_number: 0,
      },
      description: "",
      number_of_levels: 0,
      number_of_rooms: 0,
      square_meters: 0,
      price: 0,
    },
  });

  const onSubmitCreate = async (data: CreateFormState) => {
    const dataToSend = { latitude: 123, longitude: 123, ...data };

    const resp = await PropertiesService.createPropertyItem(dataToSend);
    console.log(resp);
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

        <form
          className="space-y-8"
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
              <Input
                label="City"
                maxLength={80}
                {...formCreate.register("property.city", {
                  required: "City field is required",
                })}
              />

              <Input
                label="Street"
                maxLength={80}
                {...formCreate.register("property.street", {
                  required: "Street field is required",
                })}
              />
              <Input
                label="Home number"
                type="number"
                min={0}
                {...formCreate.register("property.home_number", {
                  required: "Home number field is required",
                })}
              />
              <Input
                label="Flat number"
                type="number"
                min={0}
                {...formCreate.register("property.flat_number", {
                  required: "Flat number field is required",
                })}
              />
              <Input
                label="Floor number"
                type="number"
                min={0}
                {...formCreate.register("property.floor_number", {
                  required: "Floor number field is required",
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
                step="50"
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
