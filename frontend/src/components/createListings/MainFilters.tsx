import { useFormContext } from "react-hook-form";
import type { SearchFiltersType } from "../../types/propertyTypes";
import Input from "../common/Input";
import BuildingType from "./BuildingType";

type MainFiltersProps = {
  expanded: boolean;
};

function MainFilters({ expanded }: MainFiltersProps) {
  const { register, setValue, watch } = useFormContext<SearchFiltersType>();
  const mainFilters = watch("mainFilters");
  const maxPrice = 200000000;

  return (
    <div
      className={`main-filters-container grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 ${
        !expanded ? "max-h-56 overflow-hidden" : "max-h-[1000px]"
      } transition-[max-height] duration-[500ms] ease-linear`}
    >
      <div className="main-filter-el flex w-full min-w-0 items-center justify-center overflow-hidden rounded-xl border border-[#c2c9d2] bg-white px-3 py-2 shadow-sm dark:border-slate-700 dark:bg-slate-950">
        <div className="flex w-full items-center gap-3">
          <Input
            className="mt-0 w-28"
            labelClassName="mt-0 text-xs"
            label="Maximum price"
            placeholder="e.g. 3000"
            min={0}
            max={maxPrice}
            step={1}
            type="number"
            value={mainFilters.price__lte}
            onChange={(event) =>
              setValue(
                "mainFilters.price__lte",
                event.target.value === "" ? "" : Number(event.target.value),
                { shouldDirty: true },
              )
            }
          />
          <span className="mt-4 text-xs text-[#6b7280] dark:text-slate-300">
            PLN
          </span>
        </div>
      </div>
      <div
        className={`main-filter-el w-full min-w-0 rounded-xl border border-[#c2c9d2] bg-white px-3 py-2 shadow-sm dark:border-slate-700 dark:bg-slate-950 ${
          !expanded ? "opacity-25 sm:opacity-100" : ""
        }`}
      >
        <BuildingType
          className="w-full mt-0"
          allowEmpty
          {...register("mainFilters.building_type")}
        />
      </div>
      <div
        className={`main-filter-el w-full min-w-0 rounded-xl border border-[#c2c9d2] bg-white px-3 py-2 shadow-sm dark:border-slate-700 dark:bg-slate-950 ${
          !expanded ? "opacity-25 md:opacity-100" : ""
        }`}
      >
        <Input
          className="mt-0 w-full py-1"
          labelClassName="mt-0 text-xs"
          label="Levels"
          placeholder="e.g. 1"
          min={0}
          step={1}
          type="number"
          value={mainFilters.number_of_levels}
          onChange={(event) =>
            setValue(
              "mainFilters.number_of_levels",
              event.target.value === ""
                ? ""
                : Math.max(0, Number(event.target.value)),
              {
                shouldDirty: true,
              },
            )
          }
        />
      </div>
      <div
        className={`main-filter-el w-full min-w-0 rounded-xl border border-[#c2c9d2] bg-white px-3 py-2 shadow-sm dark:border-slate-700 dark:bg-slate-950 ${
          !expanded ? "opacity-25 xl:opacity-100" : ""
        }`}
      >
        <Input
          className="mt-0 w-full py-1"
          labelClassName="mt-0 text-xs"
          label="Rooms"
          placeholder="e.g. 2"
          min={0}
          step={1}
          type="number"
          value={mainFilters.number_of_rooms}
          onChange={(event) =>
            setValue(
              "mainFilters.number_of_rooms",
              event.target.value === ""
                ? ""
                : Math.max(1, Number(event.target.value)),
              {
                shouldDirty: true,
              },
            )
          }
        />
      </div>
      <div
        className={`main-filter-el w-full min-w-0 rounded-xl border border-[#c2c9d2] bg-white px-3 py-2 shadow-sm dark:border-slate-700 dark:bg-slate-950 ${
          !expanded ? "opacity-25 xl:opacity-100" : ""
        }`}
      >
        <Input
          className="mt-0 w-full py-1"
          labelClassName="mt-0 text-xs"
          label="Area (m²)"
          placeholder="e.g. 50"
          min={0}
          step={0.5}
          type="number"
          value={mainFilters.square_meters__gte}
          onChange={(event) =>
            setValue(
              "mainFilters.square_meters__gte",
              event.target.value === ""
                ? ""
                : Math.max(0, Number(event.target.value)),
              {
                shouldDirty: true,
              },
            )
          }
        />
      </div>
    </div>
  );
}

export default MainFilters;
