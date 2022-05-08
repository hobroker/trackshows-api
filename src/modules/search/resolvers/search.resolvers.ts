import 'reflect-metadata';
import { Args, Query } from '@nestjs/graphql';
import { Injectable } from '@nestjs/common';
import { PartialShow } from '../../show';
import { TmdbShowService } from '../../tmdb';
import { SearchInput } from './inputs';

@Injectable()
export class SearchResolver {
  constructor(private tmdbShowService: TmdbShowService) {}

  @Query(() => [PartialShow])
  async search(@Args('input') { query }: SearchInput) {
    return this.tmdbShowService.search(query);
  }
}
