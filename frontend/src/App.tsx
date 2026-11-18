import "./App.css";
import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";

import HomePage from "./pages/HomePage";
import UpdateUserPage from "./pages/UpdateUserPage";
import CreateListing from "./pages/rentals/CreateListingPage";
import CreatePropertyPage from "./pages/rentals/CreatePropertyPage";
import MyPropertiesPage from "./pages/rentals/MyPropertiesPage";
import PropertiesDetailPage from "./pages/rentals/PropertiesDetailPage";
import MyListingPage from "./pages/rentals/MyListingsPage";
import RentalsDetailPage from "./pages/rentals/ListingDetailPage";

import ThanksPage from "./pages/static_pages/ThanksPage";
import PasswordChangePage from "./pages/static_pages/PasswordChangePage";

import Header from "./components/main/Header";
import RecentlyViewed from "./components/main/RecentlyViewed";
import Fotter from "./components/main/Footer";

import RequireAuth from "./components/common/RequireAuth";
import EditRentalPage from "./pages/rentals/EditListingPage";

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
      <Header isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />

      <main className="mx-auto w-[min(90%,1440px)]">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/activate-account/:uidb64/:token"
            element={<ThanksPage />}
          />
          <Route path="/verify-email/:uidb64/:token" element={<ThanksPage />} />
          <Route
            path="/password-reset/:uidb64/:token"
            element={<PasswordChangePage />}
          />
          <Route path="/rental-detail/:pk" element={<RentalsDetailPage />} />
          <Route element={<RequireAuth />}>
            <Route path="/profile/edit" element={<UpdateUserPage />} />
            <Route path="/listing-create" element={<CreateListing />} />
            <Route path="/property-create" element={<CreatePropertyPage />} />
            <Route path="/my-properties" element={<MyPropertiesPage />} />
            <Route
              path="/property-detail/:pk"
              element={<PropertiesDetailPage />}
            />
            <Route path="/my-listings" element={<MyListingPage />} />
            <Route path="/rental-edit/:pk" element={<EditRentalPage />} />
          </Route>
        </Routes>

        <RecentlyViewed />
      </main>

      <Fotter />
    </div>
  );
}

export default App;
