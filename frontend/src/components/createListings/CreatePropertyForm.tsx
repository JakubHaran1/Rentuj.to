import { Controller, useFormContext } from "react-hook-form";
import type { ListingCreateType } from "../../types/propertyTypes";
import Input from "../common/Input";
import BuildingType from "./BuildingType";

import SuggestionField from "../suggestions/SuggestionField";

function CreatePropertyForm() {
  const formCreate = useFormContext<ListingCreateType>();

  return (
    <>
      <fieldset>
        <legend className="text-xl font-semibold text-[#16324f] dark:text-white">
          Property
        </legend>
        <div className="grid gap-x-5 md:grid-cols-2">
          <Controller
            name="city"
            control={formCreate.control}
            rules={{ required: "City field is required" }}
            render={({ field, fieldState }) => (
              <SuggestionField
                className="relative md:col-span-2"
                label="City"
                type="city"
                value={field.value ?? ""}
                onChange={field.onChange}
                onBlur={field.onBlur}
                name={field.name ?? ""}
                inputRef={field.ref}
                error={fieldState.error?.message}
                placeholder="e.g. Warsaw"
              />
            )}
          />
          <Controller
            name="street"
            control={formCreate.control}
            rules={{ required: "Street field is required" }}
            render={({ field, fieldState }) => (
              <SuggestionField
                className="relative "
                label="Street"
                type="street"
                value={field.value ?? ""}
                onChange={field.onChange}
                onBlur={field.onBlur}
                name={field.name ?? ""}
                inputRef={field.ref}
                error={fieldState.error?.message}
                placeholder="e.g. ul.Jana Pawla II"
              />
            )}
          />

          <Input
            label="Home number"
            type="number"
            min={0}
            error={formCreate.formState.errors.home_number?.message}
            {...formCreate.register("home_number", {
              required: "Home number field is required",
              valueAsNumber: true,
            })}
          />
          <Input
            label="Floor number"
            type="number"
            min={0}
            error={formCreate.formState.errors.floor_number?.message}
            {...formCreate.register("floor_number", {
              required: "Floor number field is required",
              valueAsNumber: true,
            })}
          />

          <Input
            label="Number of levels"
            type="number"
            min={0}
            error={formCreate.formState.errors.number_of_levels?.message}
            {...formCreate.register("number_of_levels", {
              required: "Number of levels field is required",
              valueAsNumber: true,
            })}
          />
          <Input
            label="Number of rooms"
            type="number"
            min={1}
            error={formCreate.formState.errors.number_of_rooms?.message}
            {...formCreate.register("number_of_rooms", {
              required: "Number of rooms field is required",
              valueAsNumber: true,
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
              valueAsNumber: true,
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
        </div>
      </fieldset>
    </>
  );
}

export default CreatePropertyForm;
