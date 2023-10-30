import { z } from "zod";
import zodToJsonSchema from "zod-to-json-schema";

// CreateUser schemas
const createUserBodySchema = z.object({
  email: z.string().email(),
  name: z.string(),
  applicationId: z.string().uuid(),
  password: z.string().min(6),
  initialUser: z.boolean().optional(),
});

export type CreateUserBody = z.infer<typeof createUserBodySchema>;

export const createUserJsonSchema = {
  body: zodToJsonSchema(createUserBodySchema, "createUserBodySchema"),
};

// Login Schemas

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  applicationId: z.string(),
});

export type LoginBody = z.infer<typeof loginSchema>;

export const loginBodyJsonSchema = {
  body: zodToJsonSchema(loginSchema, "loginSchema"),
};

// Assign role to user schemas

const assignRoleToUserSchema = z.object({
  userId: z.string().uuid(),
  roleId: z.string().uuid(),
});

export type AssignRoleToUserBody = z.infer<typeof assignRoleToUserSchema>;

export const assignRoleToUserBodyJsonSchema = {
  body: zodToJsonSchema(
    assignRoleToUserSchema,
    "assignRoleToUserBodyJsonSchema"
  ),
};
