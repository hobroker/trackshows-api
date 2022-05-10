import { Injectable } from '@nestjs/common';
import { Show } from '../entities';
import { PrismaService } from '../../prisma';
import { Status } from '../../watchlist/entities';

@Injectable()
export class StatusService {
  constructor(private readonly prismaService: PrismaService) {}

  getStatusForShow<T extends Show>(userId: number, show: T): Promise<Status> {
    return this.prismaService.watchlist
      .findFirst({
        where: { userId, showId: show.externalId },
        include: {
          episodes: {
            take: 1,
            where: { isWatched: false },
          },
        },
        rejectOnNotFound: true,
      })
      .then(({ episodes, statusId }) =>
        episodes.length ? statusId : Status.FinishedWatching,
      )
      .catch(() => Status.None);
  }
}
