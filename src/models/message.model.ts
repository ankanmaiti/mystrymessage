import mongoose from "mongoose";

interface MessageSchema extends mongoose.Document {
  content: string;
  owner: mongoose.ObjectId;
}

export const messageSchema = new mongoose.Schema<MessageSchema>(
  {
    content: {
      type: String,
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true
    },
  },
  {
    timestamps: true,
  },
);

export const MessageModel =
  (mongoose.models.Message as mongoose.Model<MessageSchema>) ||
  mongoose.model<MessageSchema>("Message", messageSchema);
