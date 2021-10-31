import { Inject, Injectable } from '@nestjs/common';
import { HttpService } from '../../http';

@Injectable()
export class TmdbTvService {
  @Inject(HttpService)
  private httpService: HttpService;
}
