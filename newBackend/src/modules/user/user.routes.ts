import { Router, type Request, type Response, type NextFunction } from "express";
import { z } from "zod";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { UserService, UserNotFoundError, UserConflictError } from "./user.service";
import {
  UserSchema,
  RegisterUserSchema,
  UpdateUserSchema,
  UserParamsSchema,
} from "./user.schema";

// ============================================================
// Registry (exported so app.ts can collect all registries)
// ============================================================

export const userRegistry = new OpenAPIRegistry();

// ── Register schemas (makes them available as $ref) ──────────

userRegistry.register("User", UserSchema);
userRegistry.register("RegisterUserInput", RegisterUserSchema);
userRegistry.register("UpdateUserInput", UpdateUserSchema);

// ── Shared response schemas ───────────────────────────────────

const ErrorResponseSchema = z.object({
  success: z.literal(false),
  error: z.string(),
});

const ValidationErrorSchema = z.object({
  success: z.literal(false),
  error: z.literal("Validation failed"),
  details: z.object({
    formErrors: z.array(z.string()),
    fieldErrors: z.record(z.array(z.string())),
  }),
});

// ============================================================
// Zod validation middleware helper
// ============================================================

function validate<T extends z.ZodTypeAny>(
  schema: T,
  source: "body" | "params" | "query" = "body"
) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      res.status(400).json({
        success: false,
        error: "Validation failed",
        details: result.error.flatten(),
      });
      return;
    }
    req[source] = result.data;
    next();
  };
}

// ============================================================
// Router factory
// ============================================================

export function createUserRouter(service: UserService = new UserService()): Router {
  const router = Router();

  // ----------------------------------------------------------
  // GET /users — List all users
  // ----------------------------------------------------------

  userRegistry.registerPath({
    method: "get",
    path: "/users",
    tags: ["Users"],
    summary: "List all users",
    description: "Returns every registered user. Intended for admin use only.",
    operationId: "listUsers",
    responses: {
      200: {
        description: "Array of users",
        content: {
          "application/json": {
            schema: z.object({ success: z.literal(true), data: z.array(UserSchema) }),
          },
        },
      },
      500: {
        description: "Unexpected server error",
        content: { "application/json": { schema: ErrorResponseSchema } },
      },
    },
  });

  router.get("/", async (_req, res, next) => {
    try {
      const users = await service.getUsers();
      res.json({ success: true, data: users });
    } catch (err) {
      next(err);
    }
  });

  // ----------------------------------------------------------
  // GET /users/:id — Get user by ID
  // ----------------------------------------------------------

  userRegistry.registerPath({
    method: "get",
    path: "/users/{id}",
    tags: ["Users"],
    summary: "Get user by ID",
    operationId: "getUserById",
    request: {
      params: UserParamsSchema,
    },
    responses: {
      200: {
        description: "User found",
        content: {
          "application/json": {
            schema: z.object({ success: z.literal(true), data: UserSchema }),
          },
        },
      },
      404: {
        description: "User not found",
        content: { "application/json": { schema: ErrorResponseSchema } },
      },
      500: {
        description: "Unexpected server error",
        content: { "application/json": { schema: ErrorResponseSchema } },
      },
    },
  });

  router.get("/:id", validate(UserParamsSchema, "params"), async (req, res, next) => {
    try {
      const user = await service.getUserById(req.params.id);
      res.json({ success: true, data: user });
    } catch (err) {
      next(err);
    }
  });

  // ----------------------------------------------------------
  // POST /users/register — Register new user
  // ----------------------------------------------------------

  userRegistry.registerPath({
    method: "post",
    path: "/users/register",
    tags: ["Users"],
    summary: "Register a new user",
    description:
      "Creates a new user account. Returns the created user without the password field.",
    operationId: "registerUser",
    request: {
      body: {
        required: true,
        content: { "application/json": { schema: RegisterUserSchema } },
      },
    },
    responses: {
      201: {
        description: "User created successfully",
        content: {
          "application/json": {
            schema: z.object({ success: z.literal(true), data: UserSchema }),
          },
        },
      },
      400: {
        description: "Validation error",
        content: { "application/json": { schema: ValidationErrorSchema } },
      },
      409: {
        description: "Email already exists",
        content: { "application/json": { schema: ErrorResponseSchema } },
      },
      500: {
        description: "Unexpected server error",
        content: { "application/json": { schema: ErrorResponseSchema } },
      },
    },
  });

  router.post("/register", validate(RegisterUserSchema), async (req, res, next) => {
    try {
      const user = await service.registerUser(req.body);
      res.status(201).json({ success: true, data: user });
    } catch (err) {
      next(err);
    }
  });

  // ----------------------------------------------------------
  // PATCH /users/:id — Update user profile
  // ----------------------------------------------------------

  userRegistry.registerPath({
    method: "patch",
    path: "/users/{id}",
    tags: ["Users"],
    summary: "Update user profile",
    description: "Partially update a user's name or avatar. All fields are optional.",
    operationId: "updateUser",
    request: {
      params: UserParamsSchema,
      body: {
        required: true,
        content: { "application/json": { schema: UpdateUserSchema } },
      },
    },
    responses: {
      200: {
        description: "User updated successfully",
        content: {
          "application/json": {
            schema: z.object({ success: z.literal(true), data: UserSchema }),
          },
        },
      },
      400: {
        description: "Validation error",
        content: { "application/json": { schema: ValidationErrorSchema } },
      },
      404: {
        description: "User not found",
        content: { "application/json": { schema: ErrorResponseSchema } },
      },
      500: {
        description: "Unexpected server error",
        content: { "application/json": { schema: ErrorResponseSchema } },
      },
    },
  });

  router.patch(
    "/:id",
    validate(UserParamsSchema, "params"),
    validate(UpdateUserSchema),
    async (req, res, next) => {
      try {
        const user = await service.updateUser(req.params.id, req.body);
        res.json({ success: true, data: user });
      } catch (err) {
        next(err);
      }
    }
  );

  // ----------------------------------------------------------
  // DELETE /users/:id — Deactivate user
  // ----------------------------------------------------------

  userRegistry.registerPath({
    method: "delete",
    path: "/users/{id}",
    tags: ["Users"],
    summary: "Deactivate a user",
    description:
      "Soft-deletes a user by setting `isActive` to `false`. The record is retained.",
    operationId: "deactivateUser",
    request: {
      params: UserParamsSchema,
    },
    responses: {
      204: { description: "User deactivated — no content returned" },
      404: {
        description: "User not found",
        content: { "application/json": { schema: ErrorResponseSchema } },
      },
      500: {
        description: "Unexpected server error",
        content: { "application/json": { schema: ErrorResponseSchema } },
      },
    },
  });

  router.delete("/:id", validate(UserParamsSchema, "params"), async (req, res, next) => {
    try {
      await service.deactivateUser(req.params.id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  });

  return router;
}

// ============================================================
// Centralised error handler — mount AFTER all routers in app.ts
// ============================================================

export function userErrorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof UserNotFoundError) {
    res.status(404).json({ success: false, error: err.message });
    return;
  }
  if (err instanceof UserConflictError) {
    res.status(409).json({ success: false, error: err.message });
    return;
  }
  res.status(500).json({ success: false, error: "Internal server error" });
}