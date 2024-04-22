import { Schema, model, Document } from "mongoose";

export interface MessageSchema extends Document {
  content: string;
}

export const messageSchema = new Schema<MessageSchema>(
  {
    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

