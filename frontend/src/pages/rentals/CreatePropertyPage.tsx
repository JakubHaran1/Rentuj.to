import { useForm } from "react-hook-form";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import BuildingType from "../../components/createListings/BuildingType";
import type { PropertyDefaultType } from "../../types/propertyTypes";

function CreatePropertyPage() {
  const formCreate = useForm<PropertyDefaultType>({
    defaultValues: {
      title: "",
      city: "",
      street: "",
      home_number: 0,
      floor_number: 0,
      number_of_levels: 0,
      number_of_rooms: 0,
      square_meters: 0,
      building_type: "APARTMENT_BUILDING",
    },
  });

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="rounded-2xl border border-[#c2c9d2] bg-[#e9edf2] p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-[#16324f] dark:text-white">
            Add property
          </h1>
          <p className="mt-2 text-sm text-[#6b7280] dark:text-slate-300">
            Enter the details of the property.
          </p>
        </div>

        <form
          className="space-y-8"
          onSubmit={(event) => event.preventDefault()}
        >
          <fieldset>
            <legend className="text-xl font-semibold text-[#16324f] dark:text-white">
              Property details
            </legend>
            <div className="grid gap-x-5 md:grid-cols-2">
              <Input
                label="Title"
                maxLength={150}
                labelClassName="mt-5 md:col-span-2"
                {...formCreate.register("title", {
                  required: "Tis field is required",
                })}
              />
              <Input
                label="City"
                placeholder="Enter a city of your property"
                maxLength={80}
                labelClassName="mt-5 md:col-span-2"
                {...formCreate.register("city", {
                  required: "Tis field is required",
                })}
              />
              <Input
                label="Street"
                placeholder="Enter a street of your property"
                maxLength={80}
                labelClassName="mt-5 md:col-span-2"
                {...formCreate.register("street", {
                  required: "Tis field is required",
                })}
              />
              <Input
                label="Home number"
                type="number"
                placeholder="Home number a street of your property"
                min={1}
                labelClassName="mt-5 md:col-span-2"
                {...formCreate.register("home_number", {
                  required: "Tis field is required",
                })}
              />
              <Input
                label="Floor number"
                type="number"
                placeholder="Floor number a street of your property"
                min={1}
                {...formCreate.register("floor_number", {
                  required: "Tis field is required",
                })}
              />
              <Input
                label="Number of levels"
                type="number"
                placeholder="Number of levels a street of your property"
                min={1}
                {...formCreate.register("number_of_levels", {
                  required: "Tis field is required",
                })}
              />
              <Input
                label="Number of rooms"
                type="number"
                placeholder="Number of rooms a street of your property"
                min={1}
                {...formCreate.register("number_of_rooms", {
                  required: "Tis field is required",
                })}
              />
              <Input
                label="Square meters"
                type="number"
                placeholder="Square meters a street of your property"
                min={1}
                step="0.1"
                {...formCreate.register("square_meters", {
                  required: "Tis field is required",
                })}
              />
              <div className="mt-4">
                <BuildingType />
              </div>
            </div>
          </fieldset>

          <div className="flex flex-wrap justify-end gap-3">
            <Button to="/my-listings" variant="secondary">
              Cancel
            </Button>
            <Button type="button" variant="primary">
              Add property
            </Button>
          </div>
        </form>
      </section>
    </main>
  );
}

export default CreatePropertyPage;
