import 'reflect-metadata';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { Injectable } from '@nestjs/common';
import { Show } from '../../show';
import { TmdbShowService } from '../../tmdb';
import { SearchInput } from './inputs';

@Injectable()
@Resolver(Show)
export class SearchResolver {
  constructor(private tmdbShowService: TmdbShowService) {}

  @Query(() => [Show])
  async search(@Args('input') { query }: SearchInput) {
    return this.tmdbShowService.search(query);
  }
}
