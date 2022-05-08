import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma';
import { TmdbShowService } from '../../tmdb';

@Injectable()
export class SearchService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly tmdbShowService: TmdbShowService,
  ) {}
}
