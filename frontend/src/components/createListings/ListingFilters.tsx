import { useEffect, useState, type ReactNode } from "react";
import { useFormContext } from "react-hook-form";
import type {
  ListingCreateType,
  ListingFilterNameType,
} from "../../types/propertyTypes";
import { RentalService } from "../../services/RentalService";
import { handleDrfGetError } from "../../services/helpers";
import ErrorMessage from "../common/ErrorMessage";

type ListingFiltersProps = {
  children?: ReactNode;
  expanded?: boolean;
  onToggle?: () => void;
  mainFiltersCount?: number;
};

function ListingFilters({
  children,
  expanded = true,
  onToggle,
  mainFiltersCount = 0,
}: ListingFiltersProps) {
  const { getValues, setValue, watch } =
    useFormContext<Pick<ListingCreateType, "filters">>();
  const selectedFilters = watch("filters");
  const [filters, setFilters] = useState<ListingFilterNameType[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function getFilters() {
      try {
        setFilters(await RentalService.getListingFilters());
      } catch (error: unknown) {
        handleDrfGetError(error, setError);
      }
    }
    getFilters();
  }, []);

  const onFilterChange = (filterId: number, value: -1 | 0 | 1) => {
    const nextFilters = [
      ...getValues("filters").filter((filter) => filter.pk !== filterId),
      { pk: filterId, value },
    ];
    setValue("filters", nextFilters, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  return (
    <section aria-label="Rental filters">
      <div
        className={`relative rounded-xl bg-[#e9edf2] px-4  dark:bg-slate-900 ${
          onToggle ? "" : "border border-[#c2c9d2] dark:border-slate-800"
        }`}
      >
        <span className="text-sm text-[#6b7280] dark:text-slate-400 block mb-2">
          {mainFiltersCount + filters.length} filters
        </span>
        {children}
        {onToggle && (
          <button
            className="mx-auto my-2 block rounded-full border border-[#c2c9d2] bg-white px-2 py-1 text-xs text-[#16324f] transition duration-[500ms] ease-linear hover:bg-[#f4f6f8] dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-800"
            type="button"
            aria-label={
              expanded ? "Hide additional filters" : "Show additional filters"
            }
            aria-expanded={expanded}
            onClick={onToggle}
          >
            <i
              className={`fa-solid ${expanded ? "fa-angle-up" : "fa-angle-down"}`}
            />
          </button>
        )}
        {error && <ErrorMessage txt={error} />}
        <div
          className={`rental-filters-container w-full flex-wrap gap-2 overflow-hidden rounded-xl bg-white p-3 transition-[display,max-height,opacity] transition-discrete delay-100 duration-[500ms] ease-linear dark:bg-slate-950 ${
            !expanded
              ? "pointer-events-none hidden max-h-0 p-0 opacity-0"
              : "flex max-h-[1000px] opacity-100 starting:max-h-0 starting:opacity-0"
          }`}
        >
          {filters.map((filter) => {
            const value =
              selectedFilters.find((item) => item.pk === filter.pk)?.value ?? 0;
            const nextValue: -1 | 0 | 1 =
              value === 0 ? 1 : value === 1 ? -1 : 0;

            return (
              <button
                className={`rounded-full border px-4 py-2 text-sm transition ${
                  value === 1
                    ? "border-green-600 bg-green-600 text-white"
                    : value === -1
                      ? "border-red-600 bg-red-600 text-white"
                      : "border-[#c2c9d2] bg-white text-[#16324f] hover:border-[#16324f] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                }`}
                key={filter.pk}
                type="button"
                aria-pressed={value !== 0}
                onClick={() => onFilterChange(filter.pk, nextValue)}
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

export default ListingFilters;
