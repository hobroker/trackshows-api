import 'reflect-metadata';
import { Args, Context, Info, Mutation, Query } from '@nestjs/graphql';
import { Injectable, UseGuards } from '@nestjs/common';
import { GraphQLResolveInfo } from 'graphql';
import { fieldsMap } from 'graphql-fields-list';
import { GraphqlJwtAuthGuard } from '../../auth/guards';
import { RequestWithUser } from '../../auth/interfaces';
import { PreferenceService } from '../services';
import { Preference } from '../entities';
import { Void } from '../../../util/void';
import { ToggleGenrePreferenceInput } from './input';

@Injectable()
export class PreferenceResolver {
  constructor(private readonly preferenceService: PreferenceService) {}

  @Mutation(() => Void)
  @UseGuards(GraphqlJwtAuthGuard)
  async toggleGenrePreference(
    @Args('input') { genreId }: ToggleGenrePreferenceInput,
    @Context() { req: { user } }: { req: RequestWithUser },
  ) {
    return this.preferenceService.toggleGenre(user.id, genreId);
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
