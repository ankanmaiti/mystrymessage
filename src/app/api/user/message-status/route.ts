import { ApiError } from "@/helpers/apiError";
import { ApiResponse } from "@/helpers/apiResponse";
import { asyncHandler } from "@/helpers/asyncHandler";
import { getLoggedInUser } from "@/helpers/getLoggedInUser";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.model";


export const GET = asyncHandler(async () => {
  await dbConnect();

  const user = await getLoggedInUser();

  const existingUser = await UserModel.findById(user._id, {
    _id: 0,
    username: 1,
    isAcceptiongMessage: 1,
  });

  if (!existingUser) {
    throw new ApiError(401, "user not found");
  }

  return new ApiResponse(200, existingUser, "user fetched successfully");
});

export const PATCH = asyncHandler(async () => {
  await dbConnect();

  const user = await getLoggedInUser();

  const updatedUser = await UserModel.findOneAndUpdate(
    {
      username: user.username,
    },
    {
      isAcceptiongMessage: user.isAcceptiongMessage,
    },
    {
      new: true, // return new updated user
      projection: {
        _id: 0,
        username: 1,
        isAcceptiongMessage: 1,
      },
    },
  );

  if (!updatedUser) {
    throw new ApiError(
      401,
      "failed to update user status for message acceptence",
    );
  }

  return new ApiResponse(
    200,
    updatedUser,
    "Message acceptence status updates successfully",
  );
});
