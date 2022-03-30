import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import type { Watchlist } from '@prisma/client';
import { PrismaService } from '../../prisma';

@Injectable()
export class WatchlistService {
  constructor(private readonly prismaService: PrismaService) {}

  upsert(
    where: Prisma.WatchlistUserIdShowIdCompoundUniqueInput,
    data: Omit<Prisma.WatchlistUncheckedCreateInput, 'userId' | 'showId'>,
  ): Promise<Watchlist> {
    return this.prismaService.watchlist.upsert({
      where: {
        userId_showId: where,
      },
      create: { ...where, ...data },
      update: data,
    });
  }

  listByUserId(userId: number) {
    return this.prismaService.watchlist.findMany({
      where: { userId },
    });
  }
}
