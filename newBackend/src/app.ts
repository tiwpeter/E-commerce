import express, { Application } from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";

import { config } from "./config/app.config";
import { prisma } from "./config/database";           // ← singleton เดียว ไม่สร้างซ้ำ
import { generateOpenApiDocument } from "./config/openapi";
import { errorHandler } from "./utils/errorHandler";  // ← centralized error handler

import productRoutes, { productService } from "./modules/products/product.routes";
import { createCartRouter } from "./modules/cart/cart.routes";
import { createAuthRouter } from "./modules/auth/auth.router";

export const createApp = (): Application => {
  const app = express();

  // ---- Middleware ----
  app.use(
    cors({
      origin: config.cors.origins,
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    }),
  );
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // ---- Routes ----
  app.use("/api/products", productRoutes);
  app.use("/api/carts", createCartRouter(prisma, productService)); // ← ใช้ prisma singleton
  app.use("/api/auth", createAuthRouter(prisma));                  // ← ใช้ prisma singleton

  // ---- Docs ----
  const openApiDoc = generateOpenApiDocument();
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openApiDoc));
  app.get("/api-docs.json", (_req, res) => res.json(openApiDoc));

  // ---- Error handler (ต้องมาสุดท้ายเสมอ) ----
  app.use(errorHandler);

  return app;
};