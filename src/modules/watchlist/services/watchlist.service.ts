import { Injectable } from '@nestjs/common';
import type { Watchlist } from '@prisma/client';
import { Prisma } from '@prisma/client';
import { filter } from 'ramda';
import { PrismaService } from '../../prisma';
import { Episode } from '../../show/entities/episode';
import { Status } from '../entities';
import { EpisodeService } from './episode.service';

@Injectable()
export class WatchlistService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly episodeService: EpisodeService,
  ) {}

  async upsert(
    where: Prisma.WatchlistUserIdShowIdCompoundUniqueInput,
    data: Omit<Prisma.WatchlistUncheckedCreateInput, 'userId' | 'showId'>,
  ): Promise<Watchlist> {
    const watchlist = await this.prismaService.watchlist.upsert({
      where: {
        userId_showId: where,
      },
      create: { ...where, ...data },
      update: data,
    });

    if (data.statusId === Status.InWatchlist) {
      await this.episodeService.createEpisodes(watchlist);
    }

    return watchlist;
  }

  listByUserId(userId: number) {
    return this.prismaService.watchlist.findMany({
      where: { userId },
    });
  }

  async listUpNext(userId: number): Promise<Episode[]> {
    const watchlist = await this.findUserWatchlist(userId);

    return Promise.all(watchlist.map(this.episodeService.findNext)).then(
      filter<Episode>(Boolean),
    );
  }

  async listUpcoming(userId: number): Promise<Episode[]> {
    const watchlist = await this.findUserWatchlist(userId);

    return Promise.all(watchlist.map(this.episodeService.findUpcoming)).then(
      filter<Episode>(Boolean),
    );
  }

  private findUserWatchlist(userId: number) {
    return this.prismaService.watchlist.findMany({
      where: { userId, statusId: Status.InWatchlist },
    });
  }
}
