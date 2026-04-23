import { z } from "zod";

export const purchasePaymentSchema = z.object({
  accountId: z.number().int().positive().optional(),
  purchaseId: z.number().int().positive().optional(),
  amount: z
    .string({
      message: "Amount is required!",
    })
    .refine((val) => !isNaN(Number(val)), {
      message: "Amount must be a valid number",
    })
    .refine((val) => /^\d+(\.\d{1,2})?$/.test(val), {
      message: "Only 2 decimal places allowed",
    }),
  change: z
    .string()
    .refine((val) => !isNaN(Number(val)), {
      message: "Change must be a valid number",
    })
    .refine((val) => /^\d+(\.\d{1,2})?$/.test(val), {
      message: "Only 2 decimal places allowed",
    })
    .optional(),
  paymentMethod: z.enum(["CASH", "CHEQUE", "BANK"], {
    message: "Please select a payment method!",
  }),
  paymentNote: z.string().max(255).nullable().optional(),
});

export type PurchasePaymentSchemaType = z.infer<typeof purchasePaymentSchema>;
