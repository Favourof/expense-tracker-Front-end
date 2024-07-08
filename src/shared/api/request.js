import axios from "axios";

const baseURL = "https://expense-tracker-3-4g4l.onrender.com/api/v1";

export const publicRequest = axios.create({
  baseURL: baseURL,
});

export const UserRequest = () => {
  const token = localStorage.getItem("token");
  return axios.create({
    baseURL: baseURL,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};