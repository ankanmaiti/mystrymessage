import { z } from "zod";

export const usernameValidation = z
  .string()
  .min(5, "username must be at least 5 characters")
  .max(20, "username must be no more than 20 characters")
  .regex(/^[a-zA-Z0-9_]/, "username must not contain any special characters");

export const fullnameValidation = z
  .string()
  .min(3, "fullname must be at least 3 characters long")
  .regex(/^[a-zA-z\\s]/);

export const emailValidation = z.string().email("Invalid email address");

export const passwordValidation = z
  .string()
  .min(8, "password must be at least 8 characters");
