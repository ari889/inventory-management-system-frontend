import { z } from "zod";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

export const purchaseStatusEnum = z.enum(
  ["PENDING", "ORDERED", "RECEIVED", "PARTIAL", "CANCELLED"],
  "Select a valid purchase status!",
);

export const purchaseProductSchema = z.object({
  taxId: z.number({ message: "Select a tax!" }).int().positive().nullable(),
  unitId: z.number({ message: "Select a unit!" }).int().positive(),
  unitCost: z
    .string({ message: "Unit Cost is required!" })
    .refine((val) => !isNaN(Number(val)), {
      message: "Unit Cost must be a valid number",
    })
    .refine((val) => Number(val) >= 0, {
      message: "Unit Cost must be a non-negative number",
    })
    .refine((val) => /^\d+(\.\d{1,2})?$/.test(val), {
      message: "Unit Cost can have at most 2 decimal places",
    }),
  quantity: z
    .number({ message: "Quantity is required!" })
    .int("Must be an integer")
    .positive("Must be greater than 0"),
  discount: z
    .string({ message: "Discount is required!" })
    .refine((val) => !isNaN(Number(val)), {
      message: "Discount must be a valid number",
    })
    .refine((val) => Number(val) >= 0, {
      message: "Discount must be a non-negative number",
    })
    .refine((val) => /^\d+(\.\d{1,2})?$/.test(val), {
      message: "Discount can have at most 2 decimal places",
    }),
});

export type PurchaseProductSchemaType = z.infer<typeof purchaseProductSchema>;

export const purchaseSchema = z.object({
  supplierId: z.number({ message: "Select a supplier!" }).int().positive(),

  warehouseId: z.number({ message: "Select a warehouse!" }).int().positive(),

  taxId: z.number().int().positive().nullable(),
  orderTaxRate: z
    .string({
      message: "Order Tax Rate is required!",
    })
    .refine((val) => !isNaN(Number(val)), {
      message: "Order Tax Rate must be a valid number",
    })
    .refine((val) => /^\d+(\.\d{1,2})?$/.test(val), {
      message: "Only 2 decimal places allowed",
    }),

  orderDiscount: z
    .string({
      message: "Order Discount is required!",
    })
    .refine((val) => !isNaN(Number(val)), {
      message: "Order Discount must be a valid number",
    })
    .refine((val) => /^\d+(\.\d{1,2})?$/.test(val), {
      message: "Only 2 decimal places allowed",
    })
    .optional()
    .nullable(),

  shippingCost: z
    .string({
      message: "Shipping Cost is required!",
    })
    .refine((val) => !isNaN(Number(val)), {
      message: "Shipping Cost must be a valid number",
    })
    .refine((val) => /^\d+(\.\d{1,2})?$/.test(val), {
      message: "Only 2 decimal places allowed",
    })
    .optional()
    .nullable(),

  purchaseStatus: purchaseStatusEnum,

  document: z
    .union([
      z.string().min(1, { message: "Document is required!" }),
      z
        .instanceof(File, { message: "Document is required!" })
        .refine((f) => f.size <= MAX_FILE_SIZE, {
          message: "Document must be less than 2MB!",
        })
        .refine(
          (f) => ["image/jpeg", "image/png", "image/gif"].includes(f.type),
          { message: "Document must be a .jpg, .jpeg, .gif, or .png file!" },
        ),
    ])
    .optional()
    .nullable(),

  note: z.string().optional().nullable(),
});

export type PurchaseSchemaType = z.infer<typeof purchaseSchema>;
