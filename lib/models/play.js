import mongoose from 'mongoose';
import shortid from 'shortid';

const Schema = mongoose.Schema;

const KeyframeSchema = new Schema({
  position: {
    x: Number,
    y: Number,
  },
  time: Number,
  special: String,
});

const PlayerSchema = new Schema({
  label: String,
  keyframes: [KeyframeSchema],
  marker: String,
});

const PlaySchema = new Schema({
  name: { type: String, default: 'Untitled' },
  authors: { type: [Schema.Types.ObjectId], minLength: 1 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  books: { type: [Schema.Types.ObjectId], default: [] },
  description: String,
  players: [PlayerSchema],
  path: { type: String, required: true, default: shortid.generate },
  public: { type: Boolean, default: false },
});

const playModel = mongoose.model('Play', PlaySchema);
export default playModel;
