import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const PlaySchema = new Schema({
  name: { type: String, default: 'Untitled' },
  author: Schema.Types.ObjectId,
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Play', PlaySchema);
