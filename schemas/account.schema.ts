import * as z from "zod";

export const accountSchema = z.object({
  accountNo: z
    .string()
    .min(1, { message: "Account number is required" })
    .max(50, { message: "Account number too long" })
    .regex(/^[A-Za-z0-9\-_/]+$/, {
      message: "Invalid account number format",
    }),

  name: z
    .string()
    .min(1, { message: "Account name is required" })
    .max(100, { message: "Name too long" })
    .regex(/^[A-Za-z0-9\s]+$/, {
      message: "Name can contain only letters, numbers, and spaces",
    }),

  initialBalance: z
    .number({ message: "Initial balance is required!" })
    .refine((val) => !isNaN(Number(val)), {
      message: "Initial balance must be a valid number",
    })
    .transform((val) => Number(val)),

  note: z
    .string()
    .max(255, { message: "Max 255 characters!" })
    .optional()
    .nullable(),
  status: z.boolean({ message: "Status is required!" }),
});

export type AccountSchemaType = z.infer<typeof accountSchema>;
