import mongoose from "mongoose";
import bcrypt from "bcrypt-nodejs";

// interface to create new User
export interface UserAttrs {
  _id?: mongoose.Schema.Types.ObjectId;
  firstname?: string;
  lastname?: string;
  type?: string;
  email?: string;
  password?: string;
  added?: Date;
}

// interface of User Model
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

// interface of User Document
interface UserDoc extends mongoose.Document {
  _id: mongoose.Schema.Types.ObjectId;
  firstname?: string;
  lastname?: string;
  type?: string;
  email?: string;
  password: string;
  added?: Date;
  comparePassword: (
    candidatePassword: string,
    callback: (err: Error, isMatch: boolean) => void
  ) => void;
}

// Define user model

export const userSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    index: true,
    lowercase: true,
  },
  password: { type: String, required: true },
  type: { type: String, required: true, index: true },
  added: { type: Date, default: Date.now },
});

// Onsave hook, encrypt password
userSchema.pre("save", function (next) {
  const user: any = this;
  bcrypt.genSalt(10, function (err, salt) {
    if (err) {
      return next(err);
    }
    bcrypt.hash(user.password, salt, null, function (err, hash) {
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function (
  candidatePassword: string,
  callback: (err: Error | null, isMatch?: boolean) => void
) {
  const user = this;
  bcrypt.compare(candidatePassword, user.password, function (err, isMatch) {
    if (err) {
      return callback(err);
    }
    callback(null, isMatch);
  });
};

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

export const User = mongoose.model<UserDoc, UserModel>("User", userSchema);
