import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const PublicOnlyRoute = ({ children }) => {
  const { accessToken, isRefreshing } = useAuth();

  if (isRefreshing) {
    return children;
  }

  if (accessToken) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

PublicOnlyRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PublicOnlyRoute;
