import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";

extendZodWithOpenApi(z);

// ============================================================
// Base Schema
// ============================================================

export const UserSchema = z
  .object({
    id: z.string().cuid().openapi({ example: "clx1a2b3c4d5e6f7g8h9i0j" }),
    email: z.string().email().openapi({ example: "jane@example.com" }),
    name: z.string().min(1).openapi({ example: "Jane Doe" }),
    role: z.enum(["ADMIN", "USER"]).default("USER").openapi({ example: "USER" }),
    isActive: z.boolean().default(true).openapi({ example: true }),
    emailVerified: z.boolean().default(false).openapi({ example: false }),
    avatar: z
      .string()
      .url()
      .nullable()
      .optional()
      .openapi({ example: "https://cdn.example.com/avatar.png" }),
    createdAt: z.date().openapi({ example: "2024-01-15T10:00:00.000Z" }),
    updatedAt: z.date().openapi({ example: "2024-06-01T12:30:00.000Z" }),
  })
  .openapi("User");

export type User = z.infer<typeof UserSchema>;

// ============================================================
// Request Schemas
// ============================================================

export const RegisterUserSchema = z
  .object({
    email: z.string().email({ message: "Invalid email" }).openapi({ example: "jane@example.com" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .openapi({ example: "s3cur3P@ss" }),
    name: z.string().min(1, { message: "Name is required" }).openapi({ example: "Jane Doe" }),
  })
  .openapi("RegisterUserInput");

export const UpdateUserSchema = z
  .object({
    name: z.string().min(1).optional().openapi({ example: "Jane Smith" }),
    avatar: z.string().url().optional().openapi({ example: "https://cdn.example.com/avatar.png" }),
  })
  .openapi("UpdateUserInput");

export const UserParamsSchema = z.object({
  id: z.string().min(1, "User ID is required").openapi({ example: "clx1a2b3c4d5e6f7g8h9i0j" }),
});

// ============================================================
// Response Schemas (strip sensitive fields)
// ============================================================

export const UserResponseSchema = UserSchema.omit({});

export type RegisterUserInput = z.infer<typeof RegisterUserSchema>;
export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;