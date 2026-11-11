import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import type {
  CreateFormStateType,
  MainFiltersStateType,
  RentalFiltersType,
} from "../../types/propertyTypes";
import Input from "../common/Input";
import BuildingType from "./BuildingType";
import { RentalService } from "../../services/RentalService";

type MainFiltersPropsType = {
  filtersHeader?: string;
  mode?: "default" | "set";
};

type RentalFilterOption = RentalFiltersType & {
  value: -1 | 0 | 1;
};

function RentalFilters({
  filtersHeader = "Find the right fit",
  mode = "default",
}: MainFiltersPropsType) {
  const maxPrice = 20000;
  const { getValues, setValue, watch } = useFormContext<CreateFormStateType>();
  const selectedRentalFilters = watch("filters");
  const [mainFilters, setMainFilters] = useState<MainFiltersStateType>({
    price: 250,
    buildingType: "APARTMENT_BUILDING",
    numberOfLevels: 0,
    numberOfRooms: 1,
    squareMeters: 0,
  });
  const [showRentalFilters, setShowRentalFilters] = useState(mode === "set");
  const [rentalFilters, setRentalFilters] = useState<RentalFilterOption[]>([]);

  const onMainFilterChange = <K extends keyof MainFiltersStateType>(
    key: K,
    value: MainFiltersStateType[K],
  ) => {
    setMainFilters((previous) => ({ ...previous, [key]: value }));
  };

  const onRentalFilterChange = (filterId: number, value: -1 | 0 | 1) => {
    const currentFilters = getValues("filters");
    const nextFilters = [
      ...currentFilters.filter((filter) => filter.id !== filterId),
      { id: filterId, value },
    ];

    setValue("filters", nextFilters, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  useEffect(() => {
    async function getPropertyFilters() {
      const resp = await RentalService.getPropertyFilters();
      setRentalFilters(
        resp.map((filter) => ({
          ...filter,
          value: 0,
        })),
      );
    }
    getPropertyFilters();
  }, []);

  return (
    <section className="mt-10" aria-labelledby="filters-heading">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2
            id="filters-heading"
            className="text-xl font-semibold text-[#16324f] dark:text-white"
          >
            {filtersHeader}
          </h2>
          <p className="mt-1 text-sm text-[#6b7280] dark:text-slate-400">
            Start with the essentials, then narrow down your search.
          </p>
        </div>
        <span className="text-sm text-[#6b7280] dark:text-slate-400">
          {mode === "set"
            ? rentalFilters.length
            : Object.keys(mainFilters).length + rentalFilters.length}
          <span> filters</span>
        </span>
      </div>
      <div className="relative mt-4 rounded-xl border border-[#c2c9d2] bg-[#e9edf2] p-4 dark:border-slate-800 dark:bg-slate-900">
        <div
          className={`main-filters-container flex flex-wrap justify-center gap-2 ${
            mode === "default" && !showRentalFilters
              ? "max-h-56 overflow-hidden"
              : "max-h-[1000px]"
          } transition-[max-height] duration-[500ms] ease-linear`}
        >
          {mode !== "set" && (
            <>
              <div className="main-filter-el flex w-full min-w-0 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#c2c9d2] bg-white px-3 py-2 shadow-sm dark:border-slate-700 dark:bg-slate-950 sm:w-64">
                <div className="flex w-full items-center gap-3">
                  <Input
                    className="mt-0 w-28"
                    labelClassName="mt-0 text-xs"
                    label="Maximum price"
                    min={0}
                    max={maxPrice}
                    step={100}
                    type="number"
                    value={mainFilters.price}
                    onChange={(event) => {
                      const price = Math.min(
                        maxPrice,
                        Math.max(0, Number(event.target.value)),
                      );
                      onMainFilterChange("price", price);
                    }}
                  />
                  <span className="mt-4 text-xs text-[#6b7280] dark:text-slate-300">
                    PLN
                  </span>
                </div>
              </div>

              <div className="main-filter-el w-full rounded-xl border border-[#c2c9d2] bg-white px-3 py-2 shadow-sm dark:border-slate-700 dark:bg-slate-950 sm:w-64">
                <BuildingType
                  className="w-full mt-0"
                  value={mainFilters.buildingType}
                  onChange={(event) =>
                    onMainFilterChange(
                      "buildingType",
                      event.target
                        .value as MainFiltersStateType["buildingType"],
                    )
                  }
                />
              </div>

              <div className="main-filter-el w-full rounded-xl border border-[#c2c9d2] bg-white px-3 py-2 shadow-sm dark:border-slate-700 dark:bg-slate-950 sm:w-64">
                <Input
                  className="mt-0 w-full py-1"
                  labelClassName="mt-0 text-xs"
                  label="Levels"
                  min={0}
                  max={10}
                  step={1}
                  type="number"
                  value={mainFilters.numberOfLevels}
                  onChange={(event) =>
                    onMainFilterChange(
                      "numberOfLevels",
                      Math.max(0, Number(event.target.value)),
                    )
                  }
                />
              </div>

              <div
                className={`main-filter-el w-full rounded-xl border border-[#c2c9d2] bg-white px-3 py-2 shadow-sm dark:border-slate-700 dark:bg-slate-950 sm:w-64 ${
                  mode === "default" && !showRentalFilters ? "opacity-25" : ""
                }`}
              >
                <Input
                  className="mt-0 w-full py-1"
                  labelClassName="mt-0 text-xs"
                  label="Rooms"
                  min={1}
                  max={20}
                  step={1}
                  type="number"
                  value={mainFilters.numberOfRooms}
                  onChange={(event) =>
                    onMainFilterChange(
                      "numberOfRooms",
                      Math.max(1, Number(event.target.value)),
                    )
                  }
                />
              </div>

              <div
                className={`main-filter-el w-full rounded-xl border border-[#c2c9d2] bg-white px-3 py-2 shadow-sm dark:border-slate-700 dark:bg-slate-950 sm:w-64 ${
                  mode === "default" && !showRentalFilters ? "opacity-10" : ""
                }`}
              >
                <Input
                  className="mt-0 w-full py-1"
                  labelClassName="mt-0 text-xs"
                  label="Area (m²)"
                  min={0}
                  max={1000}
                  step={1}
                  type="number"
                  value={mainFilters.squareMeters}
                  onChange={(event) =>
                    onMainFilterChange(
                      "squareMeters",
                      Math.max(0, Number(event.target.value)),
                    )
                  }
                />
              </div>
            </>
          )}
        </div>
        {mode === "default" && !showRentalFilters && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#e9edf2] via-[#e9edf2]/80 to-transparent dark:from-slate-900 dark:via-slate-900/80" />
        )}
        {mode === "default" && (
          <button
            className="mx-auto -mt-2 block rounded-full border border-[#c2c9d2] bg-white px-2 py-1 text-xs text-[#16324f] transition duration-[500ms] ease-linear hover:bg-[#f4f6f8] dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-800"
            type="button"
            aria-expanded={showRentalFilters}
            onClick={() => setShowRentalFilters((isVisible) => !isVisible)}
          >
            {showRentalFilters ? (
              <i className="fa-solid fa-angle-up"></i>
            ) : (
              <i className="fa-solid fa-angle-down"></i>
            )}
          </button>
        )}
        <div
          className={`rental-filters-container mt-2 flex w-full flex-wrap gap-2 overflow-hidden rounded-xl bg-white p-3 transition-[max-height,opacity] duration-[500ms] ease-linear dark:bg-slate-950 ${
            mode === "default" && !showRentalFilters
              ? "pointer-events-none max-h-0 p-0 opacity-0"
              : "max-h-[1000px] opacity-100"
          }`}
        >
          {rentalFilters.map((filter) => {
            const value =
              selectedRentalFilters.find((item) => item.id === filter.pk)
                ?.value ?? 0;

            const isIncluded = value === 1;
            const isExcluded = value === -1;
            const nextValue: -1 | 0 | 1 =
              value === 0 ? 1 : value === 1 ? -1 : 0;

            return (
              <button
                className={`rounded-full border px-4 py-2 text-sm transition ${
                  isIncluded
                    ? "border-green-600 bg-green-600 text-white"
                    : isExcluded
                      ? "border-red-600 bg-red-600 text-white"
                      : "border-[#c2c9d2] bg-white text-[#16324f] hover:border-[#16324f] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                }`}
                key={`rental-filter-${filter.pk}`}
                type="button"
                aria-pressed={value !== 0}
                onClick={() => onRentalFilterChange(filter.pk, nextValue)}
              >
                {filter.name}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default RentalFilters;
