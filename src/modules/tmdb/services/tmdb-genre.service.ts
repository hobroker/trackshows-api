import { Inject, Injectable } from '@nestjs/common';
import { HttpService } from '../../http';

@Injectable()
export class TmdbGenreService {
  @Inject(HttpService)
  private httpService: HttpService;
}
