const mainFilters = [
  "Location",
  "Price",
  "Bedrooms",
  "Floor area",
  "Pets allowed",
];

const extraFilters = [
  "Property type",
  "Available from",
  "Furnished",
  "Parking",
  "Balcony or garden",
  "Elevator",
  "Internet",
  "Utilities included",
  "Lease length",
  "Security deposit",
  "No agency fee",
  "Children welcome",
  "Remote-work friendly",
  "Verified landlord",
  "Private landlord",
];
function Nav() {
  return (
    <>
      <section aria-label="Apartment search">
        <form className="grid gap-3 rounded-xl border border-[#c2c9d2] bg-[#e9edf2] p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_auto] lg:items-end dark:border-slate-800 dark:bg-slate-900">
          <label className="block text-sm font-medium">
            Location
            <input
              className="mt-2 w-full rounded-lg border border-[#c2c9d2] bg-[#dfe3e9] px-3 py-3 text-sm font-normal outline-none placeholder:text-[#6b7280] focus:border-[#2f80ed] focus:ring-2 focus:ring-[#2f80ed]/15 dark:border-slate-700 dark:bg-slate-950"
              name="location"
              placeholder="City, neighbourhood or postcode"
            />
          </label>
          <label className="block text-sm font-medium">
            Monthly budget
            <select
              className="mt-2 w-full rounded-lg border border-[#c2c9d2] bg-[#dfe3e9] px-3 py-3 text-sm font-normal outline-none focus:border-[#2f80ed] focus:ring-2 focus:ring-[#2f80ed]/15 dark:border-slate-700 dark:bg-slate-950"
              name="budget"
              defaultValue=""
            >
              <option value="">Any budget</option>
              <option value="2500">Up to PLN 2,500</option>
              <option value="3500">Up to PLN 3,500</option>
              <option value="5000">Up to PLN 5,000</option>
            </select>
          </label>
          <label className="block text-sm font-medium">
            Rental term
            <select
              className="mt-2 w-full rounded-lg border border-[#c2c9d2] bg-[#dfe3e9] px-3 py-3 text-sm font-normal outline-none focus:border-[#2f80ed] focus:ring-2 focus:ring-[#2f80ed]/15 dark:border-slate-700 dark:bg-slate-950"
              name="rentalType"
              defaultValue="long-term"
            >
              <option value="long-term">Long-term</option>
              <option value="any">Any term</option>
            </select>
          </label>
          <button
            className="rounded-lg bg-[#2f80ed] px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            type="submit"
          >
            Search rentals
          </button>
        </form>
      </section>

      <section className="mt-10" aria-labelledby="filters-heading">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2
              id="filters-heading"
              className="text-xl font-semibold text-[#16324f] dark:text-white"
            >
              Find the right fit
            </h2>
            <p className="mt-1 text-sm text-[#6b7280] dark:text-slate-400">
              Start with the essentials, then narrow down your search.
            </p>
          </div>
          <span className="text-sm text-[#6b7280] dark:text-slate-400">
            20 filters
          </span>
        </div>
        <div className="mt-4 rounded-xl border border-[#c2c9d2] bg-[#e9edf2] p-4 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-wrap gap-2">
            {mainFilters.map((filter) => (
              <button className="filter-chip" key={filter} type="button">
                {filter}
                <span aria-hidden="true" className="text-[#6b7280]">
                  ⌄
                </span>
              </button>
            ))}
          </div>
          <div className="filter-panel">
            <input
              className="filter-checkbox"
              id="all-filters"
              type="checkbox"
              aria-label="Show all filters"
            />
            <div className="filter-overflow mt-2">
              <div className="flex flex-wrap gap-2 pb-2">
                {extraFilters.map((filter) => (
                  <button className="filter-chip" key={filter} type="button">
                    {filter}
                  </button>
                ))}
              </div>
            </div>
            <label
              className="filter-toggle mt-3 inline-flex cursor-pointer items-center gap-2 text-sm font-semibold text-[#2f80ed] hover:text-blue-700"
              htmlFor="all-filters"
            >
              <span className="filter-toggle__closed">Show all filters</span>
              <span className="filter-toggle__open">Show fewer filters</span>
              <span aria-hidden="true">⌄</span>
            </label>
          </div>
        </div>
      </section>
    </>
  );
}

export default Nav;
