let accessToken = localStorage.getItem("accessToken") || "";

export const getAccessToken = () => accessToken;

export const setAccessToken = (token) => {
  accessToken = token || "";
  if (token) {
    localStorage.setItem("accessToken", token);
  } else {
    localStorage.removeItem("accessToken");
  }
};
