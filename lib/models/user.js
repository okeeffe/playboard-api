import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import uuid from 'node-uuid';

const SALT_WORK_FACTOR = 10;

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    first: { type: String, required: true },
    last: String,
  },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  pwdLastChangedAt: { type: Date, default: Date.now },
  lastLoggedIn: { type: Date, default: Date.now },
  numLogins: { type: Number, default: 0 },
  apiKey: { type: String, unique: true, required: true, default: uuid.v4 },
  akLastChangedAt: { type: Date, default: Date.now },
  super: { type: Boolean, default: false },
});

UserSchema.pre('save', function hashIt(next) {
  const user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) {
    return next();
  }

  bcrypt.genSalt(SALT_WORK_FACTOR, (saltErr, salt) => {
    if (saltErr) {
      return next(saltErr);
    }

    bcrypt.hash(user.password, salt, (hashErr, hash) => {
      if (hashErr) {
        return next(hashErr);
      }

      // Overwrite the cleartext password with the hash
      user.password = hash;
      return next();
    });
  });
});

UserSchema.comparePassword = function compareIt(candidatePassword, cback) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    if (err) {
      return cback(err);
    }

    return cback(null, isMatch);
  });
};

UserSchema.virtual('fullname').get(function concatNames() {
  return `${this.name.first} ${this.name.last}`;
});

const userModel = mongoose.model('User', UserSchema);
export default userModel;
