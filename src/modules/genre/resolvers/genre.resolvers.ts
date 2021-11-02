import 'reflect-metadata';
import { Query, Resolver } from '@nestjs/graphql';
import { Inject } from '@nestjs/common';
import { GenreService } from '../services';
import { Genre } from '../entities';

@Resolver(Genre)
export class GenreResolver {
  @Inject(GenreService)
  private genreService: GenreService;

  @Query(() => [Genre], { nullable: true })
  genres() {
    return this.genreService.list();
  }
}
