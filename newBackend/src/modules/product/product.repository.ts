import { ProductFilter, CreateProductInput, UpdateProductInput } from "./product.types";
import { prisma } from "@/prisma/client";

export const productRepository = {
  
create(data: CreateProductInput) {
  const { categoryId, ...rest } = data;

  return prisma.product.create({
    data: {
      ...rest,
      category: {
        connect: { id: categoryId }
      }
    }
  });
},

  update(id: string, data: UpdateProductInput) {
    return prisma.product.update({
      where: { id },
      data,
    });
  },

  delete(id: string) {
    return prisma.product.delete({
      where: { id },
    });
  },

  findById(id: string) {
    return prisma.product.findUnique({
      where: { id },
    });
  },

  async findAll(filter: ProductFilter) {
    const { categoryId, minPrice, maxPrice, isActive, page, limit } = filter;

    const where = {
      ...(categoryId && { categoryId: String(categoryId) }), // ← แปลงเป็น string ถ้า Prisma schema ใช้ String
      ...(typeof isActive === "boolean" && { isActive }),
      ...(minPrice || maxPrice
        ? {
            price: {
              ...(minPrice && { gte: minPrice }),
              ...(maxPrice && { lte: maxPrice }),
            },
          }
        : {}),
    };

    const [items, total] = await prisma.$transaction([
      prisma.product.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.product.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      limit,
    };
  },
};