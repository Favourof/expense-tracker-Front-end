import axios from "axios";
import { getAccessToken, setAccessToken } from "./tokenStore";

const baseURL = "https://expense-tracker-3-4g4l.onrender.com/api/v1";

export const publicRequest = axios.create({
  baseURL,
  withCredentials: true,
});

export const apiClient = axios.create({
  baseURL,
  withCredentials: true,
});

const refreshClient = axios.create({
  baseURL,
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original?._retry) {
      original._retry = true;
      try {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("auth:refresh:start"));
        }
        const res = await refreshClient.post("/refresh");
        const newToken = res?.data?.accessToken;
        if (newToken) {
          setAccessToken(newToken);
          original.headers.Authorization = `Bearer ${newToken}`;
          return apiClient(original);
        }
      } catch (err) {
        setAccessToken("");
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("auth:expired"));
        }
        return Promise.reject(err);
      } finally {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("auth:refresh:end"));
        }
      }
    }
    return Promise.reject(error);
  },
);
