import { configureStore } from "@reduxjs/toolkit";
import AuthSlice from "./features/AuthPage/AuthSlice";
import exchangeRatesSlice from "./features/exchangeRatesSlice";



export const store = configureStore({
  reducer: {
    auth: AuthSlice,
    exchangeRates: exchangeRatesSlice,
    
  },
});