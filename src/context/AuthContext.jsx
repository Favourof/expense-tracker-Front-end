import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { apiClient, publicRequest } from "@/shared/api/request";
import { getAccessToken, setAccessToken } from "@/shared/api/tokenStore";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [accessToken, setTokenState] = useState(getAccessToken());
  const [currentUser, setCurrentUser] = useState(null);
  const [isUserLoading, setIsUserLoading] = useState(false);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const setToken = (token) => {
    setAccessToken(token);
    setTokenState(token || "");
  };

  const fetchCurrentUser = useCallback(async () => {
    setIsUserLoading(true);
    try {
      const res = await apiClient.post("/checkauth");
      setCurrentUser(res?.data || null);
      return res?.data || null;
    } catch (error) {
      setCurrentUser(null);
      return null;
    } finally {
      setIsUserLoading(false);
    }
  }, []);

  const login = useCallback(async (data) => {
    const res = await publicRequest.post("/loginuser", data);
    const token = res?.data?.accessToken || "";
    setToken(token);
    setSessionExpired(false);
    await fetchCurrentUser();
    return res;
  }, [fetchCurrentUser]);

  const logout = useCallback(async () => {
    try {
      await publicRequest.post("/logout");
    } finally {
      setToken("");
      setSessionExpired(false);
      setCurrentUser(null);
    }
  }, []);

  useEffect(() => {
    const handleExpired = () => {
      setSessionExpired(true);
      setToken("");
      setCurrentUser(null);
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

  useEffect(() => {
    if (accessToken) {
      fetchCurrentUser();
    }
  }, [accessToken, fetchCurrentUser]);

  const clearSessionExpired = () => setSessionExpired(false);

  const value = useMemo(
    () => ({
      accessToken,
      currentUser,
      isUserLoading,
      setToken,
      login,
      logout,
      fetchCurrentUser,
      sessionExpired,
      clearSessionExpired,
      isRefreshing,
    }),
    [
      accessToken,
      currentUser,
      isUserLoading,
      login,
      logout,
      fetchCurrentUser,
      sessionExpired,
      isRefreshing,
    ]
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
