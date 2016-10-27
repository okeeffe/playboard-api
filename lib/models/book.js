import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const BookSchema = new Schema({
  name: { type: String, default: 'Untitled' },
  authors: [Schema.Types.ObjectId],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  description: String,
});

const bookModel = mongoose.model('Book', BookSchema);
export default bookModel;
