import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '../http';
import { PrismaModule } from '../prisma';
import { tmdbConfig } from './tmdb.config';
import { HttpConfigService } from './services/http-config.service';
import {
  TmdbGenreService,
  TmdbShowService,
  TmdbPersonService,
} from './services';

@Module({
  imports: [
    PrismaModule,
    ConfigModule.forFeature(tmdbConfig),
    HttpModule.registerAsync({
      useClass: HttpConfigService,
      imports: [ConfigModule.forFeature(tmdbConfig)],
    }),
  ],
  exports: [TmdbShowService, TmdbGenreService, TmdbPersonService],
  providers: [TmdbShowService, TmdbGenreService, TmdbPersonService],
})
export class TmdbModule {}
