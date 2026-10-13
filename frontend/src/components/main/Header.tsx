import type React from "react";
import { useState } from "react";
import Button from "../common/Button";
import SignInForm from "./SignInForm";
import SignUpForm from "./SignUpForm";
import AccountMenu from "./AccountMenu";

type HeaderProps = {
  isDarkMode: boolean;
  setIsDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
};
function Header({ isDarkMode, setIsDarkMode }: HeaderProps) {
  const [openMenu, setOpenMenu] = useState<
    "signin" | "signup" | "account" | null
  >(null);

  return (
    <header className="border-b border-[#c2c9d2] bg-[#e9edf2] dark:border-slate-800 dark:bg-slate-900">
      <div className="mx-auto flex w-[min(90%,1440px)] flex-wrap items-center justify-between gap-x-8 gap-y-3 py-4">
        <a
          className="shrink-0 text-xl font-bold tracking-tight text-[#16324f] dark:text-white"
          href="#home"
          aria-label="Rentuj.to.pl home"
        >
          rentuj.to<span className="text-[#2f80ed]">.pl</span>
        </a>

        <nav
          className="order-3 flex w-full items-center gap-6 overflow-x-auto pb-1 text-sm font-medium text-[#6b7280] md:order-none md:w-auto md:pb-0"
          aria-label="Main navigation"
        >
          <a
            className="whitespace-nowrap text-[#16324f] dark:text-white"
            href="#home"
          >
            Home
          </a>
          <a
            className="whitespace-nowrap hover:text-[#2f80ed]"
            href="#my-listings"
          >
            My listings
          </a>
          <a className="whitespace-nowrap hover:text-[#2f80ed]" href="#saved">
            Saved
          </a>
          <a
            className="whitespace-nowrap hover:text-[#2f80ed]"
            href="#messages"
          >
            Messages
          </a>
          <a className="whitespace-nowrap hover:text-[#2f80ed]" href="#reviews">
            Reviews
          </a>
          <a
            className="whitespace-nowrap hover:text-[#2f80ed]"
            href="#disputes"
          >
            Disputes
          </a>
          <a
            className="whitespace-nowrap hover:text-[#2f80ed]"
            href="#agreements"
          >
            Agreements
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <button
            aria-label={`Switch to ${isDarkMode ? "light" : "dark"} mode`}
            aria-pressed={isDarkMode}
            className="rounded-lg border border-[#c2c9d2] px-3 py-2 text-sm font-medium text-[#16324f] transition hover:bg-[#dfe3e9] dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800"
            onClick={() => setIsDarkMode((current) => !current)}
            type="button"
          >
            {isDarkMode ? "Light mode" : "Dark mode"}
          </button>
          <Button href="#create-listing" variant="primary">
            Add a listing
          </Button>
          <SignInForm
            isOpen={openMenu === "signin"}
            onToggle={() =>
              setOpenMenu((current) => (current === "signin" ? null : "signin"))
            }
          />
          <SignUpForm
            isOpen={openMenu === "signup"}
            onToggle={() =>
              setOpenMenu((current) => (current === "signup" ? null : "signup"))
            }
          />
          <AccountMenu openMenu={openMenu} setOpenMenu={setOpenMenu} />
        </div>
      </div>
    </header>
  );
}

export default Header;
