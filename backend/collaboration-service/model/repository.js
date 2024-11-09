import UserHistoryModel from './user-history-model.js';
import 'dotenv/config';
import { connect } from 'mongoose';

export async function connectToDB() {
  let mongoDBUri =
    process.env.ENV === 'PROD'
      ? process.env.DB_CLOUD_URI
      : process.env.DB_LOCAL_URI;

  await connect(mongoDBUri);
}

export async function createNewUserHistory(firstUserId, question) {
  const date = new Date();
  const document = 'No code attempt was saved';
  const newUserHistory = new UserHistoryModel({
    firstUserId,
    question,
    date,
    document,
  });
  newUserHistory.save();
  return newUserHistory;
}

export async function saveUserHistory(_id, document) {
  const date = new Date();
  const userHistory = UserHistoryModel.findById(_id);
  if (!userHistory) {
    return null;
  }
  userHistory.document = document;
  userHistory.date = date;
  userHistory.save();
}

export async function addUserToUserHistory(_id, secondUserId) {
  const userHistory = UserHistoryModel.findById(_id);
  if (!userHistory) {
    return null;
  }
  userHistory.secondUserId = secondUserId;
  userHistory.save();
}

export async function findUserHistoryByUserId(userId) {
  // sorted by latest first
  const userHistoryList = await UserHistoryModel.find({
    $or: [{ firstUserId: userId }, { secondUserId: userId }],
  }).sort({ date: -1 });
  return userHistoryList;
}

export async function findUserHistoryById(_id) {
  return UserHistoryModel.findById(_id);
}
