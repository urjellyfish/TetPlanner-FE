import axios from "axios";

export const api = axios.create({
  baseURL: "https://9b9ca163-67b9-4269-a89c-c1a4c0f14c29.mock.pstmn.io",
  // withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);
