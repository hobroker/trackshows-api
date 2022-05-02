import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { filter, map, prop, sum } from 'ramda';
import { PrismaService } from '../../prisma';
import { Review } from '../entities';

@Injectable()
export class ReviewService {
  constructor(private readonly prismaService: PrismaService) {}

  async upsert(
    where: Prisma.ReviewUserIdShowIdCompoundUniqueInput,
    data: Omit<Prisma.ReviewUncheckedCreateInput, 'userId' | 'showId'>,
  ): Promise<Review> {
    return this.prismaService.review.upsert({
      where: { userId_showId: where },
      create: { ...where, ...data },
      update: data,
      include: { user: true },
    });
  }

  async getRating(showId: number): Promise<Review> {
    const review = new Review();
    const reviews = await this.prismaService.review
      .findMany({
        where: { showId },
        select: { rating: true },
      })
      .then(map(prop('rating')))
      .then(filter(Boolean));

    review.rating = 0;

    if (reviews.length) {
      review.rating = sum(reviews) / reviews.length;
    }

    return review;
  }

  async getOtherReviews(showId: number, userId?: number): Promise<Review[]> {
    return this.prismaService.review.findMany({
      where: { showId, userId: { not: userId } },
      orderBy: { createdAt: 'asc' },
      include: { user: true },
    });
  }

  async getMyReview(showId: number, userId?: number): Promise<Review> {
    return this.prismaService.review.findFirst({
      where: { showId, userId },
      include: { user: true },
    });
  }
}
