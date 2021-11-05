import 'reflect-metadata';
import { Query, Resolver } from '@nestjs/graphql';
import { Inject } from '@nestjs/common';
import { Genre } from '../entities';
import { GenreService } from '../services';

@Resolver(Genre)
export class GenreResolver {
  @Inject(GenreService)
  private genreService: GenreService;

  @Query(() => [Genre], { nullable: true })
  genres() {
    return this.genreService.list();
  }
}
