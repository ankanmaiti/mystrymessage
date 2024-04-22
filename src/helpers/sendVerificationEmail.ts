import VerificationEmail from "@/components/emails/verification-template";
import { resend } from "@/services/mail.service";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(email: string, username: string, verifyCode: string): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: email,
      subject: "Mystry message | Verification Code",
      react: VerificationEmail({ username, otp: verifyCode }),
    });

    return { success: true, message: "verification email send successfully" };
  } catch (error) {
    console.error("error sending verification email: ", error);
    return { success: false, message: "Failed to send verification email" };
  }
}
