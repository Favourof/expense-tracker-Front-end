import PropTypes from "prop-types";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Spinner from "@/components/ui/spinner";

const ProtectedRoute = ({ children }) => {
  const { accessToken, isRefreshing } = useAuth();
  const location = useLocation();

  if (!accessToken && isRefreshing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7f4ee]">
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-6 py-4 text-sm font-semibold text-slate-700 shadow-sm">
          <Spinner className="h-4 w-4 text-slate-700" />
          Restoring your session...
        </div>
      </div>
    );
  }

  if (!accessToken) {
    return <Navigate to="/logIn" state={{ from: location }} replace />;
  }

  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProtectedRoute;
