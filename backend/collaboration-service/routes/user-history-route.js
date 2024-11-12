import express from 'express';
import {
  findUserHistoryByUserId,
  getUserHistoryByRoomname,
} from '../model/repository.js';
import { attachUserId } from '../middleware/basic-access-control.js';
const router = express.Router();

router.get('/userHistoryList', attachUserId, async (req, res) => {
  const userId = req.user.id;
  const userHistoryList = await findUserHistoryByUserId(userId);
  return res.json(userHistoryList).status(200);
});

router.get('/:roomName', async (req, res) => {
  const { roomName } = req.params;
  const userHistory = await getUserHistoryByRoomname(roomName);
  console.log(userHistory);
  if (!userHistory) {
    return res.status(404).json({ message: 'User history not found' });
  }
  return res.json(userHistory).status(200);
});

export default router;
