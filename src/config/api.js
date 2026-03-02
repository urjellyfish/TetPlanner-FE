import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080/api",
  // withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token && token !== "undefined" && token !== "null") {
      console.log("Token found:", token);
      config.headers.Authorization = `Bearer ${token.trim()}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);
