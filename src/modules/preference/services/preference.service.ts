import { Prisma } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { assoc } from 'ramda';
import { PrismaService } from '../../prisma';
import { Preference } from '../entities';
import { toggleListItem } from '../../../util/fp';

@Injectable()
export class PreferenceService {
  constructor(private readonly prismaService: PrismaService) {}

  upsert(userId: number, data: Partial<Prisma.PreferenceUncheckedCreateInput>) {
    return this.prismaService.preference.upsert({
      where: { userId },
      update: { ...data },
      create: { ...data, userId },
    });
  }

  async toggleGenreForUser(userId: number, genreId: number) {
    const preference = await this.prismaService.preference.findFirst({
      where: { userId },
    });

    if (!preference) {
      return this.upsert(userId, { genreIds: [genreId] });
    }

    const genreIds = toggleListItem(genreId, preference.genreIds);

    return this.upsert(userId, { genreIds });
  }

  async findByUserId(userId: number): Promise<Preference> {
    return this.prismaService.preference
      .findFirst({ where: { userId } })
      .then(assoc('genres', []));
  }
}
