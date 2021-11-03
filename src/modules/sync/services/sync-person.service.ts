import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma';
import { TmdbPersonService } from '../../tmdb';

@Injectable()
export class SyncPersonService {
  @Inject(TmdbPersonService)
  private tmdbPersonService: TmdbPersonService;

  @Inject(PrismaService)
  private prismaService: PrismaService;

  async sync() {
    // const genres = await this.tmdbPersonService.list().then(map(genreFacade));
    //
    // return this.prismaService.genre.createMany({
    //   data: genres,
    //   skipDuplicates: true,
    // });
  }
}
