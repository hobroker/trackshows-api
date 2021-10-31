import { Injectable } from '@nestjs/common';
import { HttpService } from '../../http';

@Injectable()
export class TmdbTvService {
  constructor(private httpService: HttpService) {}
}
