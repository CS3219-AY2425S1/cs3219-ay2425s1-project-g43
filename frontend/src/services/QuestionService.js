import { createAxiosInstance } from "./Api";

const questionServiceBaseURL = import.meta.env.VITE_QUESTION_SERVICE_BASEURL;

const questionApi = createAxiosInstance(questionServiceBaseURL);

export const getQuestions = async () => {
  try {
    const response = await questionApi.get("/question");
    return response.data;
  } catch (error) {
    throw new Error("Error fetching questions");
  }
};

export const deleteQuestion = async (id) => {
  try {
    const response = await questionApi.delete(`/question/${id}`);
    return response.data;
  } catch (error) {
    throw new Error("Error deleting question");
  }
};

export const updateQuestion = async (id, question) => {
  try {
    const response = await questionApi.put(`/question/${id}`, question);
    return response.data;
  } catch (error) {
    throw new Error("Error updating question");
  }
};

export const createQuestion = async (question) => {
  try {
    const response = await questionApi.post("/question", question);
    return response.data;
  } catch (error) {
    console.log("Error creating question", error);
    throw new Error("Error creating question");
  }
};
