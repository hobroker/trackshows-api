import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma';

@Injectable()
export class PersonService {
  @Inject(PrismaService)
  private prismaService: PrismaService;

  async list() {
    return this.prismaService.person.findMany({
      orderBy: [{ name: 'asc' }],
    });
  }
}
