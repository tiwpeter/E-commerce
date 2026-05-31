import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";

extendZodWithOpenApi(z);

// ============================================================
// Enums (mirrored from Prisma)
// ============================================================

export const RoleSchema = z.enum(["ADMIN", "USER"]).openapi("Role");

// ============================================================
// Request Schemas
// ============================================================

export const RegisterSchema = z
  .object({
    email: z.string().email("Invalid email address").openapi({ example: "user@example.com" }),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(72, "Password too long")
      .openapi({ example: "P@ssw0rd123" }),
    name: z.string().min(1, "Name is required").max(100).openapi({ example: "John Doe" }),
  })
  .openapi("RegisterInput");

export const LoginSchema = z
  .object({
    email: z.string().email().openapi({ example: "user@example.com" }),
    password: z.string().min(1, "Password is required").openapi({ example: "P@ssw0rd123" }),
  })
  .openapi("LoginInput");

export const RefreshTokenSchema = z
  .object({
    refreshToken: z
      .string()
      .min(1, "Refresh token is required")
      .openapi({ example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }),
  })
  .openapi("RefreshTokenInput");

export const ForgotPasswordSchema = z
  .object({
    email: z.string().email().openapi({ example: "user@example.com" }),
  })
  .openapi("ForgotPasswordInput");

export const ResetPasswordSchema = z
  .object({
    token: z.string().min(1, "Reset token is required").openapi({ example: "reset-token-abc123" }),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(72)
      .openapi({ example: "NewP@ssw0rd456" }),
  })
  .openapi("ResetPasswordInput");

export const VerifyEmailSchema = z
  .object({
    token: z
      .string()
      .min(1, "Verification token is required")
      .openapi({ example: "verify-token-xyz789" }),
  })
  .openapi("VerifyEmailInput");

export const ChangePasswordSchema = z
  .object({
    currentPassword: z.string().min(1).openapi({ example: "OldP@ssw0rd123" }),
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters")
      .max(72)
      .openapi({ example: "NewP@ssw0rd456" }),
  })
  .openapi("ChangePasswordInput");

// ============================================================
// Response Schemas
// ============================================================

export const AuthUserSchema = z
  .object({
    id: z.string().openapi({ example: "clx1a2b3c4d5e6f7g8h9i0j" }),
    email: z.string().email().openapi({ example: "user@example.com" }),
    name: z.string().openapi({ example: "John Doe" }),
    role: RoleSchema,
    avatar: z.string().nullable().openapi({ example: "https://cdn.example.com/avatars/u1.jpg" }),
    emailVerified: z.boolean().openapi({ example: false }),
    isActive: z.boolean().openapi({ example: true }),
    createdAt: z.date().openapi({ example: "2024-06-01T08:00:00.000Z" }),
  })
  .openapi("AuthUser");

export const TokenPairSchema = z
  .object({
    accessToken: z.string().openapi({ example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }),
    refreshToken: z.string().openapi({ example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }),
    expiresIn: z.number().int().openapi({ example: 900, description: "Seconds until access token expires" }),
  })
  .openapi("TokenPair");

export const AuthResponseSchema = z
  .object({
    user: AuthUserSchema,
    tokens: TokenPairSchema,
  })
  .openapi("AuthResponse");

export const MessageResponseSchema = z
  .object({
    message: z.string().openapi({ example: "Operation completed successfully" }),
  })
  .openapi("MessageResponse");

// ============================================================
// Types
// ============================================================

export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type RefreshTokenInput = z.infer<typeof RefreshTokenSchema>;
export type ForgotPasswordInput = z.infer<typeof ForgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof ResetPasswordSchema>;
export type VerifyEmailInput = z.infer<typeof VerifyEmailSchema>;
export type ChangePasswordInput = z.infer<typeof ChangePasswordSchema>;
export type AuthUser = z.infer<typeof AuthUserSchema>;
export type TokenPair = z.infer<typeof TokenPairSchema>;
export type AuthResponse = z.infer<typeof AuthResponseSchema>;
