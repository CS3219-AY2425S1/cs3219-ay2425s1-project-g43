import express from 'express';
import {
  findUserHistoryByUserId,
  getUserHistoryByRoomname,
} from '../model/repository.js';
import { attachUserId } from '../middleware/basic-access-control.js';
const router = express.Router();

router.get('/:id', (req, res) => {
  const { _id } = req.params;
  const userHistory = getUserHistoryByRoomname(_id);
  if (!userHistory) {
    return res.status(404).json({ message: 'User history not found' });
  }
  return res.json(userHistory).status(200);
});
router.get('/', attachUserId, (req, res) => {
  const userId = req.user.id;
  const userHistoryList = findUserHistoryByUserId(req.user.id);
  return res.json(userHistoryList).status(200);
});

export default router;
