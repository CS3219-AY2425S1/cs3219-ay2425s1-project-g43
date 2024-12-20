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

export async function createNewUserHistory(roomName, firstUserId, question) {
  const date = new Date();
  const saves = [];
  const languages = [];
  const newUserHistory = new UserHistoryModel({
    _id: roomName,
    firstUserId,
    question,
    date,
    saves,
    languages,
  });
  newUserHistory.save();
  return newUserHistory;
}

export async function saveUserHistory(roomName, document, currentLanguage) {
  try {
    const date = new Date();
    const userHistory = await UserHistoryModel.findById(roomName);
    if (!userHistory) {
      return null;
    }
    userHistory.saves = [...userHistory.saves, document];
    userHistory.languages = [...userHistory.languages, currentLanguage];
    userHistory.date = date;
    userHistory.save();
    return userHistory;
  } catch (error) {
    console.log(error);
  }
}

export async function addUserToUserHistory(roomName, secondUserId) {
  try {
    const userHistory = await UserHistoryModel.findById(roomName);
    if (!userHistory) {
      return null;
    }
    userHistory.secondUserId = secondUserId;
    userHistory.save();
  } catch (error) {
    console.log(error);
  }
}

export async function findUserHistoryByUserId(userId) {
  // sorted by latest first
  const userHistoryList = await UserHistoryModel.find({
    $or: [{ firstUserId: userId }, { secondUserId: userId }],
    $expr: { $gt: [{ $size: '$saves' }, 0] },
  }).sort({ date: -1 });
  return userHistoryList;
}

export async function getUserHistoryByRoomname(roomName) {
  return UserHistoryModel.findById(roomName);
}
