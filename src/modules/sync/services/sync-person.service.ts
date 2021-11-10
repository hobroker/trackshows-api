import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma';

@Injectable()
export class SyncPersonService {
  @Inject(PrismaService)
  private prismaService: PrismaService;

  async insertGenders(data) {
    return this.prismaService.gender.createMany({
      data,
      skipDuplicates: true,
    });
  }

  async deleteAllGenders() {
    return this.prismaService.gender.deleteMany();
  }

  async deleteAllPersons() {
    return this.prismaService.person.deleteMany();
  }
}
