import Button from "./Button";

function Search() {
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
          <Button className="px-6 py-3" type="submit">
            Search rentals
          </Button>
        </form>
      </section>

      {/* <RentalFilters /> */}
    </>
  );
}

export default Search;
