import SignUpPAge from "@/pages/Auth/SignUP";
import LoginPage from "@/pages/Auth/LogIn";
import HomePage from "@/pages/HomePAge";
import { createBrowserRouter } from "react-router-dom";
import OtpVerification from "@/pages/Auth/OtpVerification";
// import DashBorad from "@/pages/DashBoard";
// import Home from "@/pages/DashBoard/Component/Home";
import DashBoardRoute from "./DashBoardRoute";
import MainDashboard from "@/pages/DashBoard/Component/MainDashboard";
import About from "@/pages/DashBoard/Component/About";
import AllIcome from "@/pages/DashBoard/Component/AllIcome";

export const route = createBrowserRouter([
  {
    path: "/",
    element: <HomePage  />,
  },
  {
    path: "/signup",
    element: <SignUpPAge  />,
  },
  {
    path: "/logIn",
    element: <LoginPage />
  },
  {
    path: "/otp",
    element: <OtpVerification />
  },
  {
    path: "/dashboard",
    element: <DashBoardRoute />,
    children: [
      {
        index: true,
        element: <MainDashboard />
      },
      {
        path: "home",
        element: <AllIcome />
      },
      {
        path: "about",
        element: <About />
      }
    ]
  }
]);
