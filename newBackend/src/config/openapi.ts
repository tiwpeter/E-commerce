import { OpenApiGeneratorV31 } from "@asteasolutions/zod-to-openapi";
import { productRegistry } from "@/modules/products/product.registry"; 

// ============================================================
// Collect all registries from every route module
// Add new registries here as the project grows
// ============================================================

const allDefinitions = [
  ...productRegistry.definitions,
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
        "REST API for product management.\n\n" +
        "**Response envelope**\n" +
        "- Success: `{ success: true, data: <payload> }`\n" +
        "- Error: `{ success: false, error: '<message>' }`",
      contact: {
        name: "API Support",
        email: "dev@example.com",
      },
    },
    servers: [
      { url: "http://localhost:5000/api", description: "Local development" },
      { url: "https://api.example.com", description: "Production" },
    ],
    tags: [
      { name: "Products", description: "Product management" },
    ],
  });
}
