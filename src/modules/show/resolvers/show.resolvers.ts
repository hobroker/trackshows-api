import 'reflect-metadata';
import { Query, Resolver } from '@nestjs/graphql';
import { Inject } from '@nestjs/common';
import { ShowService } from '../services';
import { Keyword, Show } from '../entities';

@Resolver(Show)
export class KeywordResolver {
  @Inject(ShowService)
  private showService: ShowService;

  @Query(() => [Keyword])
  keywords() {
    return this.showService.listKeywords();
  }

  @Query(() => [Show])
  shows() {
    return this.showService.listShows();
  }
}
