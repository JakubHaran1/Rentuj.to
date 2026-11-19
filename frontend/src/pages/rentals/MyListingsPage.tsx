import type { ListingDefaultType } from "../../types/propertyTypes";
import ListingBoxes from "../../components/rentals/ListingBoxes";
import { useEffect, useState } from "react";
import { RentalService } from "../../services/RentalService";
import { useUserContext } from "../../components/context/UserContext";
import Button from "../../components/common/Button";
import { handleDrfGetError } from "../../services/helpers";
import ErrorMessage from "../../components/common/ErrorMessage";

function MyListingPage() {
  const [properties, setProperties] = useState<ListingDefaultType[]>([]);
  const [getError, setGetError] = useState<string>("");

  const { user } = useUserContext();

  const deleteListing = async (listing: ListingDefaultType) => {
    try {
      await RentalService.deleteListing(listing.pk);
      setProperties((current) =>
        current.filter((property) => property.pk !== listing.pk),
      );
    } catch (error: unknown) {
      handleDrfGetError(error, setGetError);
    }
  };

  useEffect(() => {
    async function getProperties() {
      try {
        const propList = await RentalService.getListingsList(user?.pk);
        setProperties(propList);
      } catch (error: unknown) {
        handleDrfGetError(error, setGetError);
      }
    }
    getProperties();
  }, [user?.pk]);

  return (
    <main className="w-full px-4 py-10 sm:px-6 lg:px-8">
      <section className="rounded-2xl border border-[#c2c9d2] bg-[#e9edf2] p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:py-6 sm:p-8">
        {properties.length == 0 ? (
          <div>
            <h1 className="text-3xl font-semibold text-[#16324f] dark:text-white">
              Create a listing
            </h1>
            <p className="mt-2 text-sm text-[#6b7280] dark:text-slate-300">
              Your listings will be here.
            </p>
            <Button className="my-3" to={"/listing-create"}>
              Create a listing
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
              Manage your rentals
            </h1>
            <p className="mt-2 text-sm text-[#6b7280] dark:text-slate-300">
              This is a place where you can add, edit or delete your rentals
            </p>
          </div>
        )}
      </section>
      <ListingBoxes
        boxType="Your listings"
        boxData={properties}
        editable
        onDelete={deleteListing}
      />
    </main>
  );
}

export default MyListingPage;
