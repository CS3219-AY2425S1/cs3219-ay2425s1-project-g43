import { createAxiosInstance } from "./Api";

const userHistoryServiceBaseURL = import.meta.env.VITE_COLLABORATION_SERVICE_BASEURL_HTTP;

const userHistoryApi = createAxiosInstance(userHistoryServiceBaseURL);

export const fetchUserHistory = async () => {
  try {
    const response = await userHistoryApi.get("/userHistory/userHistoryList");
    return response.data;
  } catch (error) {
    throw new Error("Error fetching user history: " + error);
  }
};

// UserService.js

export const fetchUserHistoryWithRoomname = async (roomName) => {
  try {
    console.log(roomName);
    const response = await userHistoryApi.get(`/userHistory/${roomName}`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
