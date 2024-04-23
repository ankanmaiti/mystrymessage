import { z } from "zod";
import {
  emailValidation,
  passwordValidation,
  usernameValidation,
} from "./user.schema";

export const LoginSchema = z.object({
  identifier: z.union([usernameValidation, emailValidation]).refine(
    (value) => {
      // Check if the value is strictly a username or an email
      const isUsername = usernameValidation.safeParse(value).success;
      const isEmail = emailValidation.safeParse(value).success;
      return isUsername !== isEmail; // Ensure it's strictly one or the other
    },
    {
      message: "Input must be either valid a username or an email",
      path: ["usernameOrEmail"], // Specifies the path of the error
    },
  ),
  password: passwordValidation,
});
