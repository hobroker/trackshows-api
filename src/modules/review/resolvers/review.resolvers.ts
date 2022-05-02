import 'reflect-metadata';
import { Injectable, UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query } from '@nestjs/graphql';
import { GraphqlJwtAnyoneGuard, GraphqlJwtAuthGuard } from '../../auth/guards';
import { ReviewService } from '../services';
import {
  RequestWithAnyoneInterface,
  RequestWithUser,
} from '../../auth/interfaces';
import { Review } from '../entities';
import { GetRatingInput, GetReviewInput, UpsertReviewInput } from './inputs';

@Injectable()
export class ReviewResolver {
  constructor(private readonly reviewService: ReviewService) {}

  @Query(() => Review)
  async getRating(@Args('input') { showId }: GetRatingInput) {
    return this.reviewService.getRating(showId);
  }

  @Query(() => [Review])
  @UseGuards(GraphqlJwtAnyoneGuard)
  async getOtherReviews(
    @Args('input') { showId }: GetReviewInput,
    @Context() { req: { user } }: { req: RequestWithAnyoneInterface },
  ) {
    return this.reviewService.getOtherReviews(showId, user?.id);
  }

  @Query(() => Review, { nullable: true })
  @UseGuards(GraphqlJwtAnyoneGuard)
  async getMyReview(
    @Args('input') { showId }: GetReviewInput,
    @Context() { req: { user } }: { req: RequestWithAnyoneInterface },
  ) {
    if (!user) {
      return null;
    }

    return this.reviewService.getMyReview(showId, user?.id);
  }

  @Mutation(() => Review)
  @UseGuards(GraphqlJwtAuthGuard)
  async upsertReview(
    @Args('input') { showId, ...input }: UpsertReviewInput,
    @Context() { req: { user } }: { req: RequestWithUser },
  ): Promise<Review> {
    return this.reviewService.upsert({ userId: user.id, showId }, input);
  }
}
