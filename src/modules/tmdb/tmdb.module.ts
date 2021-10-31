import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '../http';
import { tmdbConfig } from './tmdb.config';
import { HttpConfigService } from './services/http-config.service';
import { TmdbTvService } from './services/tmdb-tv.service';

@Module({
  imports: [
    HttpModule.registerAsync({
      useClass: HttpConfigService,
      imports: [ConfigModule.forFeature(tmdbConfig)],
    }),
  ],
  exports: [],
  providers: [TmdbTvService],
})
export class TmdbModule {}
