import SignUpPAge from "@/pages/Auth/SignUP";
import LoginPage from "@/pages/Auth/LogIn";
import { createBrowserRouter } from "react-router-dom";
import OtpVerification from "@/pages/Auth/OtpVerification";

export const route = createBrowserRouter([
  {
    path: "/",
    element: <SignUpPAge  />,
  },
  {
    path: "/logIn",
    element: <LoginPage />
  },
  {
    path: "/otp",
    element: <OtpVerification />
  }
]);
