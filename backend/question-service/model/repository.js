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

export async function createQuestion(title, description, category, complexity) {
  const newQuestion = new QuestionModel({title, description, category, complexity});
  newQuestion.qid = newQuestion._id;    // Update the qid field to the _id
  newQuestion.save();
  return newQuestion;
}

// Find questions using id
export async function findQuestionById(id) {
  return QuestionModel.findById(id);
}

//check for duplicates by title and description
export async function checkDuplicateQuestion(title, description) {
  return QuestionModel.findOne({ $and: [{ title }, { description }] });
}

// Find all the questions from the model
export async function findAllQuestions() {
    return QuestionModel.find();
}

// Find a question using complexity
export async function findQuestionByComplexity(complexity) {
  return QuestionModel.find({ complexity });
}

// Update question using Id
export async function updateQuestionById(id, title, description, category, complexity) {
  return QuestionModel.findByIdAndUpdate(
    id,
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
  return QuestionModel.findByIdAndDelete(id);
}
