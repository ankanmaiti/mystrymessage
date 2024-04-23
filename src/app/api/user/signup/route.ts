import dbConnect from "@/lib/dbConnect";
import UserModel, { UserSchema } from "@/models/user.model";
import bcrypt from "bcryptjs";

import { ApiError } from "@/helpers/apiError";
import { ApiResponse } from "@/helpers/apiResponse";
import { asyncHandler } from "@/helpers/asyncHandler";

export const POST = asyncHandler(async (req: Request) => {
  // connect to database
  await dbConnect();

  // get validated payload
  const { username, email, fullname, password } = await req.json();

  // find existing user
  const user = await UserModel.findOne<UserSchema>(
    {
      $or: [{ username }, { email }],
    },
    {
      username: 1,
      email: 1,
    },
  );

  // verified user with same email
  if (user?.email == email) {
    throw new ApiError(400, "user already registered with given email");
  }

  // username already taken
  if (user?.username == username) {
    throw new ApiError(400, "username has already been taken");
  }

  if (user) {
    throw new ApiError(500, "Something went wrong, user suppose to be null");
  }

  // the below code for unverified or new user
  const hashedPassword = await bcrypt.hash(password, 10);

  // user does not exists
  const newUser = await UserModel.create({
    username,
    email,
    fullname,
    password: hashedPassword,
  });

  if (!newUser) {
    throw new ApiError(500, "Something went wrong while creating new user");
  }

  return new ApiResponse(
    200,
    {
      username: newUser.username,
    },
    "user registered successfully. please now verify the user",
  );
});
