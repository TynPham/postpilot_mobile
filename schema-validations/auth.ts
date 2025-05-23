import * as z from "zod";

export const signInSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export type SignInSchema = z.infer<typeof signInSchema>;

export const signUpSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
  username: z.string().min(1, "Username is required"),
});

export type SignUpSchema = z.infer<typeof signUpSchema>;

export const verifyEmailSchema = z.object({
  code: z.string().min(1, "Code is required"),
});

export type VerifyEmailSchema = z.infer<typeof verifyEmailSchema>;
