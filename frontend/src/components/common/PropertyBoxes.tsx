import type { PropertyListingType } from "../../types";

type PropertyBoxesProps = {
  boxType: string;
  boxData: PropertyListingType[];
};
function PropertyBoxes({ boxType, boxData }: PropertyBoxesProps) {
  return (
    <div className="mt-14" aria-labelledby={boxType}>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {boxData.map((listing) => (
          <article
            className="overflow-hidden rounded-xl border border-[#c2c9d2] bg-[#e9edf2] dark:border-slate-800 dark:bg-slate-900"
            key={listing.title}
          >
            <div className={`listing-cover`}>
              <span className="rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-[#16324f]">
                {listing.street}/{listing.city}
              </span>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-[#16324f] dark:text-white">
                {listing.title}
              </h3>
              <p className="mt-1.5 text-sm text-[#6b7280] dark:text-slate-400">
                to add floor
              </p>
              <p>filters?</p>
              <p className="mt-4 text-sm font-semibold text-[#1f2937] dark:text-slate-100">
                {listing.property_details.price}
                <span className="font-normal text-[#6b7280] dark:text-slate-400">
                  / month
                </span>
              </p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export default PropertyBoxes;
