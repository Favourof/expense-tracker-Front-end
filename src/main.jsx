import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { route } from './Route/index.jsx'
import { RouterProvider } from "react-router-dom";
import { Toaster } from './components/ui/toaster';
import { Provider } from "react-redux";
import { store } from "./store";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
  <div>
    <Provider store={store}>
      <RouterProvider router={route} />
      <Toaster />
    </Provider>
  </div>
</React.StrictMode>
)
