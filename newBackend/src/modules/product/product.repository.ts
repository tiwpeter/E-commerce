import { ProductFilter} from "./product.schema";
import { prisma } from "@/config/database";

export const productRepository = {
  
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

    const [items, total] = await Promise.all([
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