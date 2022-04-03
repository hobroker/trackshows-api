import 'reflect-metadata';
import { Args, Context, Info, Mutation, Query } from '@nestjs/graphql';
import { Injectable, UseGuards } from '@nestjs/common';
import { GraphQLResolveInfo } from 'graphql';
import { fieldsMap } from 'graphql-fields-list';
import { GraphqlJwtAuthGuard } from '../../auth/guards';
import { RequestWithUser } from '../../auth/interfaces';
import { PreferenceService } from '../services';
import { Preference } from '../entities';
import { UpsertPreferenceInput } from './input';

@Injectable()
export class PreferenceResolver {
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
  async getPreferences(
    @Info() info: GraphQLResolveInfo,
    @Context() { req: { user } }: { req: RequestWithUser },
  ) {
    const fields = fieldsMap(info);

    return this.preferenceService.findByUserId(user.id, {
      include: { genres: 'genres' in fields },
    });
  }
}
