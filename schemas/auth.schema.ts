import z from "zod";

export const authSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email!" }),
  password: z.string().min(1, { message: "Enter a valid password!" }),
});

export type AuthSchema = z.infer<typeof authSchema>;
