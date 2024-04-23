import mongoose from "mongoose";
import { MessageSchema, messageSchema } from "./message.model";

export interface UserSchema extends mongoose.Document {
  username: string;
  email: string;
  fullname: string;
  password: string;
  verifyCode?: string;
  verifyCodeExpiry?: Date;
  isVerified: boolean;
  isAcceptiongMessage: boolean;
  messages: MessageSchema[];
}

const userSchema = new mongoose.Schema<UserSchema>(
  {
    username: {
      type: String,
      required: [true, "username is required"],
      lowercase: true,
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      required: [true, "email is required"],
      lowercase: true,
      trim: true,
      unique: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "please user a valid email address",
      ],
    },
    password: {
      type: String,
      required: [true, "password is required"],
      lowercase: true,
      trim: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verifyCode: {
      type: String,
      lowercase: true,
      trim: true,
    },
    verifyCodeExpiry: {
      type: Date,
    },
    isAcceptiongMessage: {
      type: Boolean,
      default: true,
    },
    messages: [messageSchema],
  },
  {
    timestamps: true,
  },
);

/*
 * since nextjs run on edges so nextjs dont know if model already exists or not
 * steps:
 * 1. if model already exists get that model
 * 2. else create a new model
 */
const UserModel =
  (mongoose.models.User as mongoose.Model<UserSchema>) ||
  mongoose.model<UserSchema>("User", userSchema);

export default UserModel;
