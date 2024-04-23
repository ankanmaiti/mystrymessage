import { z } from "zod";
import {
  emailValidation,
  fullnameValidation,
  passwordValidation,
  usernameValidation,
} from "./user.schema";

export const SignupSchema = z
  .object({
    username: usernameValidation,
    fullname: fullnameValidation,
    email: emailValidation,
    password: passwordValidation,
    confirmPassword: passwordValidation,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match!",
    path: ["confirmPassword"], // Specifies the path of the error
  });
