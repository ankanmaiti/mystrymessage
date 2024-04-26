import { MessageModel } from "@/models/message.model";
import mongoose from "mongoose";

export const getUserMessages = async (userId: string, skip = 0, limit = 10) =>
  await MessageModel.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $sort: {
        createdAt: -1,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
        pipeline: [
          {
            $project: {
              _id: 0,
              username: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        owner: {
          $first: "$owner.username",
        },
      },
    },
    {
      $skip: skip,
    },
    {
      $limit: limit,
    },
  ]);
