import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { route } from "./Route/index.jsx";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "./components/ui/toaster";
import { AuthProvider } from "./context/AuthContext";
import { CurrencyProvider } from "./context/CurrencyContext";
import { FinanceProvider } from "./context/FinanceContext";
import PwaPrompt from "./components/pwa/PwaPrompt";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <CurrencyProvider>
        <FinanceProvider>
          <RouterProvider router={route} />
          <PwaPrompt />
          <Toaster />
        </FinanceProvider>
      </CurrencyProvider>
    </AuthProvider>
  </React.StrictMode>
);
