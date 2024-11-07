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

export async function saveUserHistory(
  firstUserId,
  secondUserId,
  questionId,
  document
) {
  const date = new Date();
  const newUserHistory = new UserHistoryModel({
    firstUserId,
    secondUserId,
    questionId,
    date,
    document,
  });
  newUserHistory.save();
  return newUserHistory;
}

export async function findUserHistoryByUserId(userId) {
  // sorted by latest first
  const userHistory = await UserHistoryModel.find({
    $or: [{ firstUserId: userId }, { secondUserId: userId }],
  }).sort({ date: -1 });
  return userHistory;
}

export async function findUserHistoryById(id) {
  return UserHistoryModel.findById(id);
}
