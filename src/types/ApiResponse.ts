import { MessageSchema } from "@/models/message.model";

export interface ApiResponse {
  success: boolean,
  message: string,
  isAcceptiongMessages?: boolean,
  messages?: Array<MessageSchema>
}
