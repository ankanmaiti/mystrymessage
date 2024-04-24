import { NextResponse } from "next/server";
import { ApiError } from "./apiError";
import { ApiResponse } from "./apiResponse";

function JsonResponse(res: any) {
  // return customize response
  const resIsApiResponse = res instanceof ApiResponse;
  const resIsApiError = res instanceof ApiError;
  const resIsNextResponse = res instanceof NextResponse;

  if (resIsNextResponse) {
    return res;
  }

  if (!resIsApiResponse && !resIsApiError) {
    console.log("unknown response type : ", typeof res);
    console.log("response : ", res);
    throw new Error("unknown response type");
  }

  // default response
  return Response.json(
    {
      statusCode: res.statusCode,
      success: res.success,
      message: res.message,
      data: res.data,
    },
    {
      status: res.statusCode,
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
}

type AsyncCallback = (...args: any[]) => Promise<any>;

export function asyncHandler(asyncCallback: AsyncCallback) {
  return async (...args: any[]) =>
    Promise.resolve(asyncCallback(...args))
      .then(JsonResponse)
      .catch(JsonResponse);
}
