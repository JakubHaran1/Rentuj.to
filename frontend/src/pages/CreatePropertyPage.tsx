import Button from "../components/common/Button";
import Input from "../components/common/Input";
import BuildingType from "../components/createListings/BuildingType";

function CreatePropertyPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="rounded-2xl border border-[#c2c9d2] bg-[#e9edf2] p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-[#16324f] dark:text-white">
            Add property
          </h1>
          <p className="mt-2 text-sm text-[#6b7280] dark:text-slate-300">
            Enter the details of the property.
          </p>
        </div>

        <form className="space-y-8" onSubmit={(event) => event.preventDefault()}>
          <fieldset>
            <legend className="text-xl font-semibold text-[#16324f] dark:text-white">
              Property details
            </legend>
            <div className="grid gap-x-5 md:grid-cols-2">
              <Input
                label="Title"
                maxLength={150}
                labelClassName="mt-5 md:col-span-2"
              />
              <Input label="City" maxLength={80} />
              <Input label="Street" maxLength={80} />
              <Input label="Home number" type="number" min={1} />
              <Input label="Floor number" type="number" min={1} />
              <Input label="Number of levels" type="number" min={1} />
              <Input label="Number of rooms" type="number" min={1} />
              <Input
                label="Square meters"
                type="number"
                min={1}
                step="0.01"
              />
              <div className="mt-4">
                <BuildingType />
              </div>
              <Input
                label="Latitude (optional)"
                type="number"
                step="any"
              />
              <Input
                label="Longitude (optional)"
                type="number"
                step="any"
              />
            </div>
          </fieldset>

          <div className="flex flex-wrap justify-end gap-3">
            <Button to="/my-listings" variant="secondary">
              Cancel
            </Button>
            <Button type="button" variant="primary">
              Add property
            </Button>
          </div>
        </form>
      </section>
    </main>
  );
}

export default CreatePropertyPage;
