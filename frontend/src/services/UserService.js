import { createAxiosInstance } from "./Api";

const userServiceBaseURL = import.meta.env.VITE_USER_SERVICE_BASEURL;

const userApi = createAxiosInstance(userServiceBaseURL);

export const createUser = async (user) => {
  try {
    const response = await userApi.post("/users", user);
    return response.data;
  } catch (error) {
    throw new Error("Error creating user", error);
  }
};

// UserService.js

export const loginUser = async (user) => {
  try {
    const response = await userApi.post("/auth/login", user);

    const token = response.data.data.accessToken;

    if (!token) {
      throw new Error("Token not found in the login response.");
    }

    localStorage.setItem("jwtToken", token);

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Invalid login credentials");
  }
};


export const fetchCurrentUser = async () => {
  try {
    const token = localStorage.getItem("jwtToken");

    if (!token) throw new Error("No JWT token found");

    const response = await userApi.get("/auth/verify-token", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    throw new Error("Error fetching user data");
  }
};
