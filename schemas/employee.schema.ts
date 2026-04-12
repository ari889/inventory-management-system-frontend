import * as z from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const nullableString = (schema: z.ZodString) =>
  schema.nullable().or(z.literal("").transform(() => null));

export const employeeSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Enter a valid employee name!" })
    .regex(/^[A-Za-z0-9% ]+$/, {
      message: "Name can contain only letters and spaces",
    }),
  image: z
    .union([
      z.string().min(1, { message: "Image is required!" }),
      z
        .instanceof(File, { message: "Logo is required!" })
        .refine((f) => f.size <= MAX_FILE_SIZE, {
          message: "Logo must be less than 5MB!",
        })
        .refine(
          (f) => ["image/jpeg", "image/png", "image/gif"].includes(f.type),
          { message: "Logo must be a .jpg, .jpeg, .gif, or .png file!" },
        ),
    ])
    .nullable()
    .optional(),

  phone: z.string().min(1, { message: "Enter a valid phone number!" }),
  address: z.string().min(1, { message: "Enter a valid address!" }),
  city: z.string().min(1, { message: "Enter a valid city!" }),
  state: z.string().min(1, { message: "Enter a valid state!" }),
  zip: z.string().min(1, { message: "Enter a valid zip code!" }),
  postalCode: nullableString(
    z.string().min(1, { message: "Enter a valid postal code!" }),
  ),
  country: z.string().min(1, { message: "Enter a valid country!" }),
  departmentId: z
    .number({ message: "Select a valid department!" })
    .min(1, { message: "Select a department!" }),
  status: z.boolean({
    message: "Status is required!",
  }),
});

export type EmployeeSchemaType = z.infer<typeof employeeSchema>;
