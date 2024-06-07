import { configureStore } from "@reduxjs/toolkit";
import AuthSlice from "./features/AuthPage/AuthSlice";



export const store = configureStore({
  reducer: {
    auth: AuthSlice
    
   
  },
});