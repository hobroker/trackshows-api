import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { map, prop, sum, filter } from 'ramda';
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
      where: {
        userId_showId: where,
      },
      create: { ...where, ...data },
      update: data,
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
}
