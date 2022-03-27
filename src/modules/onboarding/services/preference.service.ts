import { Prisma } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma';

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

  findByUserId(userId: number) {
    return this.prismaService.preference.findFirst({
      where: { userId },
    });
  }
}
