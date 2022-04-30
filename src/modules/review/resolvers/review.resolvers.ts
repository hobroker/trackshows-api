import 'reflect-metadata';
import { Injectable, UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query } from '@nestjs/graphql';
import { GraphqlJwtAuthGuard } from '../../auth/guards';
import { ReviewService } from '../services';
import { RequestWithUser } from '../../auth/interfaces';
import { Void } from '../../../util/void';
import { Review } from '../entities';
import { GetRatingInput, UpdateRatingInput, UpsertReviewInput } from './inputs';

@Injectable()
export class ReviewResolver {
  constructor(private readonly reviewService: ReviewService) {}

  @Query(() => Review)
  async getRating(@Args('input') { showId }: GetRatingInput) {
    return this.reviewService.getRating(showId);
  }

  @Mutation(() => Void)
  @UseGuards(GraphqlJwtAuthGuard)
  async upsertReview(
    @Args('input') { showId, title, content }: UpsertReviewInput,
    @Context() { req: { user } }: { req: RequestWithUser },
  ) {
    return this.reviewService.upsert(
      { userId: user.id, showId },
      { title, content },
    );
  }

  @Mutation(() => Void)
  @UseGuards(GraphqlJwtAuthGuard)
  async updateRating(
    @Args('input') { showId, rating }: UpdateRatingInput,
    @Context() { req: { user } }: { req: RequestWithUser },
  ) {
    return this.reviewService.upsert({ userId: user.id, showId }, { rating });
  }
}
