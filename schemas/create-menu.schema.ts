import z from "zod";

export const createMenuSchema = z.object({
  menuName: z.string().min(1, { message: "Enter a valid menu name!" }),
  deletable: z.boolean().optional(),
});

export type CreateMenuSchemaType = z.infer<typeof createMenuSchema>;
