import "./App.css";
import { useEffect, useState } from "react";
import Homepage from "./pages/Homepage";
import { Navigate, Route, Routes } from "react-router-dom";

const recentlyViewed = [
  {
    location: "Warsaw · Mokotów",
    title: "Bright apartment near the metro",
    details: "2 rooms · 48 m² · available now",
    price: "PLN 3,400",
    imageClass: "listing-cover--one",
  },
  {
    location: "Kraków · Podgórze",
    title: "Quiet apartment with a balcony",
    details: "2 rooms · 52 m² · available November 1",
    price: "PLN 3,100",
    imageClass: "listing-cover--two",
  },
  {
    location: "Wrocław · Śródmieście",
    title: "Well-located studio",
    details: "1 room · 31 m² · available now",
    price: "PLN 2,500",
    imageClass: "listing-cover--three",
  },
];

function App() {
  const [isDarkMode, setIsDarkMode] = useState(
    () => window.localStorage.getItem("theme") === "dark",
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
    document.documentElement.style.colorScheme = isDarkMode ? "dark" : "light";
    window.localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  return (
    <div className="min-h-screen bg-[#dfe3e9] text-[#1f2937] dark:bg-slate-950 dark:text-slate-100">
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
            <a className="whitespace-nowrap text-[#16324f] dark:text-white" href="#home">
              Home
            </a>
            <a className="whitespace-nowrap hover:text-[#2f80ed]" href="#my-listings">
              My listings
            </a>
            <a className="whitespace-nowrap hover:text-[#2f80ed]" href="#saved">
              Saved
            </a>
            <a className="whitespace-nowrap hover:text-[#2f80ed]" href="#messages">
              Messages
            </a>
            <a className="whitespace-nowrap hover:text-[#2f80ed]" href="#reviews">
              Reviews
            </a>
            <a className="whitespace-nowrap hover:text-[#2f80ed]" href="#disputes">
              Disputes
            </a>
            <a className="whitespace-nowrap hover:text-[#2f80ed]" href="#agreements">
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
            <a
              className="rounded-lg bg-[#16324f] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#244766] dark:bg-[#2f80ed] dark:hover:bg-blue-500"
              href="#create-listing"
            >
              Add a listing
            </a>
            <details className="account-menu relative">
              <summary className="flex cursor-pointer list-none items-center gap-2 rounded-lg p-1.5 hover:bg-[#dfe3e9] dark:hover:bg-slate-800">
                <span className="flex size-9 items-center justify-center rounded-full bg-[#d8dee7] text-sm font-semibold text-[#16324f] dark:bg-slate-700 dark:text-white">
                  JK
                </span>
                <span className="hidden max-w-28 text-left sm:block">
                  <span className="block text-sm font-semibold text-[#1f2937] dark:text-white">
                    Jan Kowalski
                  </span>
                  <span className="block text-xs text-[#6b7280]">Renter & landlord hub</span>
                </span>
                <span aria-hidden="true" className="text-xs text-[#6b7280]">
                  ▾
                </span>
              </summary>
              <div className="account-menu__panel absolute right-0 z-20 mt-2 w-72 overflow-hidden rounded-xl border border-[#c2c9d2] bg-[#e9edf2] p-2 shadow-lg dark:border-slate-700 dark:bg-slate-900">
                <div className="mb-2 rounded-lg bg-[#dfe4eb] p-3 dark:bg-slate-800">
                  <p className="text-sm font-semibold text-[#16324f] dark:text-white">
                    Your account
                  </p>
                  <p className="mt-1 text-xs leading-5 text-[#6b7280] dark:text-slate-300">
                    Manage your rental, agreements and conversations in one place.
                  </p>
                </div>
                <a className="account-menu__link" href="#account">My account</a>
                <a className="account-menu__link" href="#write-review">Write a review</a>
                <a className="account-menu__link" href="#report-dispute">Report a dispute</a>
                <a className="account-menu__link" href="#agreements">Agreements & documents</a>
                <a className="account-menu__link" href="#settings">Settings</a>
                <a className="account-menu__link" href="#sign-out">Sign out</a>
              </div>
            </details>
          </div>
        </div>
      </header>

      <main className="mx-auto w-[min(90%,1440px)]">
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        <section className="mt-14" aria-labelledby="recent-heading">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 id="recent-heading" className="text-xl font-semibold text-[#16324f] dark:text-white">
                Recently viewed
              </h2>
              <p className="mt-1 text-sm text-[#6b7280] dark:text-slate-400">
                Pick up where you left off.
              </p>
            </div>
            <a className="text-sm font-semibold text-[#2f80ed] hover:underline" href="#recently-viewed">
              View all
            </a>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recentlyViewed.map((listing) => (
              <article
                className="overflow-hidden rounded-xl border border-[#c2c9d2] bg-[#e9edf2] dark:border-slate-800 dark:bg-slate-900"
                key={listing.title}
              >
                <div className={`listing-cover ${listing.imageClass}`}>
                  <span className="rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-[#16324f]">
                    {listing.location}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-[#16324f] dark:text-white">{listing.title}</h3>
                  <p className="mt-1.5 text-sm text-[#6b7280] dark:text-slate-400">{listing.details}</p>
                  <p className="mt-4 text-sm font-semibold text-[#1f2937] dark:text-slate-100">
                    {listing.price}
                    <span className="font-normal text-[#6b7280] dark:text-slate-400"> / month</span>
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      <footer className="mt-16 border-t border-[#c2c9d2] bg-[#e9edf2] dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto flex w-[min(90%,1440px)] flex-wrap justify-between gap-3 py-5 text-xs text-[#6b7280] dark:text-slate-400">
          <span>© 2026 rentuj.to.pl</span>
          <div className="flex gap-5">
            <a className="hover:text-[#2f80ed]" href="#help">Help</a>
            <a className="hover:text-[#2f80ed]" href="#safety">Safety</a>
            <a className="hover:text-[#2f80ed]" href="#privacy">Privacy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
