import { Injectable } from '@nestjs/common';
import { Prisma, Watchlist } from '@prisma/client';
import { assoc, prop, propOr } from 'ramda';
import { PrismaService } from '../../prisma';
import { TmdbEpisodeService } from '../../tmdb';
import { Episode } from '../../show/entities/episode';
import { Status } from '../entities';
import { indexByAndMap } from '../../../util/fp/indexByAndMap';

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

  async findEpisodeInWatchlist(
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
      ({ number, seasonNumber, airDate, externalId }) => ({
        id: externalId,
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

  async getSeasonEpisodes(
    showId: number,
    seasonNumber: number,
    userId: number | undefined,
  ): Promise<Episode[]> {
    const episodesMap = !userId
      ? {}
      : await this.prismaService.watchlist
          .findFirst({
            where: { userId, showId, statusId: Status.InWatchlist },
            include: {
              episodes: {
                select: {
                  id: true,
                  isWatched: true,
                },
              },
            },
          })
          .then(propOr([], 'episodes'))
          .then(indexByAndMap(prop('id'), prop('isWatched')));

    return this.tmdbEpisodeService
      .getSeasonEpisodes(showId, seasonNumber)
      .then((episodes) =>
        episodes.map((episode) => ({
          ...episode,
          id: episode.externalId,
          isWatched: !!episodesMap[episode.externalId],
        })),
      );
  }
}
