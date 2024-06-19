import SignUpPAge from "@/pages/Auth/SignUP";
import LoginPage from "@/pages/Auth/LogIn";
import HomePage from "@/pages/HomePAge";
import { createBrowserRouter } from "react-router-dom";
import OtpVerification from "@/pages/Auth/OtpVerification";
import DashBoardRoute from "./DashBoardRoute";
import MainDashboard from "@/pages/DashBoard/Component/MainDashboard";
import AllIcome from "@/pages/DashBoard/Component/AllIcome";
import Review from "@/pages/DashBoard/Component/Review";
import AddExpense from "@/pages/DashBoard/Component/AddExpense";

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
        path: "income",
        element: <AllIcome />
      },
      {
        path: "review",
        element: <Review />
      },
      {
        path: 'addExpense',
        element: <AddExpense />
      }
    ]
  }
]);
