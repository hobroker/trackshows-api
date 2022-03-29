import 'reflect-metadata';
import { Query, Resolver } from '@nestjs/graphql';
import { Injectable } from '@nestjs/common';
import { TmdbGenreService } from '../../tmdb';
import { Genre } from '../entities';

@Injectable()
@Resolver(Genre)
export class GenreResolver {
  constructor(private readonly tmdbGenreService: TmdbGenreService) {}

  @Query(() => [Genre], { nullable: true })
  listGenres() {
    return this.tmdbGenreService.list();
  }
}
