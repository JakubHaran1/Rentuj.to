import type { ListingDefaultType } from "../../types/propertyTypes";
import ListingBoxes from "../../components/rentals/ListingBoxes";
import { useEffect, useState } from "react";
import { RentalService } from "../../services/RentalService";

import Button from "../../components/common/Button";
import { handleDrfGetError } from "../../services/helpers";
import ErrorMessage from "../../components/common/ErrorMessage";
import { useSearchParams } from "react-router-dom";
import Search from "../../components/common/Search";

function ListingsPage() {
  const [searchParams] = useSearchParams();
  const queryParam = searchParams.toString();

  const [properties, setProperties] = useState<ListingDefaultType[]>([]);
  const [getError, setGetError] = useState<string>("");

  useEffect(() => {
    async function getProperties() {
      console.log(queryParam, searchParams);
      try {
        const propList = await RentalService.getListingsList(queryParam);
        setProperties(propList);
      } catch (error: unknown) {
        handleDrfGetError(error, setGetError);
      }
    }
    getProperties();
  }, [queryParam, searchParams]);

  return (
    <main className="w-full px-4 py-10 sm:px-6 lg:px-8">
      <Search queryString={queryParam} />
      <section className="rounded-2xl my-10 border border-[#c2c9d2] bg-[#e9edf2] p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:py-6 sm:p-8">
        {properties.length == 0 ? (
          <div>
            <h1 className="text-3xl font-semibold text-[#16324f] dark:text-white">
              Unfortunately we can not find any rentals with your query :c
            </h1>
            <p className="mt-2 text-sm text-[#6b7280] dark:text-slate-300">
              Try search with other requirements
            </p>
            <Button className="my-3" to={"/listing-create"}>
              Go to main page
            </Button>
          </div>
        ) : getError ? (
          <div className="">
            <h1 className="text-3xl font-semibold text-[#16324f] dark:text-white">
              Something went wrong
            </h1>
            <ErrorMessage txt={getError} />
          </div>
        ) : (
          <div className="">
            <h1 className="text-3xl font-semibold text-[#16324f] dark:text-white">
              Rentals for {searchParams.get("search")}
            </h1>
            <p className="mt-2 text-sm text-[#6b7280] dark:text-slate-300">
              Choose something for you
            </p>
          </div>
        )}
      </section>
      <ListingBoxes boxType="Rental-listings" boxData={properties} />
    </main>
  );
}

export default ListingsPage;
