import { z } from "zod";

export const printBarcodeSchema = z.object({
  productId: z.number({
    message: "Select a product before print barcode!",
  }),

  noOfBarcode: z
    .number({ message: "Number of barcode is required" })
    .int("Must be an integer")
    .positive("Must be greater than 0"),

  qtyEachRow: z
    .number({ message: "Quantity per row is required" })
    .int("Must be an integer")
    .positive("Must be greater than 0"),

  productName: z.boolean(),

  price: z.boolean(),

  width: z
    .number({ message: "Width is required" })
    .nonnegative("Width must be 0 or greater"),

  height: z
    .number({ message: "Height is required" })
    .nonnegative("Height must be 0 or greater"),
});

export type PrintBarcodeSchemaType = z.infer<typeof printBarcodeSchema>;
