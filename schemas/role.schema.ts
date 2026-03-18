import z from "zod";

export const createRoleSchema = z.object({
  roleName: z.string().min(1, { message: "Enter a valid role name!" }),
  deletable: z.boolean().optional(),
});

export type CreateRoleSchemaType = z.infer<typeof createRoleSchema>;

export const updateRoleSchema = createRoleSchema.extend({
  moduleIds: z.array(z.number()),
  permissionIds: z.array(z.number()),
});

export type UpdateRoleSchemaType = z.infer<typeof updateRoleSchema>;
