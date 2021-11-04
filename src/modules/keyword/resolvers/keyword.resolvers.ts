import 'reflect-metadata';
import { Query, Resolver } from '@nestjs/graphql';
import { Inject } from '@nestjs/common';
import { KeywordService } from '../services';
import { Keyword } from '../entities';

@Resolver(Keyword)
export class KeywordResolver {
  @Inject(KeywordService)
  private keywordService: KeywordService;

  @Query(() => [Keyword], { nullable: true })
  keywords() {
    return this.keywordService.list();
  }
}
