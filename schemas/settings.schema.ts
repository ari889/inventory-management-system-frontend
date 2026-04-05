import z from "zod";

export const settingsSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Enter a valid site title!" })
    .regex(/^[a-zA-Z ]+$/, {
      message: "Title must contain only letters and spaces!",
    }),
  address: z.string().nullable(),
  currencyCode: z
    .string()
    .min(1, { message: "Currency code is required!" })
    .refine(
      (val) => {
        try {
          new Intl.NumberFormat("en", { style: "currency", currency: val });
          return true;
        } catch {
          return false;
        }
      },
      { message: "Must be a valid ISO 4217 currency code (e.g. USD, EUR)!" },
    ),
  logo: z
    .instanceof(File, { message: "Select a valid logo for your site!" })
    .refine((file) => /\.(jpg|jpeg|gif|png)$/i.test(file.name), {
      message: "Logo must be a .jpg, .jpeg, .gif, or .png file!",
    })
    .refine(
      (file) => ["image/jpeg", "image/gif", "image/png"].includes(file.type),
      { message: "Logo must be a valid image file!" },
    ),
  favicon: z
    .instanceof(File, { message: "Select a valid favicon for your site!" })
    .refine((file) => /\.(jpg|jpeg|gif|ico|png)$/i.test(file.name), {
      message: "Favicon must be a .jpg, .jpeg, .gif, .ico, or .png file!",
    })
    .refine(
      (file) =>
        [
          "image/jpeg",
          "image/gif",
          "image/png",
          "image/x-icon",
          "image/vnd.microsoft.icon",
        ].includes(file.type),
      { message: "Favicon must be a valid image file!" },
    ),
  currencySymbol: z
    .string()
    .min(1, { message: "Currency symbol is required!" }),
  currencyPosition: z.enum(["prefix", "postfix"] as const, {
    message: "Currency position must be 'prefix' or 'postfix'!",
  }),
  timezone: z
    .string()
    .min(1, { message: "Timezone is required!" })
    .refine(
      (val) => {
        try {
          Intl.DateTimeFormat(undefined, { timeZone: val });
          return true;
        } catch {
          return false;
        }
      },
      { message: "Must be a valid IANA timezone (e.g. America/New_York)!" },
    ),
  dateFormat: z
    .string()
    .min(1, { message: "Date format is required!" })
    .refine(
      (val) => {
        const validPatterns = [
          "MM/DD/YYYY",
          "DD/MM/YYYY",
          "YYYY-MM-DD",
          "DD-MM-YYYY",
          "MM-DD-YYYY",
          "YYYY/MM/DD",
          "DD.MM.YYYY",
          "MMMM DD, YYYY",
          "MMM DD, YYYY",
          "DD MMMM YYYY",
        ];
        return validPatterns.includes(val);
      },
      { message: "Must be a valid date format (e.g. MM/DD/YYYY, YYYY-MM-DD)!" },
    ),
  invoicePrefix: z
    .string()
    .min(1, { message: "Invoice prefix is required!" })
    .regex(/^[A-Z-]+$/, {
      message:
        "Invoice prefix must contain only uppercase letters (A-Z) and hyphens (-)!",
    }),
  invoiceNumber: z
    .number({ message: "Invoice number must be a number!" })
    .int({ message: "Invoice number must be an integer!" })
    .min(1, { message: "Invoice number must be greater than 0!" })
    .refine((val) => String(val).padStart(4, "0").length >= 4, {
      message:
        "Invoice number must be represented as at least 4 digits (e.g. 0001)!",
    }),
});

export type SettingsSchemaType = z.infer<typeof settingsSchema>;
