import Button from "../common/Button";

type SignUpFormProps = {
  isOpen: boolean;
  onToggle: () => void;
};

function SignUpForm({ isOpen, onToggle }: SignUpFormProps) {
  return (
    <details className="account-menu relative" open={isOpen}>
      <summary
        className="inline-flex cursor-pointer list-none items-center justify-center rounded-lg border border-[#2f80ed] bg-[#2f80ed] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-transparent hover:text-[#2f80ed] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2f80ed] dark:border-[#2f80ed] dark:bg-[#2f80ed] dark:text-white dark:hover:bg-transparent dark:hover:text-[#60a5fa]"
        onClick={(event) => {
          event.preventDefault();
          onToggle();
        }}
      >
        Sign up
      </summary>
      <form className="account-menu__panel absolute right-0 z-20 mt-2 w-[min(20rem,90vw)] rounded-xl border border-[#c2c9d2] bg-[#e9edf2] p-5 shadow-xl dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-lg font-semibold text-[#16324f] dark:text-white">
          Create an account
        </h2>
        <p className="mt-1 text-sm text-[#6b7280] dark:text-slate-400">
          Join Rentuj.to to find your next home.
        </p>

        <label className="mt-5 block text-sm font-medium text-[#1f2937] dark:text-slate-200">
          Name
          <input
            autoComplete="name"
            className="mt-1.5 w-full rounded-lg border border-[#c2c9d2] bg-white px-3 py-2.5 text-sm outline-none transition placeholder:text-[#9ca3af] focus:border-[#2f80ed] focus:ring-2 focus:ring-[#2f80ed]/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            name="name"
            placeholder="Your name"
            type="text"
          />
        </label>

        <label className="mt-4 block text-sm font-medium text-[#1f2937] dark:text-slate-200">
          Email
          <input
            autoComplete="email"
            className="mt-1.5 w-full rounded-lg border border-[#c2c9d2] bg-white px-3 py-2.5 text-sm outline-none transition placeholder:text-[#9ca3af] focus:border-[#2f80ed] focus:ring-2 focus:ring-[#2f80ed]/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            name="email"
            placeholder="you@example.com"
            type="email"
          />
        </label>

        <label className="mt-4 block text-sm font-medium text-[#1f2937] dark:text-slate-200">
          Password
          <input
            autoComplete="new-password"
            className="mt-1.5 w-full rounded-lg border border-[#c2c9d2] bg-white px-3 py-2.5 text-sm outline-none transition placeholder:text-[#9ca3af] focus:border-[#2f80ed] focus:ring-2 focus:ring-[#2f80ed]/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            name="password"
            placeholder="Create a password"
            type="password"
          />
        </label>

        <Button
          className="mt-5 w-full py-3"
          type="submit"
        >
          Create account
        </Button>
      </form>
    </details>
  );
}

export default SignUpForm;
