import "./App.css";
import { useEffect, useState } from "react";
import Homepage from "./pages/Homepage";
import { Navigate, Route, Routes } from "react-router-dom";
import type { ReactNode } from "react";
import RecentlyViewed from "./components/main/RecentlyViewed";
import Header from "./components/main/Header";
import Fotter from "./components/main/Footer";
import ThanksPage from "./pages/static_pages/ThanksPage";
import PasswordChangePage from "./pages/static_pages/PasswordChangePage";
import UpdateUserPage from "./pages/UpdateUserPage";
import { useUserContext } from "./components/context/UserContext";
import type { UserType } from "./types";

function RequireAuth({
  children,
  user,
}: {
  children: ReactNode;
  user: UserType | undefined;
}) {
  const accessToken = window.localStorage.getItem("access");

  return user || accessToken ? children : <Navigate to="/" replace />;
}

function App() {
  const { user } = useUserContext();
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
          <Route path="/" element={<Homepage />} />
          <Route
            path="/activate-account/:uidb64/:token"
            element={<ThanksPage />}
          />
          <Route
            path="/verify-email/:uidb64/:token"
            element={<ThanksPage />}
          />
          <Route
            path="/password-reset/:uidb64/:token"
            element={<PasswordChangePage />}
          />
          <Route
            path="/profile/edit"
            element={
              <RequireAuth user={user}>
                <UpdateUserPage />
              </RequireAuth>
            }
          />
        </Routes>

        <RecentlyViewed />
      </main>

      <Fotter />
    </div>
  );
}

export default App;
