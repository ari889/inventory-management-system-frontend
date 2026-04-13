import * as z from "zod";

export const payrollSchema = z.object({
  employeeId: z.number({
    message: "Select a employee before saving!",
  }),

  accountId: z.number({
    message: "Account is required!",
  }),

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

  paymentMethods: z.enum(["CASH", "CHEQUE", "BANK"], {
    message: "Payment method is required!",
  }),
});

export type PayrollSchemaType = z.input<typeof payrollSchema>;
