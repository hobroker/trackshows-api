import 'reflect-metadata';
import { Query, Resolver } from '@nestjs/graphql';
import { Inject } from '@nestjs/common';
import { TmdbGenreService } from '../services';
import { Genre } from '../entities/genre';

@Resolver(Genre)
export class GenreResolver {
  @Inject(TmdbGenreService)
  private genreService: TmdbGenreService;

  @Query(() => [Genre], { nullable: true })
  genres() {
    return this.genreService.list();
  }
}
