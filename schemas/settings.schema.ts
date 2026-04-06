import z from "zod";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

export const settingsSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Enter a valid site title!" })
    .regex(/^[a-zA-Z ]+$/, {
      message: "Title must contain only letters and spaces!",
    }),
  address: z.string().nullable(),
  currency_code: z
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
  logo: z.union([
    z.string().min(1, { message: "Logo is required!" }),
    z
      .instanceof(File, { message: "Logo is required!" })
      .refine((f) => f.size <= MAX_FILE_SIZE, {
        message: "Logo must be less than 2MB!",
      })
      .refine(
        (f) => ["image/jpeg", "image/png", "image/gif"].includes(f.type),
        { message: "Logo must be a .jpg, .jpeg, .gif, or .png file!" },
      ),
  ]),

  favicon: z.union([
    z.string().min(1, { message: "Favicon is required!" }),
    z
      .instanceof(File, { message: "Favicon is required!" })
      .refine((f) => f.size <= MAX_FILE_SIZE, {
        message: "Favicon must be less than 2MB!",
      })
      .refine(
        (f) =>
          [
            "image/jpeg",
            "image/png",
            "image/gif",
            "image/x-icon",
            "image/vnd.microsoft.icon",
          ].includes(f.type),
        { message: "Favicon must be a .jpg, .jpeg, .gif, .ico, or .png file!" },
      ),
  ]),
  currency_symbol: z
    .string()
    .min(1, { message: "Currency symbol is required!" }),
  currency_position: z.enum(["prefix", "postfix"] as const, {
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
  date_format: z
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
  invoice_suffix: z
    .string()
    .min(1, { message: "Invoice suffix is required!" })
    .regex(/^[A-Z-]+$/, {
      message:
        "Invoice suffix must contain only uppercase letters (A-Z) and hyphens (-)!",
    }),
  invoice_number: z
    .number({ message: "Invoice number must be a number!" })
    .int({ message: "Invoice number must be an integer!" })
    .min(1, { message: "Invoice number must be greater than 0!" })
    .refine((val) => String(val).padStart(4, "0").length >= 4, {
      message:
        "Invoice number must be represented as at least 4 digits (e.g. 0001)!",
    }),
});

export type SettingsSchemaType = z.infer<typeof settingsSchema>;
