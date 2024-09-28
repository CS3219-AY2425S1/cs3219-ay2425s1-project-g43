import QuestionModel from "./question-model.js";
import "dotenv/config";
import { connect } from "mongoose";

export async function connectToDB() {
  let mongoDBUri =
    process.env.ENV === "PROD"
      ? process.env.DB_CLOUD_URI
      : process.env.DB_LOCAL_URI;

  await connect(mongoDBUri);
}

// Create a new question 
export async function createQuestion(id, title, description, category, complexity) {
  return new QuestionModel({ id, title, description, category, complexity}).save();
}

// Find questions using id
export async function findQuestionById(id) {
  return QuestionModel.findById(id);
}

//check for duplicates by title and description
export async function checkDuplicateQuestion(title, description) {
  return QuestionModel.findOne({ $and: [{ title }, { description }] });
}

// Find a question using title
export async function findQuestionByTitle(title) {
  return QuestionModel.findOne({ title });
}

// Find all the questions from the model
export async function findAllQuestions() {
    return QuestionModel.find();
}

// Find a question using category and complexity
export async function findQuestionByComplexity(complexity) {
  return QuestionModel.findOne({ complexity });
}

// Update question using Id
export async function updateQuestionById(id, title, description, category, complexity) {
  return QuestionModel.findOneAndUpdate(
    id , // filter by id,
    {
      $set: {
        title,
        description,
        category,
        complexity
      },
    },
    { new: true },  // return the updated question
  );
}

// Delete the question using Id
export async function deleteQuestionById(id) {
  return QuestionModel.findOneAndDelete(id);
}