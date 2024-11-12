import mongoose from 'mongoose';
import { ObjectId } from 'mongodb';

const UserHistoryModelSchema = mongoose.Schema({
  firstUserId: {
    type: ObjectId,
    required: true,
  },

  secondUserId: {
    type: ObjectId,
  },

  date: {
    type: Date,
    required: true,
  },

  question: {
    type: JSON,
    required: true,
  },

  saves: {
    type: [String],
  },

  languages: {
    type: [String],
  },
});

UserHistoryModelSchema.index({ firstUserId: 1 });
UserHistoryModelSchema.index({ secondUserId: 1 });

export default mongoose.model('UserHistoryModel', UserHistoryModelSchema);
