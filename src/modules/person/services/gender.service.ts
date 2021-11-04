import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma';

@Injectable()
export class GenderService {
  @Inject(PrismaService)
  private prismaService: PrismaService;

  async list() {
    return this.prismaService.gender.findMany({
      orderBy: [{ id: 'asc' }],
    });
  }
}
