import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma';

@Injectable()
export class SyncGenderService {
  @Inject(PrismaService)
  private prismaService: PrismaService;

  async createMany(genders) {
    return this.prismaService.gender.createMany({
      data: genders,
      skipDuplicates: true,
    });
  }
}
