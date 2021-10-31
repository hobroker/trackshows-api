import 'reflect-metadata';
import { Query, Resolver } from '@nestjs/graphql';
import { Inject } from '@nestjs/common';
import { TmdbTvService } from '../services';
import { Genre } from '../entities/genre';

@Resolver(Genre)
export class GenreResolver {
  @Inject(TmdbTvService)
  private genreService: TmdbTvService;

  @Query(() => [Genre], { nullable: true })
  genres() {
    return this.genreService.list();
  }
}
