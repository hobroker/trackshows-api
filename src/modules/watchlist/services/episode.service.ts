import { Injectable } from '@nestjs/common';
import { Prisma, Watchlist } from '@prisma/client';
import { assoc } from 'rambda';
import { PrismaService } from '../../prisma';
import { TmdbEpisodeService } from '../../tmdb';
import { Episode } from '../../show/entities/episode';

@Injectable()
export class EpisodeService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly tmdbEpisodeService: TmdbEpisodeService,
  ) {
    this.findNext = this.findNext.bind(this);
  }

  async findNext(watchlist: Watchlist): Promise<Episode> {
    const episode = await this.prismaService.episode.findFirst({
      where: {
        isWatched: false,
        watchlistId: watchlist.id,
      },
      orderBy: { episodeNumber: 'asc' },
      select: {
        id: true,
        seasonNumber: true,
        episodeNumber: true,
      },
    });

    return this.tmdbEpisodeService
      .getDetails(watchlist.showId, episode.seasonNumber, episode.episodeNumber)
      .then(assoc('id', episode.id));
  }

  async createEpisodes(watchlist: Watchlist) {
    const episodes = await this.tmdbEpisodeService.getAllEpisodes(
      watchlist.showId,
    );
    const data: Prisma.EpisodeUncheckedCreateInput[] = episodes.map(
      ({ number, seasonNumber }) => ({
        seasonNumber: seasonNumber,
        episodeNumber: number,
        watchlistId: watchlist.id,
        isWatched: false,
      }),
    );

    await this.prismaService.episode.createMany({ data, skipDuplicates: true });
  }

  async upsertEpisode(episodeId, isWatched) {
    await this.prismaService.episode.update({
      where: { id: episodeId },
      data: { isWatched },
    });
  }
}
