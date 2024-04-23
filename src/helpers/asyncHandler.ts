import { ApiError } from "./apiError";
import { ApiResponse } from "./apiResponse";

function JsonResponse(res: ApiResponse | ApiError) {
  return Response.json(
    {
      statusCode: res.statusCode,
      success: res.success,
      message: res.message,
      data: res.data,
    },
    {
      status: res.statusCode,
    },
  );
}

export function asyncHandler(asyncCallback: (...args: any[]) => Promise<ApiResponse>) {
  return async (...args: any[]) => {
    try {
      const res: ApiResponse = await asyncCallback(...args);
      return JsonResponse(res);
    } catch (err) {
      // got ApiError then send response
      if (err instanceof ApiError) {
        return JsonResponse(err);
      }
      console.error("error: ", err);
    }
  };
}
