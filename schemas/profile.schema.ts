import * as z from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 2MB

export const profileSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Enter a valid name!" })
    .regex(/^[a-zA-Z ]+$/, {
      message: "Name must contain only letters and spaces!",
    }),
  avatar: z
    .union([
      z.string().min(1, { message: "Avatar is required!" }),
      z
        .instanceof(File, { message: "Avatar is required!" })
        .refine((f) => f.size <= MAX_FILE_SIZE, {
          message: "Avatar must be less than 2MB!",
        })
        .refine(
          (f) => ["image/jpeg", "image/png", "image/gif"].includes(f.type),
          { message: "Avatar must be a .jpg, .jpeg, .gif, or .png file!" },
        ),
    ])
    .optional(),
  phoneNo: z.string().optional(),
  gender: z.boolean({ message: "Select a valid gender!" }),
});

export type ProfileSchemaType = z.infer<typeof profileSchema>;
