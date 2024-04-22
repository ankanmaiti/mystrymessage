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

export function asyncHandler(
  requestHandler: (req: Request) => Promise<ApiResponse>,
) {
  return async (req: Request) => {
    try {
      const res: ApiResponse = await requestHandler(req);
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
