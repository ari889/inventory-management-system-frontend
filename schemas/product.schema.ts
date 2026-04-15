import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const productSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(255, "Name is too long")
    .regex(
      /^[a-zA-Z0-9 ]+$/,
      "Name can only contain letters, numbers and spaces",
    ),

  code: z.string().min(1, "Code is required").max(100, "Code is too long"),

  barcodeSymbology: z
    .string()
    .min(1, "Barcode symbology is required")
    .max(50, "Barcode symbology is too long"),

  image: z
    .union([
      z.string().min(1, { message: "Image is required!" }),
      z
        .instanceof(File, { message: "Image is required!" })
        .refine((f) => f.size <= MAX_FILE_SIZE, {
          message: "Image must be less than 2MB!",
        })
        .refine(
          (f) => ["image/jpeg", "image/png", "image/gif"].includes(f.type),
          { message: "Image must be a .jpg, .jpeg, .gif, or .png file!" },
        ),
    ])
    .optional(),

  brandId: z
    .number()
    .int()
    .positive("Brand ID must be a positive integer")
    .optional()
    .nullable(),

  categoryId: z
    .number("Select a category!")
    .int()
    .positive("Category ID must be a positive integer"),

  unitId: z
    .number("Select a unit!")
    .int()
    .positive("Unit ID must be a positive integer"),

  purchaseUnitId: z
    .number("Select a purchase unit!")
    .int()
    .positive("Purchase unit ID must be a positive integer"),

  saleUnitId: z
    .number("Select a sale unit!")
    .int()
    .positive("Sale unit ID must be a positive integer"),

  cost: z
    .string({ message: "Cost is required!" })
    .refine((val) => !isNaN(Number(val)), {
      message: "Cost must be a valid number",
    })
    .refine((val) => Number(val) >= 0, {
      message: "Cost must be a non-negative number",
    })
    .refine((val) => /^\d+(\.\d{1,2})?$/.test(val), {
      message: "Cost can have at most 2 decimal places",
    }),

  price: z
    .string({ message: "Price is required!" })
    .refine((val) => !isNaN(Number(val)), {
      message: "Price must be a valid number",
    })
    .refine((val) => Number(val) >= 0, {
      message: "Price must be a non-negative number",
    })
    .refine((val) => /^\d+(\.\d{1,2})?$/.test(val), {
      message: "Price can have at most 2 decimal places",
    }),

  qty: z
    .number()
    .int()
    .nonnegative("Quantity must be a non-negative integer")
    .optional()
    .nullable(),

  alertQty: z
    .number()
    .int()
    .nonnegative("Alert quantity must be a non-negative integer")
    .optional()
    .nullable(),

  taxId: z
    .number()
    .int()
    .positive("Tax ID must be a positive integer")
    .optional()
    .nullable(),

  taxMethod: z.boolean("Select a tax method!").optional().nullable(),

  description: z
    .string()
    .max(1000, "Description is too long")
    .optional()
    .nullable(),

  status: z.boolean({}),
});

export type ProductSchemaType = z.infer<typeof productSchema>;
