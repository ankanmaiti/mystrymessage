import { z } from "zod";
import {
  emailSchema,
  fullnameSchema,
  passwordSchema,
  usernameSchema,
} from "./user.Schema";

export const SignupSchema = z
  .object({
    username: usernameSchema,
    fullname: fullnameSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match!",
    path: ["confirmPassword"], // Specifies the path of the error
  });
