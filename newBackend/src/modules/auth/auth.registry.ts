import { OpenApiGeneratorV3, OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import {
  RegisterSchema,
  LoginSchema,
  RefreshTokenSchema,
  ForgotPasswordSchema,
  ResetPasswordSchema,
  VerifyEmailSchema,
  ChangePasswordSchema,
  AuthUserSchema,
  TokenPairSchema,
  AuthResponseSchema,
  MessageResponseSchema,
} from "./auth.schema";

// ============================================================
// Registry
// ============================================================

export const authRegistry = new OpenAPIRegistry();

// Register named schemas → #/components/schemas
authRegistry.register("RegisterInput", RegisterSchema);
authRegistry.register("LoginInput", LoginSchema);
authRegistry.register("RefreshTokenInput", RefreshTokenSchema);
authRegistry.register("ForgotPasswordInput", ForgotPasswordSchema);
authRegistry.register("ResetPasswordInput", ResetPasswordSchema);
authRegistry.register("VerifyEmailInput", VerifyEmailSchema);
authRegistry.register("ChangePasswordInput", ChangePasswordSchema);
authRegistry.register("AuthUser", AuthUserSchema);
authRegistry.register("TokenPair", TokenPairSchema);
authRegistry.register("AuthResponse", AuthResponseSchema);
authRegistry.register("MessageResponse", MessageResponseSchema);

// Register Bearer security scheme
const bearerAuth = authRegistry.registerComponent("securitySchemes", "bearerAuth", {
  type: "http",
  scheme: "bearer",
  bearerFormat: "JWT",
});

// ============================================================
// POST /auth/register
// ============================================================

authRegistry.registerPath({
  method: "post",
  path: "/auth/register",
  summary: "Register a new user",
  description: "Creates a new user account and sends a verification email.",
  tags: ["Auth"],
  request: {
    body: {
      required: true,
      content: {
        "application/json": { schema: RegisterSchema },
      },
    },
  },
  responses: {
    201: {
      description: "User registered successfully. Verification email sent.",
      content: {
        "application/json": { schema: AuthResponseSchema },
      },
    },
    409: {
      description: "Email already in use",
      content: {
        "application/json": { schema: MessageResponseSchema },
      },
    },
    422: {
      description: "Validation error",
      content: {
        "application/json": { schema: MessageResponseSchema },
      },
    },
  },
});

// ============================================================
// POST /auth/login
// ============================================================

authRegistry.registerPath({
  method: "post",
  path: "/auth/login",
  summary: "Login",
  description: "Authenticates a user and returns an access token + refresh token.",
  tags: ["Auth"],
  request: {
    body: {
      required: true,
      content: {
        "application/json": { schema: LoginSchema },
      },
    },
  },
  responses: {
    200: {
      description: "Login successful",
      content: {
        "application/json": { schema: AuthResponseSchema },
      },
    },
    401: {
      description: "Invalid credentials",
      content: {
        "application/json": { schema: MessageResponseSchema },
      },
    },
    403: {
      description: "Account is inactive or not verified",
      content: {
        "application/json": { schema: MessageResponseSchema },
      },
    },
  },
});

// ============================================================
// POST /auth/logout
// ============================================================

authRegistry.registerPath({
  method: "post",
  path: "/auth/logout",
  summary: "Logout",
  description: "Revokes the refresh token for the current user.",
  tags: ["Auth"],
  security: [{ [bearerAuth.name]: [] }],
  responses: {
    200: {
      description: "Logged out successfully",
      content: {
        "application/json": { schema: MessageResponseSchema },
      },
    },
    401: {
      description: "Unauthorized",
      content: {
        "application/json": { schema: MessageResponseSchema },
      },
    },
  },
});

// ============================================================
// POST /auth/refresh
// ============================================================

authRegistry.registerPath({
  method: "post",
  path: "/auth/refresh",
  summary: "Refresh access token",
  description: "Issues a new access token using a valid refresh token.",
  tags: ["Auth"],
  request: {
    body: {
      required: true,
      content: {
        "application/json": { schema: RefreshTokenSchema },
      },
    },
  },
  responses: {
    200: {
      description: "Token refreshed successfully",
      content: {
        "application/json": { schema: TokenPairSchema },
      },
    },
    401: {
      description: "Invalid or expired refresh token",
      content: {
        "application/json": { schema: MessageResponseSchema },
      },
    },
  },
});

// ============================================================
// GET /auth/me
// ============================================================

authRegistry.registerPath({
  method: "get",
  path: "/auth/me",
  summary: "Get current user",
  description: "Returns the authenticated user's profile.",
  tags: ["Auth"],
  security: [{ [bearerAuth.name]: [] }],
  responses: {
    200: {
      description: "Current user profile",
      content: {
        "application/json": { schema: AuthUserSchema },
      },
    },
    401: {
      description: "Unauthorized",
      content: {
        "application/json": { schema: MessageResponseSchema },
      },
    },
  },
});

// ============================================================
// POST /auth/verify-email
// ============================================================

authRegistry.registerPath({
  method: "post",
  path: "/auth/verify-email",
  summary: "Verify email address",
  description: "Marks the user's email as verified using the token sent by email.",
  tags: ["Auth"],
  request: {
    body: {
      required: true,
      content: {
        "application/json": { schema: VerifyEmailSchema },
      },
    },
  },
  responses: {
    200: {
      description: "Email verified successfully",
      content: {
        "application/json": { schema: MessageResponseSchema },
      },
    },
    400: {
      description: "Invalid or expired verification token",
      content: {
        "application/json": { schema: MessageResponseSchema },
      },
    },
  },
});

// ============================================================
// POST /auth/forgot-password
// ============================================================

authRegistry.registerPath({
  method: "post",
  path: "/auth/forgot-password",
  summary: "Request password reset",
  description:
    "Sends a password reset email. Always returns 200 to prevent email enumeration.",
  tags: ["Auth"],
  request: {
    body: {
      required: true,
      content: {
        "application/json": { schema: ForgotPasswordSchema },
      },
    },
  },
  responses: {
    200: {
      description: "Reset email sent (if the address is registered)",
      content: {
        "application/json": { schema: MessageResponseSchema },
      },
    },
  },
});

// ============================================================
// POST /auth/reset-password
// ============================================================

authRegistry.registerPath({
  method: "post",
  path: "/auth/reset-password",
  summary: "Reset password",
  description: "Sets a new password using the token from the reset email.",
  tags: ["Auth"],
  request: {
    body: {
      required: true,
      content: {
        "application/json": { schema: ResetPasswordSchema },
      },
    },
  },
  responses: {
    200: {
      description: "Password reset successfully",
      content: {
        "application/json": { schema: MessageResponseSchema },
      },
    },
    400: {
      description: "Invalid or expired reset token",
      content: {
        "application/json": { schema: MessageResponseSchema },
      },
    },
  },
});

// ============================================================
// POST /auth/change-password
// ============================================================

authRegistry.registerPath({
  method: "post",
  path: "/auth/change-password",
  summary: "Change password",
  description: "Allows an authenticated user to change their current password.",
  tags: ["Auth"],
  security: [{ [bearerAuth.name]: [] }],
  request: {
    body: {
      required: true,
      content: {
        "application/json": { schema: ChangePasswordSchema },
      },
    },
  },
  responses: {
    200: {
      description: "Password changed successfully",
      content: {
        "application/json": { schema: MessageResponseSchema },
      },
    },
    400: {
      description: "Current password is incorrect",
      content: {
        "application/json": { schema: MessageResponseSchema },
      },
    },
    401: {
      description: "Unauthorized",
      content: {
        "application/json": { schema: MessageResponseSchema },
      },
    },
  },
});

// ============================================================
// Generator
// ============================================================

export function generateAuthOpenApiSpec() {
  const generator = new OpenApiGeneratorV3(authRegistry.definitions);

  return generator.generateDocument({
    openapi: "3.0.0",
    info: {
      title: "Auth Service API",
      version: "1.0.0",
      description: "Handles registration, login, token management, and password operations.",
    },
    servers: [
      { url: "https://api.example.com/v1", description: "Production" },
      { url: "http://localhost:3000/v1", description: "Local development" },
    ],
  });
}
