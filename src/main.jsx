import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { route } from "./Route/index.jsx";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "./components/ui/toaster";
import { Provider } from "react-redux";
import { store } from "./store";
import { AuthProvider } from "./context/AuthContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <AuthProvider>
        <RouterProvider router={route} />
        <Toaster />
      </AuthProvider>
    </Provider>
  </React.StrictMode>
);
