import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import uuid from 'node-uuid';

const SALT_WORK_FACTOR = 10;
const allSensitiveUserPropsMongoStr = '+apiKey +super +lastLoggedInAt +updatedAt +pwdLastChangedAt +akLastChangedAt +numLogins'; // -password
const allUserPropsMongoStr = `${allSensitiveUserPropsMongoStr} +password`;

const Schema = mongoose.Schema;
const UserSchema = new Schema({
  name: {
    first: { type: String, required: true },
    last: String,
  },
  email: { type: String, unique: true, required: true },
  createdAt: { type: Date, default: Date.now },

  password: { type: String, required: true, select: false },
  updatedAt: { type: Date, default: Date.now, select: false },
  pwdLastChangedAt: { type: Date, default: Date.now, select: false },
  lastLoggedInAt: { type: Date, default: Date.now, select: false },
  numLogins: { type: Number, default: 0, select: false },
  apiKey: { type: String, unique: true, required: true, default: uuid.v4, select: false },
  akLastChangedAt: { type: Date, default: Date.now, select: false },
  super: { type: Boolean, default: false, select: false },
});

UserSchema.virtual('fullname').get(function concatNames() {
  return `${this.name.first} ${this.name.last}`;
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

UserSchema.methods.comparePassword = function compareIt(candidatePassword, cback) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    if (err) {
      return cback(err);
    }

    return cback(null, isMatch);
  });
};

if (!UserSchema.options.toObject) { UserSchema.options.toObject = {}; }
UserSchema.options.toObject.transform = function customTransform(doc, obj) { // -, options as unused
  /* eslint-disable no-underscore-dangle */
  const transformedObj = { ...obj };
  transformedObj.id = transformedObj._id;
  transformedObj.name.full = doc.fullname;
  delete transformedObj._id;
  delete transformedObj.__v;
  /* eslint-disable no-underscore-dangle */

  return transformedObj;
};

const userModel = mongoose.model('User', UserSchema);

export { userModel, allSensitiveUserPropsMongoStr, allUserPropsMongoStr };
export default userModel;
