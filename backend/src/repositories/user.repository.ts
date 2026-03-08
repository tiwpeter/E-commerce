import { Prisma, User } from '@prisma/client';
import { prisma } from '../config/database';

export type SafeUser = Omit<User, 'password' | 'refreshToken'>;

const safeSelect = {
  id: true,
  email: true,
  name: true,
  role: true,
  isActive: true,
  emailVerified: true,
  avatar: true,
  createdAt: true,
  updatedAt: true,
} as const;

export class UserRepository {
  async findById(id: string): Promise<User | null> {
    return prisma.user.findFirst({ where: { id, deletedAt: null } });
  }

  async findByIdSafe(id: string): Promise<SafeUser | null> {
    return prisma.user.findFirst({
      where: { id, deletedAt: null },
      select: safeSelect,
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findFirst({ where: { email, deletedAt: null } });
  }

  async create(data: Prisma.UserCreateInput): Promise<SafeUser> {
    return prisma.user.create({ data, select: safeSelect });
  }

  async updateRefreshToken(id: string, token: string | null): Promise<void> {
    await prisma.user.update({ where: { id }, data: { refreshToken: token } });
  }

  async update(id: string, data: Prisma.UserUpdateInput): Promise<SafeUser> {
    return prisma.user.update({ where: { id }, data, select: safeSelect });
  }

  async findAll(params: {
    skip: number;
    take: number;
    search?: string;
  }): Promise<[SafeUser[], number]> {
    const where: Prisma.UserWhereInput = {
      deletedAt: null,
      ...(params.search && {
        OR: [
          { name: { contains: params.search, mode: 'insensitive' } },
          { email: { contains: params.search, mode: 'insensitive' } },
        ],
      }),
    };

    return prisma.$transaction([
      prisma.user.findMany({ where, skip: params.skip, take: params.take, select: safeSelect, orderBy: { createdAt: 'desc' } }),
      prisma.user.count({ where }),
    ]);
  }

  async softDelete(id: string): Promise<void> {
    await prisma.user.update({
      where: { id },
      data: { deletedAt: new Date(), isActive: false },
    });
  }
}

export const userRepository = new UserRepository();
