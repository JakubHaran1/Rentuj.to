import { useState } from "react";
import type { ListingDefaultType } from "../../types/propertyTypes";
import Button from "../common/Button";
import ConfirmDeletePopUp from "./ConfirmDeletePopUp";
import { useNavigate } from "react-router-dom";
type ListingBoxesProps = {
  boxType?: string;
  boxData: ListingDefaultType[];
  editable?: boolean;
  onDelete?: (listing: ListingDefaultType) => void;
};

function ListingBoxes({
  boxType,
  boxData,
  editable = false,
  onDelete,
}: ListingBoxesProps) {
  const [listingToDelete, setListingToDelete] =
    useState<ListingDefaultType | null>(null);
  const navigate = useNavigate();
  return (
    <>
      <section aria-labelledby={boxType}>
        <div>
          {boxData.map((listing) => {
            const details = listing;
            const mainImage = details.apartment_photos[0]?.img;

            return (
              <article
                onClick={() => navigate(`/rental-detail/${listing.pk}`)}
                className="flex flex-col mt-3 cursor-pointer overflow-hidden rounded-xl border border-[#c2c9d2] bg-[#e9edf2] shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:flex-row  transition-colors hover:bg-[#dfe3e9] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2f80ed] dark:hover:bg-slate-800"
                key={listing.pk}
              >
                <div className="h-52 shrink-0 bg-slate-200 dark:bg-slate-800 sm:w-72">
                  {mainImage ? (
                    <img
                      src={mainImage}
                      alt={listing.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-[#6b7280] dark:text-slate-400">
                      No image available
                    </div>
                  )}
                </div>

                <div className="flex min-w-0 flex-1 flex-col justify-between p-5 sm:p-6">
                  <div>
                    <div className=" flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-semibold text-[#16324f] dark:text-white">
                          {listing.title}
                        </h3>
                        <p className="mt-1 text-sm text-[#6b7280] dark:text-slate-400">
                          {listing.property.street}{" "}
                          {listing.property.home_number},{" "}
                          {listing.property.city}
                        </p>
                      </div>

                      {editable && (
                        <div className="flex shrink-0 items-center gap-2">
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/rental-edit/${listing.pk}`);
                            }}
                            aria-label={`Edit ${listing.title}`}
                            className="!p-2"
                            variant="secondary"
                          >
                            <i className="fa-solid fa-pen-to-square" />
                          </Button>
                          <button
                            type="button"
                            aria-label={`Delete ${listing.title}`}
                            className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-red-500 px-3 py-2.5 text-sm text-red-600 transition-colors hover:bg-red-500 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500"
                            onClick={(e) => {
                              e.stopPropagation();
                              setListingToDelete(listing);
                            }}
                          >
                            <i className="fa-solid fa-trash" />
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="mt-5 flex flex-wrap gap-2 text-sm text-[#536454] dark:text-slate-300">
                      <span className="rounded-full bg-white/70 px-3 py-1 dark:bg-slate-800">
                        {listing.property.square_meters} m²
                      </span>
                      {details.filters.map((filter) => (
                        <span
                          className="rounded-full bg-white/70 px-3 py-1 dark:bg-slate-800"
                          key={filter.pk}
                        >
                          {filter.name}
                        </span>
                      ))}
                    </div>
                    <p className="mt-5 text-lg font-semibold text-[#1f2937] dark:text-slate-100">
                      {details.price}{" "}
                      <span className="text-sm font-normal">/ month</span>
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {editable && (
        <ConfirmDeletePopUp
          listingToDelete={listingToDelete}
          setListingToDelete={setListingToDelete}
          onDelete={onDelete}
        />
      )}
    </>
  );
}

export default ListingBoxes;
