import { Prisma } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma';
import { TmdbGenreService } from '../../tmdb';
import { Preference } from '../entities';

@Injectable()
export class PreferenceService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly tmdbGenreService: TmdbGenreService,
  ) {}

  upsert(userId: number, data: Partial<Prisma.PreferenceUncheckedCreateInput>) {
    return this.prismaService.preference.upsert({
      where: { userId },
      update: { ...data },
      create: { ...data, userId },
    });
  }

  async findByUserId(
    userId: number,
    { include = { genres: false } } = {},
  ): Promise<Preference> {
    const item = await this.prismaService.preference.findFirst({
      where: { userId },
    });

    const preference: Preference = {
      ...item,
      shows: [],
      genres: [],
    };

    if (include.genres) {
      preference.genres = await this.tmdbGenreService.findByExternalIds(
        item.genreIds,
      );
    }

    return preference;
  }
}
