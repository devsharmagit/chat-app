import { z } from "zod";

export const SignupSchema = z.object({
  name: z.string().min(3).max(50),
  email: z.string().email(),
  password: z.string().min(6)
});

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export type SignupSchemaType = z.infer<typeof SignupSchema>;
export type LoginSchemaType = z.infer<typeof LoginSchema>;


