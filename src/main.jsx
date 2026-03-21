import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { route } from "./Route/index.jsx";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "./components/ui/toaster";
import { AuthProvider } from "./context/AuthContext";
import { CurrencyProvider } from "./context/CurrencyContext";
import { FinanceProvider } from "./context/FinanceContext";
import { registerSW } from "virtual:pwa-register";

registerSW({ immediate: true });

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <CurrencyProvider>
        <FinanceProvider>
          <RouterProvider router={route} />
          <Toaster />
        </FinanceProvider>
      </CurrencyProvider>
    </AuthProvider>
  </React.StrictMode>
);
