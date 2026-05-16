import { OpenApiGeneratorV31 } from "@asteasolutions/zod-to-openapi";
import { userRegistry } from "./user.routes";
import { cartRegistry } from "./cart.routes";

// ============================================================
// Collect all registries from every route module
// Add new registries here as the project grows
// ============================================================

const allDefinitions = [
  ...userRegistry.definitions,
  ...cartRegistry.definitions,
];

// ============================================================
// Generate OpenAPI document
// ============================================================

export function generateOpenApiDocument() {
  const generator = new OpenApiGeneratorV31(allDefinitions);

  return generator.generateDocument({
    openapi: "3.1.0",
    info: {
      title: "E-Commerce API",
      version: "1.0.0",
      description:
        "REST API for user management and shopping cart operations.\n\n" +
        "**Response envelope**\n" +
        "- Success: `{ success: true, data: <payload> }`\n" +
        "- Error: `{ success: false, error: '<message>' }`",
      contact: {
        name: "API Support",
        email: "dev@example.com",
      },
    },
    servers: [
      { url: "http://localhost:3000", description: "Local development" },
      { url: "https://api.example.com", description: "Production" },
    ],
    tags: [
      { name: "Users", description: "User registration and profile management" },
      { name: "Cart", description: "Shopping cart operations" },
    ],
  });
}
