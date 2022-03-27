import { Injectable } from '@nestjs/common';
import { TmdbGenreService } from '../../tmdb';

@Injectable()
export class GenreService {
  constructor(private tmdbGenreService: TmdbGenreService) {}

  async list() {
    return this.tmdbGenreService.list();
  }
}
