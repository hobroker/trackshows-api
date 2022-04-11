import { Injectable } from '@nestjs/common';
import { Prisma, Watchlist } from '@prisma/client';
import { assoc } from 'ramda';
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
    this.findUpcoming = this.findUpcoming.bind(this);
  }

  async findNext(watchlist: Watchlist): Promise<Episode | null> {
    return this.findEpisodeInWatchlist(watchlist, {
      airDate: {
        lte: new Date(),
      },
    });
  }

  findUpcoming(watchlist: Watchlist): Promise<Episode | null> {
    return this.findEpisodeInWatchlist(watchlist, {
      airDate: {
        gte: new Date(),
      },
    });
  }

  private async findEpisodeInWatchlist(
    watchlist: Watchlist,
    where: Prisma.EpisodeWhereInput,
  ) {
    const episode = await this.prismaService.episode.findFirst({
      where: {
        watchlistId: watchlist.id,
        isWatched: false,
        ...where,
      },
      orderBy: { id: 'asc' },
    });

    if (!episode) {
      return null;
    }

    return this.tmdbEpisodeService
      .getDetails(watchlist.showId, episode.seasonNumber, episode.episodeNumber)
      .then(assoc('id', episode.id))
      .then(assoc('isWatched', episode.isWatched));
  }

  async createEpisodes(watchlist: Watchlist) {
    const episodes = await this.tmdbEpisodeService.getAllEpisodes(
      watchlist.showId,
    );
    const data: Prisma.EpisodeUncheckedCreateInput[] = episodes.map(
      ({ number, seasonNumber, airDate }) => ({
        seasonNumber: seasonNumber,
        episodeNumber: number,
        watchlistId: watchlist.id,
        isWatched: false,
        airDate,
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

  async getEpisodeUpNext(episodeId: number): Promise<Episode | null> {
    const { watchlist } = await this.prismaService.episode.findFirst({
      where: { id: episodeId },
      include: {
        watchlist: true,
      },
    });

    return this.findNext(watchlist);
  }
}
