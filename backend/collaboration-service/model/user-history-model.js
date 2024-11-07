import mongoose from 'mongoose';
import { ObjectId } from 'mongodb';

const UserHistoryModelSchema = mongoose.Schema({
  firstUserId: {
    type: ObjectId,
    required: true,
  },

  secondUserId: {
    type: ObjectId,
    required: true,
  },

  date: {
    type: Date,
    required: true,
  },

  questionId: {
    type: ObjectId,
    required: true,
  },

  document: {
    type: String,
    required: true,
  },
});

UserHistoryModelSchema.index({ firstUserId: 1 });
UserHistoryModelSchema.index({ secondUserId: 1 });

export default mongoose.model('UserHistoryModel', UserHistoryModelSchema);
