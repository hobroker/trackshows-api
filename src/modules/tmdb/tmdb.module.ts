import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '../http';
import { tmdbConfig } from './tmdb.config';
import { HttpConfigService } from './services/http-config.service';
import { TmdbGenreService, TmdbTvService, TmdbPersonService } from './services';
import { PrismaModule } from '../prisma';

@Module({
  imports: [
    PrismaModule,
    HttpModule.registerAsync({
      useClass: HttpConfigService,
      imports: [ConfigModule.forFeature(tmdbConfig)],
    }),
  ],
  exports: [TmdbTvService, TmdbGenreService, TmdbPersonService],
  providers: [TmdbTvService, TmdbGenreService, TmdbPersonService],
})
export class TmdbModule {}
