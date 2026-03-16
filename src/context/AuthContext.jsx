import  { createContext, useContext, useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { publicRequest } from "@/shared/api/request";
import { getAccessToken, setAccessToken } from "@/shared/api/tokenStore";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [accessToken, setTokenState] = useState(getAccessToken());
  const [sessionExpired, setSessionExpired] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const setToken = (token) => {
    setAccessToken(token);
    setTokenState(token || "");
  };

  const login = async (data) => {
    const res = await publicRequest.post("/loginuser", data);
    const token = res?.data?.accessToken || "";
    setToken(token);
    setSessionExpired(false);
    return res;
  };

  const logout = async () => {
    try {
      await publicRequest.post("/logout");
    } finally {
      setToken("");
      setSessionExpired(false);
    }
  };

  useEffect(() => {
    const handleExpired = () => {
      setSessionExpired(true);
      setToken("");
    };
    const handleRefreshStart = () => setIsRefreshing(true);
    const handleRefreshEnd = () => setIsRefreshing(false);
    window.addEventListener("auth:expired", handleExpired);
    window.addEventListener("auth:refresh:start", handleRefreshStart);
    window.addEventListener("auth:refresh:end", handleRefreshEnd);
    return () => {
      window.removeEventListener("auth:expired", handleExpired);
      window.removeEventListener("auth:refresh:start", handleRefreshStart);
      window.removeEventListener("auth:refresh:end", handleRefreshEnd);
    };
  }, []);

  const clearSessionExpired = () => setSessionExpired(false);

  const value = useMemo(
    () => ({
      accessToken,
      setToken,
      login,
      logout,
      sessionExpired,
      clearSessionExpired,
      isRefreshing,
    }),
    [accessToken, sessionExpired, isRefreshing]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
