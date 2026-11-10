import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { RentalService } from "../services/RentalService";
import { AxiosError } from "axios";
import { handleDrfGetError } from "../services/helpers";
import ErrorMessage from "../components/common/ErrorMessage";
import Map from "../components/common/Map";

import type { PropertyListingType } from "../types/propertyTypes";
import Button from "../components/common/Button";
const defaultValue: PropertyListingType = {
  pk: 0,
  title: "",
  city: "",
  street: "",
  home_number: 0,
  floor_number: 0,
  property_details: null,
};
function RentalsDetailPage() {
  const { pk } = useParams();
  const [rentalError, setRentalError] = useState("");

  const [rentalOffert, setRentalOffert] =
    useState<PropertyListingType>(defaultValue);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  useEffect(() => {
    async function handleGetRentalDetail() {
      try {
        if (!pk) throw new AxiosError("No rental identifier");
        const resp = await RentalService.getRentalDetail(pk);

        setRentalOffert(resp);
        setIsSaved(RentalService.getFavouriteIds().includes(Number(pk)));
      } catch (error: unknown) {
        handleDrfGetError(error, setRentalError);
      }
    }
    handleGetRentalDetail();
  }, [pk]);

  const details = rentalOffert?.property_details;
  const mainImage =
    details &&
    Array.isArray(details.apartment_photos) &&
    details.apartment_photos[0]?.img;

  const handleSaveBtn = (
    event: React.MouseEvent<HTMLButtonElement>,
    rentalOffert: PropertyListingType,
  ) => {
    event.preventDefault();
    RentalService.saveFavourite(rentalOffert);
    console.log(RentalService.getFavouriteIds().includes(rentalOffert.pk));
    setIsSaved(RentalService.getFavouriteIds().includes(rentalOffert.pk));
  };
  return (
    <section className="mt-10">
      {rentalError ? (
        <div
          className=" overflow-hidden
        rounded-2xl border border-[#c2c9d2] bg-white
        dark:bg-slate-900 dark:border-slate-800"
        >
          <h2
            className=" text-2xl md:text-3xl font-semibold
            tracking-tight text-[#16324f] my-4 ms-2 dark:text-white"
          >
            {rentalError}
          </h2>
          <ErrorMessage />
        </div>
      ) : !rentalOffert ? (
        <p className="text-sm text-[#6b7280] dark:text-slate-400">Loading...</p>
      ) : (
        <div
          className="relative flex flex-col md:flex-row overflow-hidden
        rounded-2xl border border-[#c2c9d2] bg-white
        dark:bg-slate-900 dark:border-slate-800"
        >
          {/* Property image */}
          <div className="w-full md:w-[42%] shrink-0">
            {mainImage ? (
              <img
                src={mainImage}
                alt={rentalOffert.title}
                className="h-64 md:h-full min-h-[320px] w-full
              object-cover"
              />
            ) : (
              <div
                className="flex h-64 md:h-full min-h-[320px] w-full
              items-center justify-center bg-slate-200 text-sm
              text-[#6b7280] dark:bg-slate-800 dark:text-slate-400"
              >
                No image available
              </div>
            )}
          </div>
          {/* Property information */}
          <div className="flex flex-1 flex-col justify-center p-3 md:p-6">
            <button
              className="cursor-pointer p-0 self-end"
              onClick={(event) => handleSaveBtn(event, rentalOffert)}
            >
              {isSaved ? (
                <i className="fa-solid fa-heart  text-[#16324f]  dark:text-white"></i>
              ) : (
                <i className="fa-regular fa-heart  text-[#16324f]  dark:text-white"></i>
              )}
            </button>
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-gray-500">
                {rentalOffert.street} {rentalOffert.home_number},{" "}
                {rentalOffert.city}
              </span>
            </div>

            <h2
              className="mt-4 text-2xl md:text-3xl font-semibold
            tracking-tight text-[#16324f] dark:text-white"
            >
              {rentalOffert.title}
            </h2>

            <p
              className="mt-3 text-sm leading-7 text-[#6b7280]
            dark:text-slate-300"
            >
              {details?.description ?? "Property details are unavailable."}
            </p>

            {/* Filters */}
            <div className="mt-6">
              <h3
                className="mb-3 text-sm font-semibold
              text-[#16324f] dark:text-white"
              >
                Property features
              </h3>

              <div className="flex flex-wrap gap-2">
                {details?.filters.map((filter) => (
                  <span
                    key={filter.id}
                    className="rounded-full border border-[#c2c9d2]
                    bg-[#e9edf2] px-3 py-2 text-xs font-medium
                    text-[#16324f] dark:bg-slate-800
                    dark:text-slate-200 dark:border-slate-700"
                  >
                    {filter.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Price */}
            <div
              className="mt-7 flex items-center justify-between
            border-t border-gray-200 pt-5 dark:border-slate-700"
            >
              <div>
                <p className="text-xs text-gray-500">Monthly rent</p>
                <p className="text-2xl font-semibold text-[#2e8b57]">
                  {details ? `${details.price} PLN` : "—"}
                </p>
              </div>
              <Button type="button" variant="primary">
                Send a message to owner
              </Button>
            </div>
          </div>
        </div>
      )}
      <div
        className="mt-5 overflow-hidden
        rounded-2xl border border-[#c2c9d2] bg-white
        dark:bg-slate-900 dark:border-slate-800"
      >
        <Map />
      </div>
    </section>
  );
}

export default RentalsDetailPage;
