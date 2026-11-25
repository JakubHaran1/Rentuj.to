import { useNavigate } from "react-router-dom";
import Button from "./Button";
import ListingFilters from "../createListings/ListingFilters";
import MainFilters from "../createListings/MainFilters";
import { FormProvider, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import type {
  ListingFilterAssignmentType,
  SearchFiltersType,
} from "../../types/propertyTypes";

import { Controller } from "react-hook-form";
import SuggestionField from "../suggestions/SuggestionField";

type searchProps = {
  queryString?: string;
};

function Search({ queryString }: searchProps) {
  const navigate = useNavigate();

  const [showFilters, setShowFilters] = useState(false);
  const searchForm = useForm<SearchFiltersType>({
    defaultValues: {
      mainFilters: {
        search: "",
        price__lte: "",
        building_type: "",
        number_of_levels: "",
        number_of_rooms: "",
        square_meters__gte: "",
      },
      filters: [],
    },
  });

  const onSearch = (data: SearchFiltersType) => {
    const params = new URLSearchParams();
    const main = data.mainFilters;
    const listingFilters = data.filters;
    Object.entries(main).forEach(([key, val]) => {
      if (val == null || val === "") return;
      params.set(key, String(val));
    });

    listingFilters.forEach(({ pk, value }) =>
      params.append("filter", `${pk}:${String(value)}`),
    );
    navigate(`/listings?${params.toString()}`);
  };

  useEffect(() => {
    const numFields = [
      "price__lte",
      "number_of_levels",
      "number_of_rooms",
      "square_meters__gte",
    ] as const;
    const queryParam = new URLSearchParams(queryString);
    searchForm.setValue("mainFilters.search", queryParam.get("search") ?? "");
    numFields.forEach((el) => {
      const raw = queryParam.get(el);
      const value = Number(raw);
      searchForm.setValue(
        `mainFilters.${el}`,
        raw !== null && raw !== "" && Number.isFinite(value) ? value : "",
      );
    });

    const listingFiltersQuery = queryParam.getAll("filter");
    const listingFiltersValues: ListingFilterAssignmentType[] = [];
    listingFiltersQuery.forEach((filter) => {
      const [pk, val] = filter.split(":");
      const filterValue = Number(val);
      const filterKey = Number(pk);

      if (val !== null || val !== "" || Number.isFinite(filterValue))
        listingFiltersValues.push({
          pk: filterKey,
          value:
            filterValue === 0
              ? filterValue
              : filterValue === 1
                ? filterValue
                : 0,
        });
    });

    searchForm.setValue("filters", listingFiltersValues);
    console.log(listingFiltersQuery);
  }, [queryString, searchForm]);
  return (
    <>
      <section aria-label="Apartment search">
        <FormProvider {...searchForm}>
          <form
            onSubmit={searchForm.handleSubmit(onSearch)}
            className="rounded-xl border border-[#c2c9d2] bg-[#e9edf2] p-4 shadow-sm sm:grid-cols-2  dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="relative mb-3 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-2">
              <Controller
                name="mainFilters.search"
                control={searchForm.control}
                rules={{ required: "Location field is required" }}
                render={({ field, fieldState }) => (
                  <SuggestionField
                    className="min-w-0"
                    label="Location"
                    type=""
                    value={field.value ?? ""}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    name={field.name ?? ""}
                    inputRef={field.ref}
                    error={fieldState.error?.message}
                    placeholder="Pass city or street where you would like to live"
                  />
                )}
              />

              <Button className="min-w-0" type="submit">
                Search rentals
              </Button>
            </div>
            <ListingFilters
              expanded={showFilters}
              onToggle={() => setShowFilters((visible) => !visible)}
              mainFiltersCount={
                Object.keys(
                  searchForm.formState.defaultValues?.mainFilters ?? {},
                ).length
              }
            >
              <MainFilters expanded={showFilters} />
            </ListingFilters>
          </form>
        </FormProvider>
      </section>
    </>
  );
}

export default Search;
