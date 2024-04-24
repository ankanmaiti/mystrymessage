import { ApiError } from "@/helpers/apiError";
import { ApiResponse } from "@/helpers/apiResponse";
import { asyncHandler } from "@/helpers/asyncHandler";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import dbConnect from "@/lib/dbConnect";
import UserModel, { UserSchema } from "@/models/user.model";
import {
  otpValidation,
  usernameValidation,
} from "@/schemas/user.schema";

export const PATCH = asyncHandler(async (req: Request) => {
  await dbConnect();

  const { username, email } = await req.json();

  if (!username && !email) {
    throw new ApiError(404, "either username or email required");
  }

  // genarate verify code with expiry date
  const randomCode = Math.floor(1e5 + Math.random() * 9e5).toString();
  const otp = otpValidation.safeParse(randomCode);

  if (!otp.success) {
    throw new ApiError(500, "Something went wrong while generate otp");
  }

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
      verifyCode: otp.data,
      verifyCodeExpiry,
    },
  ).select("username email isVerified verifyCode");

  if (!user) {
    throw new ApiError(400, "user already verified");
  }

  // send verifyCode (otp) to the user's email
  const emailResponse = await sendVerificationEmail(
    user.email,
    user.username,
    otp.data,
  );

  if (!emailResponse) {
    throw new ApiError(
      500,
      "Something went wrong while sending verification email",
    );
  }

  if (emailResponse?.error) {
    throw new ApiError(422, emailResponse.error.message);
  }

  return new ApiResponse(
    200,
    emailResponse.data,
    "Successfully send otp to the email",
  );
});

export const POST = asyncHandler(async (req: Request) => {
  dbConnect();

  const body = await req.json();

  const username = usernameValidation.safeParse(body.username);
  const otp = otpValidation.safeParse(body.otp);

  if (!username.success) {
    throw new ApiError(400, username.error.format()._errors.toString());
  }

  if (!otp.success) {
    throw new ApiError(400, otp.error.format()._errors.toString());
  }

  const user = await UserModel.findOne(
    {
      username: username.data,
    },
    {
      isVerified: 1,
      verifyCode: 1,
      verifyCodeExpiry: 1,
    },
  );

  if (!user) {
    throw new ApiError(500, "something went wrong while fetching user");
  }

  if (user.isVerified) {
    throw new ApiError(300, "user already verified");
  }

  const isOtpExpired = new Date(user.verifyCodeExpiry as Date) < new Date();

  if (isOtpExpired) {
    throw new ApiError(400, "OTP has been expired");
  }

  if (otp.data != user.verifyCode) {
    throw new ApiError(400, "Invalid OTP");
  }

  user.isVerified = true;
  user.verifyCode = undefined;
  user.verifyCodeExpiry = undefined;
  const savedUserResponse = await user.save();

  if (!savedUserResponse) {
    throw new ApiError(
      500,
      "Something went wrong while saved user verification",
    );
  }

  return new ApiResponse(200, {}, "user successfully verified");
});
