import * as z from "zod";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

export const brandSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Enter a valid customer group name!" })
    .regex(/^[A-Za-z ]+$/, {
      message: "Name can contain only letters and spaces",
    }),

  image: z
    .union([
      z.string().min(1, { message: "Image is required!" }),
      z
        .instanceof(File, { message: "Logo is required!" })
        .refine((f) => f.size <= MAX_FILE_SIZE, {
          message: "Logo must be less than 2MB!",
        })
        .refine(
          (f) => ["image/jpeg", "image/png", "image/gif"].includes(f.type),
          { message: "Logo must be a .jpg, .jpeg, .gif, or .png file!" },
        ),
    ])
    .optional(),

  status: z.boolean({
    message: "Status is required!",
  }),
});

export type BrandSchemaType = z.infer<typeof brandSchema>;
