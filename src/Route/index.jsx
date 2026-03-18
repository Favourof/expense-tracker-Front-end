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
import MyExpense from "@/pages/DashBoard/Component/MyExpense";
import ProtectedRoute from "./ProtectedRoute";
import PublicOnlyRoute from "./PublicOnlyRoute";
import ErrorBoundary from "@/components/ErrorBoundary";

export const route = createBrowserRouter([
  {
    path: "/",
    element: <HomePage  />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/signup",
    element: (
      <PublicOnlyRoute>
        <SignUpPAge />
      </PublicOnlyRoute>
    ),
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/logIn",
    element: (
      <PublicOnlyRoute>
        <LoginPage />
      </PublicOnlyRoute>
    ),
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/otp",
    element: (
      <PublicOnlyRoute>
        <OtpVerification />
      </PublicOnlyRoute>
    ),
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <DashBoardRoute />
      </ProtectedRoute>
    ),
    errorElement: <ErrorBoundary />,
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
      },
      {
        path: 'myexpense',
        element: <MyExpense />
      },
    ]
  }
]);
