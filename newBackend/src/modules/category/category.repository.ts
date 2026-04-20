import { prisma } from '@/prisma/client';

export const CategoryRepository = {
  create: (data: any) => prisma.category.create({ data }),

  findMany: (skip: number, take: number, search?: string) =>
    prisma.category.findMany({
      where: {
        deletedAt: null,
        ...(search && {
          name: { contains: search, mode: 'insensitive' },
        }),
      },
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    }),

  count: (search?: string) =>
    prisma.category.count({
      where: {
        deletedAt: null,
        ...(search && {
          name: { contains: search, mode: 'insensitive' },
        }),
      },
    }),

  findById: (id: string) =>
    prisma.category.findFirst({
      where: { id, deletedAt: null },
    }),

  update: (id: string, data: any) =>
    prisma.category.update({
      where: { id },
      data,
    }),

  softDelete: (id: string) =>
    prisma.category.update({
      where: { id },
      data: { deletedAt: new Date() },
    }),

  findAll: () =>
    prisma.category.findMany({
      where: { deletedAt: null },
    }),
};