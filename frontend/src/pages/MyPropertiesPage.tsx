import { useEffect, useState } from "react";
import Button from "../components/common/Button";
import ErrorMessage from "../components/common/ErrorMessage";
import { useUserContext } from "../components/context/UserContext";
import { RentalService } from "../services/RentalService";
import { handleDrfGetError } from "../services/helpers";
import type { PropertyType } from "../types/propertyTypes";

function MyPropertiesPage() {
  const [properties, setProperties] = useState<PropertyType[]>([]);
  const [getError, setGetError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useUserContext();

  useEffect(() => {
    let isMounted = true;

    async function getProperties() {
      if (!user?.pk) {
        setIsLoading(false);
        return;
      }

      try {
        const listings = await RentalService.getListingsList(user.pk);
        if (isMounted) {
          const uniqueProperties = new Map(
            listings.map((listing) => [listing.property.pk, listing.property]),
          );
          setProperties([...uniqueProperties.values()]);
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

    void getProperties();
    return () => {
      isMounted = false;
    };
  }, [user?.pk]);

  return (
    <main className="w-full px-4 py-10 sm:px-6 lg:px-8">
      <section className="rounded-2xl border border-[#c2c9d2] bg-[#e9edf2] p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:py-6 sm:p-8">
        <h1 className="text-3xl font-semibold text-[#16324f] dark:text-white">
          My properties
        </h1>
        <p className="mt-2 text-sm text-[#6b7280] dark:text-slate-300">
          Properties associated with your rental listings.
        </p>
        <Button className="mt-5" to="/property-create">
          Add property
        </Button>
      </section>

      {getError ? (
        <section className="mt-8 rounded-2xl border border-[#c2c9d2] bg-[#e9edf2] p-6 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-xl font-semibold text-[#16324f] dark:text-white">
            Could not load your properties
          </h2>
          <ErrorMessage txt={getError} />
        </section>
      ) : isLoading ? (
        <p className="mt-8 text-sm text-[#6b7280] dark:text-slate-300">
          Loading your properties...
        </p>
      ) : properties.length === 0 ? (
        <section className="mt-8 rounded-2xl border border-[#c2c9d2] bg-[#e9edf2] p-6 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-xl font-semibold text-[#16324f] dark:text-white">
            No properties yet
          </h2>
          <p className="mt-2 text-sm text-[#6b7280] dark:text-slate-300">
            Properties linked to your listings will appear here.
          </p>
        </section>
      ) : (
        <section className="mt-8 space-y-4" aria-label="Your properties">
          {properties.map((property) => (
            <article
              className="rounded-xl border border-[#c2c9d2] bg-[#e9edf2] p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6"
              key={property.pk}
            >
              <h2 className="text-xl font-semibold text-[#16324f] dark:text-white">
                {property.title}
              </h2>
              <p className="mt-1 text-sm text-[#6b7280] dark:text-slate-300">
                {property.street} {property.home_number}, {property.city}
              </p>
              <dl className="mt-5 flex flex-wrap gap-2 text-sm text-[#536454] dark:text-slate-300">
                <div className="rounded-full bg-white/70 px-3 py-1 dark:bg-slate-800">
                  <dt className="sr-only">Area</dt>
                  <dd>{property.square_meters} m²</dd>
                </div>
                <div className="rounded-full bg-white/70 px-3 py-1 dark:bg-slate-800">
                  <dt className="sr-only">Rooms</dt>
                  <dd>{property.number_of_rooms} rooms</dd>
                </div>
                <div className="rounded-full bg-white/70 px-3 py-1 dark:bg-slate-800">
                  <dt className="sr-only">Building type</dt>
                  <dd>{property.building_type.replaceAll("_", " ")}</dd>
                </div>
              </dl>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}

export default MyPropertiesPage;
