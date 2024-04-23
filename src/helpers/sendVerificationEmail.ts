import VerificationEmail from "@/components/emails/verification-template";
import { resend } from "@/services/mail.service";

export async function sendVerificationEmail(
  email: string,
  username: string,
  otp: string,
) {
  try {
    return await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: email,
      subject: "Mystry message | Verification Code",
      react: VerificationEmail({ username, otp }),
    });
  } catch (error) {
    console.log("email response in sendVerificationEmail : ", error);
  }
}
