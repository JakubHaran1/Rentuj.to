import type React from "react";
import { useState } from "react";
import Button from "../common/Button";
import SignInForm from "./SignInForm";
import SignUpForm from "./SignUpForm";
import AccountMenu from "./AccountMenu";
import { useUserContext } from "../context/UserContext";
import { Link } from "react-router-dom";

type HeaderProps = {
  isDarkMode: boolean;
  setIsDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
};
function Header({ isDarkMode, setIsDarkMode }: HeaderProps) {
  const { user } = useUserContext();
  const [openMenu, setOpenMenu] = useState<
    "signin" | "signup" | "account" | null
  >(null);
  const [loginPrompt, setLoginPrompt] = useState<"listing" | "property" | null>(
    null,
  );

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
          <Link
            className="whitespace-nowrap text-[#16324f] dark:text-white"
            to="/"
          >
            Home
          </Link>
          <Link
            className="whitespace-nowrap hover:text-[#2f80ed] dark:text-white"
            to="/my-listings"
          >
            My listings
          </Link>

          <Link
            className="whitespace-nowrap text-[#16324f] dark:text-white"
            to="#saved"
          >
            Saved
          </Link>

          <Link
            className="whitespace-nowrap text-[#16324f] dark:text-white"
            to="#messages"
          >
            Messages
          </Link>

          <Link
            className="whitespace-nowrap text-[#16324f] dark:text-white"
            to="#reviews"
          >
            Reviews
          </Link>

          <Link
            className="whitespace-nowrap text-[#16324f] dark:text-white"
            to="#disputes"
          >
            Disputes
          </Link>
          <Link
            className="whitespace-nowrap text-[#16324f] dark:text-white"
            to="#agreements"
          >
            Agreements
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <button
            aria-label={`Switch to ${isDarkMode ? "light" : "dark"} mode`}
            aria-pressed={isDarkMode}
            className="rounded-lg border border-[#c2c9d2] p-2.5 text-[#16324f] transition hover:bg-[#dfe3e9] dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800"
            onClick={() => setIsDarkMode((current) => !current)}
            type="button"
          >
            {isDarkMode ? (
              <svg
                aria-hidden="true"
                className="size-5"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.8"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" />
              </svg>
            ) : (
              <svg
                aria-hidden="true"
                className="size-5"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.8"
                viewBox="0 0 24 24"
              >
                <path d="M20.2 15.3A8.5 8.5 0 0 1 8.7 3.8 8.5 8.5 0 1 0 20.2 15.3Z" />
              </svg>
            )}
          </button>
          {user ? (
            <Button to="/listing-create" variant="primary">
              Add a listing
            </Button>
          ) : (
            <Button
              onClick={() => {
                const shouldOpenSignIn = openMenu !== "signin";
                setLoginPrompt(shouldOpenSignIn ? "listing" : null);
                setOpenMenu(shouldOpenSignIn ? "signin" : null);
              }}
              type="button"
              variant="primary"
            >
              Add a listing
            </Button>
          )}
          {user ? (
            <Button to="/property-create" variant="secondary">
              Add property
            </Button>
          ) : (
            <Button
              onClick={() => {
                const shouldOpenSignIn = openMenu !== "signin";
                setLoginPrompt(shouldOpenSignIn ? "property" : null);
                setOpenMenu(shouldOpenSignIn ? "signin" : null);
              }}
              type="button"
              variant="secondary"
            >
              Add property
            </Button>
          )}
          {user ? (
            <AccountMenu openMenu={openMenu} setOpenMenu={setOpenMenu} />
          ) : (
            <>
              <SignInForm
                isOpen={openMenu === "signin"}
                onToggle={() => {
                  setLoginPrompt(null);
                  setOpenMenu((current) =>
                    current === "signin" ? null : "signin",
                  );
                }}
                onSuccess={() => {
                  setOpenMenu(null);
                  setLoginPrompt(null);
                }}
                loginPrompt={loginPrompt}
              />
              <SignUpForm
                isOpen={openMenu === "signup"}
                onToggle={() => {
                  setLoginPrompt(null);
                  setOpenMenu((current) =>
                    current === "signup" ? null : "signup",
                  );
                }}
              />
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
