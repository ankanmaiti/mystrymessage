export class ApiError extends Error {
  statusCode: number;
  success: boolean;
  data: unknown

  constructor(statusCode: number, message: string) {
    super();
    this.statusCode = statusCode;
    this.success = false;
    this.message = message;
    this.data = null
  }
}
