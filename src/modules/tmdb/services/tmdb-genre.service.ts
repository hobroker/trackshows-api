import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma';
import { HttpService } from '../../http';

@Injectable()
export class TmdbGenreService {
  @Inject(HttpService)
  private httpService: HttpService;

  @Inject(PrismaService)
  private prismaService: PrismaService;

  async list() {
    const { data } = await this.httpService.get('/genre/tv/list');
    const { genres } = data;

    return genres;
  }
}
