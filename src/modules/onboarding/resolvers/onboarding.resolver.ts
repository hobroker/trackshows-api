import 'reflect-metadata';
import { Args, Context, Mutation, Query } from '@nestjs/graphql';
import { Injectable, UseGuards } from '@nestjs/common';
import { GraphqlJwtAuthGuard } from '../../auth/guards';
import { RequestWithUser } from '../../auth/interfaces';
import { UpsertPreferenceInput } from './input';
import { PreferenceService } from '../services';
import { Preference } from '../entities';

@Injectable()
export class OnboardingResolver {
  constructor(private readonly preferenceService: PreferenceService) {}

  @Mutation(() => Preference)
  @UseGuards(GraphqlJwtAuthGuard)
  async savePreferences(
    @Args('input') input: UpsertPreferenceInput,
    @Context() { req: { user } }: { req: RequestWithUser },
  ) {
    const { genreIds } = input;

    return this.preferenceService.upsert(user.id, {
      genreIds,
    });
  }

  @Query(() => Preference, { nullable: true })
  @UseGuards(GraphqlJwtAuthGuard)
  async getPreferences(@Context() { req: { user } }: { req: RequestWithUser }) {
    return this.preferenceService.findByUserId(user.id);
  }
}
