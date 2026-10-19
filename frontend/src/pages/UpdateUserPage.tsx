import Button from "../components/common/Button";
import Input from "../components/common/Input";

function UpdateUserPage() {
  return (
    <section className="mx-auto my-10 max-w-4xl rounded-xl border border-[#c2c9d2] bg-[#e9edf2] p-5 shadow-sm sm:my-14 sm:p-8 dark:border-slate-800 dark:bg-slate-900">
      <header className="border-b border-[#c2c9d2] pb-6 dark:border-slate-700">
        <p className="text-sm font-semibold text-[#2e8b57]">Your account</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[#16324f] sm:text-3xl dark:text-white">
          Edit profile
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6b7280] dark:text-slate-300">
          Update your personal details and the information shown on your
          account.
        </p>
      </header>

      <form className="mt-6">
        <section
          aria-labelledby="profile-photo-heading"
          className="border-b border-[#c2c9d2] pb-6 dark:border-slate-700"
        >
          <h2
            className="text-lg font-semibold text-[#16324f] dark:text-white"
            id="profile-photo-heading"
          >
            Profile photo
          </h2>
          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center">
            <div
              aria-label="Profile photo preview"
              className="flex size-20 shrink-0 items-center justify-center rounded-full bg-[#d8dee7] text-2xl font-semibold text-[#16324f] dark:bg-slate-700 dark:text-white"
              role="img"
            >
              ?
            </div>
            <div className="w-full max-w-md">
              <Input
                accept="image/*"
                label="Choose a profile photo"
                type="file"
              />
              <p className="mt-2 text-xs text-[#6b7280] dark:text-slate-400">
                JPG, PNG or GIF.
              </p>
            </div>
          </div>
        </section>

        <section
          aria-labelledby="personal-details-heading"
          className="mt-6"
        >
          <h2
            className="text-lg font-semibold text-[#16324f] dark:text-white"
            id="personal-details-heading"
          >
            Personal details
          </h2>
          <div className="mt-2 grid gap-x-6 sm:grid-cols-2">
            <Input
              autoComplete="given-name"
              label="First name"
              name="name"
              placeholder="Your first name"
            />
            <Input
              autoComplete="family-name"
              label="Last name"
              name="second_name"
              placeholder="Your last name"
            />
            <Input
              autoComplete="email"
              label="Email address"
              name="email"
              placeholder="you@example.com"
              type="email"
            />
            <Input
              autoComplete="bday"
              label="Birth date"
              name="birth_date"
              type="date"
            />
            <label className="mt-4 block text-sm font-medium text-[#1f2937] dark:text-slate-200">
              Account type
              <select
                className="mt-1.5 w-full rounded-lg border border-[#c2c9d2] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#2f80ed] focus:ring-2 focus:ring-[#2f80ed]/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                defaultValue=""
                name="user_type"
              >
                <option disabled value="">
                  Select account type
                </option>
                <option value="RENTER">Renter</option>
                <option value="OWNER">Owner</option>
              </select>
            </label>
          </div>
        </section>

        <div className="mt-8 flex flex-col-reverse gap-3 border-t border-[#c2c9d2] pt-6 sm:flex-row sm:justify-end dark:border-slate-700">
          <Button className="w-full sm:w-auto" to="/" variant="secondary">
            Cancel
          </Button>
          <Button className="w-full sm:w-auto" type="button">
            Save changes
          </Button>
        </div>
      </form>
    </section>
  );
}

export default UpdateUserPage;