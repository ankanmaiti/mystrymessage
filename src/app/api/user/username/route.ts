import { ApiError } from "@/helpers/apiError";
import { ApiResponse } from "@/helpers/apiResponse";
import { asyncHandler } from "@/helpers/asyncHandler";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.model";
import { usernameValidation } from "@/schemas/user.schema";

export const GET = asyncHandler(async (req: Request) => {
  await dbConnect();

  const url = new URL(req.url);
  const search = url.searchParams.get("search") || url.searchParams.get("q");

  // validation
  const result = usernameValidation.safeParse(search);

  if (!result.success) {
    throw new ApiError(400, result.error.format()._errors.toString());
  }

  const username = result.data

  const existingUser = await UserModel.findOne(
    {
      username,
    },
    {
      username: 1,
      isVerified: 1,
      _id: 0,
    }
  )

  if (!existingUser) {
    return new ApiError(400, "user not exists")
  }

  return new ApiResponse(200, existingUser, `user exists by username: ${existingUser}`);
});
