import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { authenticate } from "./auth.middleware";

export function createAuthRouter(db: PrismaClient): Router {
  const router = Router();
  const service = new AuthService(db);
  const controller = new AuthController(service);

  // Public routes
  router.post("/register", controller.register);
  router.post("/login", controller.login);
  router.post("/refresh", controller.refresh);
  router.post("/verify-email", controller.verifyEmail);
  router.post("/forgot-password", controller.forgotPassword);
  router.post("/reset-password", controller.resetPassword);

  // Protected routes
  router.post("/logout", authenticate, controller.logout);
  router.get("/me", authenticate, controller.me);
  router.post("/change-password", authenticate, controller.changePassword);

  return router;
}
