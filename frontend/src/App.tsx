import "./App.css";
import { useEffect, useState } from "react";
import Homepage from "./pages/Homepage";
import { Navigate, Route, Routes } from "react-router-dom";
import RecentlyViewed from "./components/main/RecentlyViewed";
import Header from "./components/main/Header";
import Fotter from "./components/main/Footer";
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
          <Route path="/" element={<Homepage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        <RecentlyViewed />
      </main>

      <Fotter />
    </div>
  );
}

export default App;
