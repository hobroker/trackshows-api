import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '../http';
import { tmdbConfig } from './tmdb.config';
import { HttpConfigService } from './services/http-config.service';
import * as services from './services';

@Module({
  imports: [
    ConfigModule.forFeature(tmdbConfig),
    HttpModule.registerAsync({
      useClass: HttpConfigService,
      imports: [ConfigModule.forFeature(tmdbConfig)],
    }),
  ],
  exports: [...Object.values(services)],
  providers: [...Object.values(services)],
})
export class TmdbModule {}
