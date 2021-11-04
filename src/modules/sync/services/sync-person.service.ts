import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma';
import { TmdbPersonService } from '../../tmdb';

@Injectable()
export class SyncPersonService {
  @Inject(TmdbPersonService)
  private tmdbPersonService: TmdbPersonService;

  @Inject(PrismaService)
  private prismaService: PrismaService;

  async sync(personId: number) {
    const { gender, ...person } = await this.tmdbPersonService.getDetails(
      personId,
    );

    return this.prismaService.person.create({
      data: {
        ...person,
        gender: {
          connect: gender,
        },
      },
    });
  }
}
