import { z } from "zod";

const MAX_FILE_SIZE = 2 * 1024 * 1024;

export const paymentStatus = z.enum(
  ["PAID", "PARTIAL", "DUE"],
  "Select a valid payment status!",
);

export const saleProductSchema = z.object({
  taxId: z.number({ message: "Select a tax!" }).int().positive().nullable(),
  unitId: z.number({ message: "Select a unit!" }).int().positive(),
  unitPrice: z
    .string({ message: "Unit price is required!" })
    .refine((val) => !isNaN(Number(val)), {
      message: "Unit price must be a valid number",
    })
    .refine((val) => Number(val) >= 0, {
      message: "Unit price must be a non-negative number",
    })
    .refine((val) => /^\d+(\.\d{1,2})?$/.test(val), {
      message: "Unit price can have at most 2 decimal places",
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

export type SaleProductSchemaType = z.infer<typeof saleProductSchema>;

const baseSaleSchema = z.object({
  customerId: z.number({ message: "Select a customer!" }).int().positive(),

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

  saleStatus: z.boolean({
    message: "Please select a sale status!",
  }),

  paymentStatus: paymentStatus.optional(),

  accountId: z.number().int().positive().nullable().optional(),

  amount: z.string().optional().nullable(),

  change: z.string().optional().nullable(),

  paymentMethod: z.enum(["CASH", "CHEQUE", "MOBILE"]).optional().nullable(),

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
          {
            message: "Document must be a .jpg, .jpeg, .gif, or .png file!",
          },
        ),
    ])
    .optional()
    .nullable(),

  note: z.string().optional().nullable(),
});

export const saleCreateSchema = baseSaleSchema.superRefine((data, ctx) => {
  if (data.saleStatus && !data.paymentStatus) {
    ctx.addIssue({
      code: "custom",
      path: ["paymentStatus"],
      message: "Payment status is required!",
    });
  }

  if (data.paymentStatus === "PAID" || data.paymentStatus === "PARTIAL") {
    if (!data.accountId) {
      ctx.addIssue({
        code: "custom",
        path: ["accountId"],
        message: "Account is required!",
      });
    }

    if (!data.amount) {
      ctx.addIssue({
        code: "custom",
        path: ["amount"],
        message: "Amount is required!",
      });
    }

    if (!data.paymentMethod) {
      ctx.addIssue({
        code: "custom",
        path: ["paymentMethod"],
        message: "Payment method is required!",
      });
    }
  }
});

export const saleUpdateSchema = baseSaleSchema.superRefine((data, ctx) => {
  if (data.saleStatus && !data.paymentStatus) {
    ctx.addIssue({
      code: "custom",
      path: ["paymentStatus"],
      message: "Payment status is required!",
    });
  }
});

export type SaleCreateSchemaType = z.infer<typeof saleCreateSchema>;

export type SaleUpdateSchemaType = z.infer<typeof saleUpdateSchema>;
