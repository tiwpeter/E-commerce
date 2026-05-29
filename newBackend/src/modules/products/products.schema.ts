import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";

extendZodWithOpenApi(z);

// ─── ProductImage ─────────────────────────────────────────────

export const ProductImageSchema = z.object({
  id:        z.string().cuid(),
  url:       z.string().url(),
  alt:       z.string().nullable().optional(),
  isPrimary: z.boolean().default(false),
  order:     z.number().int().min(0).default(0),
  productId: z.string().cuid(),
  createdAt: z.coerce.date(),
}).openapi("ProductImage");

export const CreateProductImageSchema = ProductImageSchema
  .omit({ id: true, productId: true, createdAt: true })
  .openapi("CreateProductImage");

export type ProductImage            = z.infer<typeof ProductImageSchema>;
export type CreateProductImageInput = z.infer<typeof CreateProductImageSchema>;

// ─── ProductOption ────────────────────────────────────────────

export const ProductOptionSchema = z.object({
  id:        z.string().cuid(),
  productId: z.string().cuid(),
  name:      z.string().min(1),
  order:     z.number().int().min(0).default(0),
  createdAt: z.coerce.date(),
}).openapi("ProductOption");

export const CreateProductOptionSchema = ProductOptionSchema
  .omit({ id: true, productId: true, createdAt: true })
  .openapi("CreateProductOption");

export type ProductOption            = z.infer<typeof ProductOptionSchema>;
export type CreateProductOptionInput = z.infer<typeof CreateProductOptionSchema>;

// ─── OptionValue ──────────────────────────────────────────────

export const OptionValueSchema = z.object({
  id:        z.string().cuid(),
  optionId:  z.string().cuid(),
  value:     z.string().min(1),
  order:     z.number().int().min(0).default(0),
  createdAt: z.coerce.date(),
}).openapi("OptionValue");

export const CreateOptionValueSchema = OptionValueSchema
  .omit({ id: true, optionId: true, createdAt: true })
  .openapi("CreateOptionValue");

export type OptionValue            = z.infer<typeof OptionValueSchema>;
export type CreateOptionValueInput = z.infer<typeof CreateOptionValueSchema>;

// ─── VariantOptionValue ───────────────────────────────────────

export const VariantOptionValueSchema = z.object({
  id:            z.string().cuid(),
  variantId:     z.string().cuid(),
  optionValueId: z.string().cuid(),
  optionValue: z.object({
    id:       z.string().cuid(),
    optionId: z.string().cuid(),
    value:    z.string().min(1),
    order:    z.number().int().min(0).default(0),
  }),
}).openapi("VariantOptionValue");

export type VariantOptionValue = z.infer<typeof VariantOptionValueSchema>;

// ─── ProductVariant ───────────────────────────────────────────

export const ProductVariantSchema = z.object({
  id:            z.string().cuid(),
  productId:     z.string().cuid(),
  sku:           z.string().min(1),
  price:         z.number().positive(),
  comparePrice:  z.number().positive().nullable().optional(),
  stock:         z.number().int().min(0).default(0),
  weight:        z.number().positive().nullable().optional(),
  image:         z.string().url().nullable().optional(),
  isActive:      z.boolean().default(true),
  createdAt:     z.coerce.date(),
  updatedAt:     z.coerce.date(),
  variantOption: z.array(VariantOptionValueSchema),
}).openapi("ProductVariant");

export const CreateProductVariantSchema = ProductVariantSchema
  .omit({ id: true, productId: true, createdAt: true, updatedAt: true })
  .openapi("CreateProductVariant");

export const UpdateProductVariantSchema = CreateProductVariantSchema
  .partial()
  .openapi("UpdateProductVariant");

export type ProductVariant            = z.infer<typeof ProductVariantSchema>;
export type CreateProductVariantInput = z.infer<typeof CreateProductVariantSchema>;
export type UpdateProductVariantInput = z.infer<typeof UpdateProductVariantSchema>;

// ─── Product ──────────────────────────────────────────────────

export const ProductSchema = z.object({
  id:           z.string().cuid(),
  name:         z.string().min(1),
  slug:         z.string().min(1).regex(/^[a-z0-9-]+$/, "slug must be lowercase with hyphens"),
  description:  z.string().min(1),
  basePrice:    z.number().positive(),
  comparePrice: z.number().positive().nullable().optional(),
  sku:          z.string().min(1),
  weight:       z.number().positive().nullable().optional(),
  isActive:     z.boolean().default(true),
  isFeatured:   z.boolean().default(false),
  hasVariants:  z.boolean().default(false),
  stock:        z.number().int().min(0).default(0),
  categoryId:   z.string().cuid(),
  createdAt:    z.coerce.date(),
  updatedAt:    z.coerce.date(),
  deletedAt:    z.coerce.date().nullable().optional(),
  images:       z.array(ProductImageSchema),
  options:      z.array(ProductOptionSchema),
  variants:     z.array(ProductVariantSchema),
}).openapi("Product");

export const CreateProductSchema = ProductSchema
  .omit({ id: true, createdAt: true, updatedAt: true, deletedAt: true, images: true, options: true, variants: true })
  .openapi("CreateProduct");

export const UpdateProductSchema = CreateProductSchema
  .partial()
  .openapi("UpdateProduct");

export type Product            = z.infer<typeof ProductSchema>;
export type CreateProductInput = z.infer<typeof CreateProductSchema>;
export type UpdateProductInput = z.infer<typeof UpdateProductSchema>;