import { Injectable } from '@nestjs/common';
import { map, prop } from 'rambda';
import { Prisma, Show } from '@prisma/client';
import { PrismaService } from '../../prisma';

@Injectable()
export class SyncHelper {
  constructor(private prismaService: PrismaService) {}

  async findShowIds(where: Prisma.ShowWhereInput): Promise<number[]> {
    return this.findShows(where).then(map(prop('id')));
  }

  async findShowExternalIds(where: Prisma.ShowWhereInput): Promise<number[]> {
    return this.findShows(where).then(map(prop('externalId')));
  }

  private async findShows(where: Prisma.ShowWhereInput): Promise<Show[]> {
    return this.prismaService.show.findMany({ where });
  }
}
