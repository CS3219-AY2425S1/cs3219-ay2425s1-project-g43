import axios from "axios";

export const createAxiosInstance = (baseURL) => {
  const api = axios.create({
    baseURL: baseURL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Add interceptor to attach token to the Authorization header
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }, (error) => {
    return Promise.reject(error);
  });

  return api;
};
