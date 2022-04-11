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
    const episode = await this.prismaService.episode.findFirst({
      where: {
        isWatched: false,
        watchlistId: watchlist.id,
        airedAt: {
          lte: new Date(),
        },
      },
      orderBy: { id: 'asc' },
      select: {
        id: true,
        seasonNumber: true,
        episodeNumber: true,
        isWatched: true,
      },
    });

    if (!episode) {
      return null;
    }

    return this.tmdbEpisodeService
      .getDetails(watchlist.showId, episode.seasonNumber, episode.episodeNumber)
      .then(assoc('id', episode.id))
      .then(assoc('isWatched', episode.isWatched));
  }

  async findUpcoming(watchlist: Watchlist): Promise<Episode | null> {
    const episode = await this.prismaService.episode.findFirst({
      where: {
        isWatched: false,
        watchlistId: watchlist.id,
        airedAt: {
          gte: new Date(),
        },
      },
      orderBy: { id: 'asc' },
      select: {
        id: true,
        seasonNumber: true,
        episodeNumber: true,
        isWatched: true,
      },
    });

    if (!episode) {
      return null;
    }

    console.log('episode.id', episode.id);

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
        airedAt: airDate,
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
