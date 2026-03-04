import { prisma } from '../config/database';
import { productRepository } from '../repositories/product.repository';
import { NotFoundError, ConflictError, ForbiddenError } from '../utils/errors';
import { buildPaginationMeta, parsePagination } from '../utils/response.helper';

export interface CreateReviewDto {
  rating: number;
  title?: string;
  comment?: string;
}

export class ReviewService {
  async getProductReviews(productId: string, query: Record<string, string | undefined>) {
    const product = await productRepository.findById(productId);
    if (!product) throw new NotFoundError('Product not found');

    const { page, limit, skip } = parsePagination(query);

    const where = { productId, deletedAt: null, isApproved: true };
    const [reviews, total] = await prisma.$transaction([
      prisma.review.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { id: true, name: true, avatar: true } } },
      }),
      prisma.review.count({ where }),
    ]);

    return { reviews, meta: buildPaginationMeta(total, page, limit) };
  }

  async create(userId: string, productId: string, dto: CreateReviewDto) {
    const product = await productRepository.findById(productId);
    if (!product) throw new NotFoundError('Product not found');

    const existing = await prisma.review.findUnique({
      where: { userId_productId: { userId, productId } },
    });
    if (existing) throw new ConflictError('You have already reviewed this product');

    return prisma.review.create({
      data: {
        userId,
        productId,
        rating: dto.rating,
        title: dto.title,
        comment: dto.comment,
        isApproved: true, // Auto-approve; add moderation queue if needed
      },
      include: { user: { select: { id: true, name: true, avatar: true } } },
    });
  }

  async delete(reviewId: string, userId: string, isAdmin: boolean): Promise<void> {
    const review = await prisma.review.findUnique({ where: { id: reviewId } });
    if (!review) throw new NotFoundError('Review not found');

    if (!isAdmin && review.userId !== userId) {
      throw new ForbiddenError('Cannot delete another user\'s review');
    }

    await prisma.review.update({
      where: { id: reviewId },
      data: { deletedAt: new Date() },
    });
  }

  async getAllReviews(query: Record<string, string | undefined>) {
    const { page, limit, skip } = parsePagination(query);
    const where = { deletedAt: null };

    const [reviews, total] = await prisma.$transaction([
      prisma.review.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { id: true, name: true } },
          product: { select: { id: true, name: true } },
        },
      }),
      prisma.review.count({ where }),
    ]);

    return { reviews, meta: buildPaginationMeta(total, page, limit) };
  }

  async approve(reviewId: string): Promise<void> {
    await prisma.review.update({
      where: { id: reviewId },
      data: { isApproved: true },
    });
  }
}

export const reviewService = new ReviewService();
