import { Prisma } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma';
import { TmdbGenreService } from '../../tmdb';
import { Preference } from '../entities';
import { toggleListItem } from '../../../util/fp';

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

  async toggleGenre(userId: number, genreId: number) {
    const preference = await this.prismaService.preference.findFirst({
      where: { userId },
    });

    if (!preference) {
      return this.upsert(userId, { genreIds: [genreId] });
    }

    const genreIds = toggleListItem(genreId, preference.genreIds);

    return this.upsert(userId, { genreIds });
  }

  async findByUserId(
    userId: number,
    { include = { genres: false } } = {},
  ): Promise<Preference> {
    const item = await this.prismaService.preference.findFirst({
      where: { userId },
    });

    if (!item) {
      return null;
    }

    const preference: Preference = {
      ...item,
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
