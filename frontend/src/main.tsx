import "./index.css";
import App from "./App.tsx";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import { ThemeProvider } from "./components/context/ThemeContextProvider";
import { UserContextProvider } from "./components/context/UserContextProvider.tsx";
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <UserContextProvider>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </UserContextProvider>
    </BrowserRouter>
  </StrictMode>,
);
