import axios from "axios";

export const createAxiosInstance = (baseURL) => {
  const api = axios.create({
    baseURL: baseURL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  return api;
};
