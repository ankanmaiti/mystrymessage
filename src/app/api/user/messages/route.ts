import { getUserMessages } from "@/aggrigations/userMessages.aggrigation";
import { ApiError } from "@/helpers/apiError";
import { ApiResponse } from "@/helpers/apiResponse";
import { asyncHandler } from "@/helpers/asyncHandler";
import { getLoggedInUser } from "@/helpers/getLoggedInUser";
import dbConnect from "@/lib/dbConnect";
import { MessageModel } from "@/models/message.model";
import { messageSchema } from "@/schemas/message.schema";

export const GET = asyncHandler(async (req: Request) => {
  await dbConnect();

  const params = new URL(req.url).searchParams;
  const skip = Number(params.get("skip") ?? "0");
  const limit = Number(params.get("limit") ?? "10");

  const user = await getLoggedInUser();
  if (!user) {
    throw new ApiError(404, "Invalid Session! please login");
  }

  const messages = await getUserMessages(user._id as string, skip, limit);

  return new ApiResponse(
    200,
    messages,
    messages
      ? "successfully retrive messages"
      : "user doesnot have any message",
  );
});

export const POST = asyncHandler(async (req: Request) => {
  await dbConnect();

  const body = await req.json();
  const message = messageSchema.safeParse(body);

  if (!message.success) {
    throw new ApiError(400, message.error.message);
  }

  const user = await getLoggedInUser();
  if (!user) {
    throw new ApiError(404, "Invalid Session! please login");
  }

  const newMessage = await MessageModel.create({
    ...message.data,
    owner: user._id as string,
  });

  if (!newMessage) {
    throw new ApiError(
      500,
      "Somethig went wrong while uploading message to the database",
    );
  }

  return new ApiResponse(200, newMessage, "successfully created");
});
