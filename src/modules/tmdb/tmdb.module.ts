import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '../http';
import { tmdbConfig } from './tmdb.config';
import { HttpConfigService } from './services/http-config.service';
import { TmdbGenreService, TmdbTvService } from './services';
import { PrismaModule } from '../prisma';

@Module({
  imports: [
    PrismaModule,
    HttpModule.registerAsync({
      useClass: HttpConfigService,
      imports: [ConfigModule.forFeature(tmdbConfig)],
    }),
  ],
  exports: [TmdbGenreService],
  providers: [TmdbTvService, TmdbGenreService],
})
export class TmdbModule {}
