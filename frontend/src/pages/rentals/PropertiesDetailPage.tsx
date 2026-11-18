import { useEffect, useState } from "react";
import Button from "../../components/common/Button";
import type {
  ListingDefaultType,
  PropertyDefaultType,
} from "../../types/propertyTypes";
import { RentalService } from "../../services/RentalService";
import { useParams } from "react-router-dom";
import { handleDrfGetError } from "../../services/helpers";
import ErrorMessage from "../../components/common/ErrorMessage";
import ListingBoxes from "../../components/rentals/ListingBoxes";

function PropertiesDetailPage() {
  const { pk } = useParams();
  const [propertyData, setPropertyData] = useState<PropertyDefaultType | null>(
    null,
  );
  const [connectedListings, setConnectedListings] = useState<
    ListingDefaultType[]
  >([]);
  const [getError, setGetError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function getPropertyData() {
      try {
        if (isMounted && pk) {
          const resp_property = await RentalService.getPropertyDetail(pk);
          setPropertyData({
            title: resp_property.title,
            city: resp_property.city,
            street: resp_property.street,
            home_number: resp_property.home_number,
            floor_number: resp_property.floor_number,
            number_of_levels: resp_property.number_of_levels,
            number_of_rooms: resp_property.number_of_rooms,
            square_meters: resp_property.square_meters,
            building_type: resp_property.building_type,
          });
          const resp_listings =
            await RentalService.getPropertyRelatedListings(pk);
          setConnectedListings(resp_listings);
        }
      } catch (error: unknown) {
        if (isMounted) {
          handleDrfGetError(error, setGetError);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }
    void getPropertyData();
    return () => {
      isMounted = false;
    };
  }, [pk]);

  return (
    <main className="w-full px-4 py-10 sm:px-6 lg:px-8">
      <Button to="/my-properties" variant="secondary">
        Back to my properties
      </Button>

      <section className="mt-6 overflow-hidden rounded-2xl border border-[#c2c9d2] bg-[#e9edf2] shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="border-b border-[#c2c9d2] p-6 dark:border-slate-800 sm:p-8">
          <h1 className="text-3xl font-semibold text-[#16324f] dark:text-white">
            Property details
          </h1>
        </div>

        {getError ? (
          <section className=" rounded-2xl border p-6  border-[#c2c9d2] bg-[#e9edf2] p-6  m-3  md:m-6  mt-8  dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-xl font-semibold  text-[#16324f] dark:text-white">
              Could not load your property informations
            </h2>
            <ErrorMessage txt={getError} />
          </section>
        ) : isLoading ? (
          <p className="mt-8 text-sm text-[#6b7280] dark:text-slate-300">
            Loading your properties...
          </p>
        ) : propertyData === null ? (
          <section className="mt-8 rounded-2xl border border-[#c2c9d2] bg-[#e9edf2] p-6 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-xl font-semibold text-[#16324f] dark:text-white">
              No properties yet
            </h2>
            <p className="mt-2 text-sm text-[#6b7280] dark:text-slate-300">
              Properties linked to your listings will appear here.
            </p>
          </section>
        ) : (
          <div className="space-y-4 p-6 py-4 sm:p-8">
            <section aria-labelledby="property-information">
              <h2
                className="text-xl font-semibold text-[#16324f] dark:text-white"
                id="property-information"
              >
                Property information
              </h2>

              <dl className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {Object.entries(propertyData).map(([label, value]) => (
                  <div
                    className="rounded-xl border border-[#c2c9d2] bg-white p-4 dark:border-slate-700 dark:bg-slate-950"
                    key={label}
                  >
                    <dt className="text-sm text-[#6b7280] dark:text-slate-400">
                      {label.replaceAll("_", " ")}
                    </dt>
                    <dd className="mt-2 font-semibold text-[#16324f] dark:text-white">
                      {typeof value === "string"
                        ? value.replaceAll("_", " ")
                        : value}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          </div>
        )}
      </section>

      <section className="mt-6 overflow-hidden rounded-2xl border border-[#c2c9d2] bg-[#e9edf2] shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="border-b border-[#c2c9d2] p-6 dark:border-slate-800 sm:p-8">
          <h1 className="text-3xl font-semibold text-[#16324f] dark:text-white">
            Listings details
          </h1>
          <p className="mt-2 text-sm text-[#6b7280] dark:text-slate-300">
            Listings linked to your properties will appear here.
          </p>
        </div>

        {getError ? (
          <section className="mt-8 rounded-2xl m-4 border border-[#c2c9d2] bg-[#e9edf2] p-3 md:p-6 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-xl font-semibold text-[#16324f] dark:text-white">
              Could not load listings for this property
            </h2>
            <ErrorMessage txt={getError} />
          </section>
        ) : isLoading ? (
          <p className="mt-8 text-sm text-[#6b7280] dark:text-slate-300">
            Loading your properties...
          </p>
        ) : connectedListings.length === 0 ? (
          <section className="mt-8 rounded-2xl border border-[#c2c9d2] bg-[#e9edf2] p-6 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-xl font-semibold text-[#16324f] dark:text-white">
              No listings for this property
            </h2>
          </section>
        ) : (
          <div className="space-y-4 p-6   sm:p-8">
            <section aria-labelledby="property-information">
              <dl className="">
                <ListingBoxes
                  boxType="Listings details"
                  boxData={connectedListings}
                />
              </dl>
            </section>
          </div>
        )}
      </section>
    </main>
  );
}

export default PropertiesDetailPage;
