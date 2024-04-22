import { z } from "zod";
import { emailSchema, passwordSchema, usernameSchema } from "./user.Schema";

export const LoginSchema = z.object({
  identifier: z.union([usernameSchema, emailSchema]).refine(
    (value) => {
      // Check if the value is strictly a username or an email
      const isUsername = usernameSchema.safeParse(value).success;
      const isEmail = emailSchema.safeParse(value).success;
      return isUsername !== isEmail; // Ensure it's strictly one or the other
    },
    {
      message: "Input must be either valid a username or an email",
      path: ["usernameOrEmail"], // Specifies the path of the error
    },
  ),
  password: passwordSchema,
});
