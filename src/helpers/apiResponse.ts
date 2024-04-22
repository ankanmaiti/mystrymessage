export class ApiResponse {
  statusCode: number;
  data: unknown | null;
  message: string;
  success: boolean;

  constructor(statusCode: number, data: unknown, message: string) {
    this.statusCode = statusCode;
    this.message = message;
    this.success = this.statusCode < 400;
    this.data = data;
  }
}
