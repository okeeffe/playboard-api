import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String },
  email: String,
  password: String,
  type: String,
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
});

const userModel = mongoose.model('User', UserSchema);
export default userModel;
