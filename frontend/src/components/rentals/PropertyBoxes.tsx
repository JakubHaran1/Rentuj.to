import type { PropertyType } from "../../types/propertyTypes";
import { Link } from "react-router-dom";

type PropertyBoxesProps = {
  properties: PropertyType[];
};

function PropertyBoxes({ properties }: PropertyBoxesProps) {
  return (
    <>
      {properties.map((property) => (
        <article
          className="rounded-xl border border-[#c2c9d2] bg-[#e9edf2] shadow-sm dark:border-slate-800 dark:bg-slate-900"
          key={property.pk}
        >
          <Link
            className="block rounzded-xl p-5 transition-colors hover:bg-[#dfe3e9] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2f80ed] dark:hover:bg-slate-800 sm:p-6"
            to={`/property-detail/${property.pk}`}
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
          </Link>
        </article>
      ))}
    </>
  );
}

export default PropertyBoxes;
