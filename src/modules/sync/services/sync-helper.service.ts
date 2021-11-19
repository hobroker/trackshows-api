import { Injectable } from '@nestjs/common';
import { map, prop } from 'rambda';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma';

@Injectable()
export class SyncHelperService {
  constructor(private prismaService: PrismaService) {}

  async findExternalShowIds(where: Prisma.ShowWhereInput): Promise<number[]> {
    return this.prismaService.show
      .findMany({
        where,
        select: { externalId: true },
      })
      .then(map(prop('externalId')));
  }
}
