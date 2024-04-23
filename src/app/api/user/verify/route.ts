import { ApiError } from "@/helpers/apiError";
import { ApiResponse } from "@/helpers/apiResponse";
import { asyncHandler } from "@/helpers/asyncHandler";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import dbConnect from "@/lib/dbConnect";
import UserModel, { UserSchema } from "@/models/user.model";

export const PATCH = asyncHandler(async (req: Request) => {
  await dbConnect();

  const { username, email } = await req.json();

  if (!username && !email) {
    throw new ApiError(404, "either username or email required");
  }

  // genarate verify code with expiry date
  const verifyCode = Math.floor(1e5 + Math.random() * 9e5).toString();

  const verifyCodeExpiry = new Date();
  verifyCodeExpiry.setMinutes(verifyCodeExpiry.getMinutes() + 10);

  // store verification code in user document
  const user = await UserModel.findOneAndUpdate<UserSchema>(
    {
      $or: [
        { username, isVerified: false },
        { email, isVerified: false },
      ],
    },
    {
      verifyCode,
      verifyCodeExpiry,
    },
  ).select("username email isVerified verifyCode");

  if (!user) {
    throw new ApiError(400, "user already verified");
  }

  // send verifyCode (otp) to the user's email
  const emailResponse = await sendVerificationEmail(
    user.username,
    user.email,
    user.verifyCode as string,
  );

  if (!emailResponse.success) {
    throw new ApiError(
      500,
      "Something went wrong while sending verification code to email",
    );
  }

  return new ApiResponse(
    200,
    emailResponse,
    "Successfully send otp to the email",
  );
});



// verify user via input otp
export const POST = asyncHandler(async (req: Request) => {
  await dbConnect();

  const { otp, username } = await req.json();

  if (!otp || !username) {
    throw new ApiError(400, "otp & username is required");
  }

  const user = await UserModel.findOne(
    { username },
    {
      username: 1,
      email: 1,
      isVerified: 1,
      verifyCode: 1,
      verifyCodeExpiry: 1,
    },
  );

  if (!user) {
    throw new ApiError(500, "Something went wrong while fetching user");
  }

  if (user.isVerified) {
    throw new ApiError(400, "user already verified");
  }

  if (user.verifyCode != otp) {
    throw new ApiError(309, "Invalid OTP");
  }

  const expiryDate = new Date(user.verifyCodeExpiry || "");
  const now = new Date();

  if (expiryDate < now) {
    throw new ApiError(309, "OTP expired");
  }

  user.isVerified = true;
  user.verifyCode = undefined;
  user.verifyCodeExpiry = undefined;
  const savedUser = await user.save();

  if (!savedUser) {
    throw new ApiError(
      500,
      "Something went wrong while updating user verification",
    );
  }

  return new ApiResponse(200, user, "user successfully verified");
});
