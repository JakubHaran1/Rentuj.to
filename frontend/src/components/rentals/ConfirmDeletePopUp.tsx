import type { Dispatch, SetStateAction } from "react";
import type { ListingDefaultType } from "../../types/propertyTypes";
import Button from "../common/Button";

type ConfirmDeletePopUpProps = {
  setListingToDelete: Dispatch<SetStateAction<ListingDefaultType | null>>;
  listingToDelete: ListingDefaultType | null;
  onDelete?: (listing: ListingDefaultType) => void;
};

function ConfirmDeletePopUp({
  setListingToDelete,
  listingToDelete,
  onDelete,
}: ConfirmDeletePopUpProps) {
  return (
    <>
      {listingToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setListingToDelete(null);
            }
          }}
        >
          <div
            className="w-full max-w-md rounded-xl border border-[#c2c9d2] bg-[#e9edf2] p-6 shadow-xl dark:border-slate-700 dark:bg-slate-900"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-listing-title"
            aria-describedby="delete-listing-description"
          >
            <h2
              id="delete-listing-title"
              className="text-xl font-semibold text-[#16324f] dark:text-white"
            >
              Delete listing?
            </h2>
            <p
              id="delete-listing-description"
              className="mt-2 text-sm leading-6 text-[#6b7280] dark:text-slate-300"
            >
              Are you sure you want to delete “{listingToDelete.title}”? This
              action cannot be undone.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setListingToDelete(null)}
              >
                Cancel
              </Button>
              <button
                type="button"
                className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-red-500 bg-red-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500"
                onClick={() => {
                  const listing = listingToDelete;
                  setListingToDelete(null);
                  onDelete?.(listing);
                }}
              >
                Delete listing
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ConfirmDeletePopUp;
