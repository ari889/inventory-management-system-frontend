import * as z from "zod";

export const attendanceSchema = z.object({
  employeeId: z.number({ message: "Select a valid employee!" }).optional(),

  date: z.date({ message: "Select a valid date!" }),

  checkIn: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/, {
    message: "Enter a valid check-in time!",
  }),

  checkOut: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/, {
      message: "Enter a valid check-out time!",
    })
    .nullable()
    .optional(),

  status: z.boolean({
    message: "Status is required!",
  }),
});

export type AttendanceSchemaType = z.infer<typeof attendanceSchema>;
