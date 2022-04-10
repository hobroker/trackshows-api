import { join } from 'path';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import {
  ApolloServerPluginInlineTrace,
  ApolloServerPluginLandingPageLocalDefault,
} from 'apollo-server-core';
import { UserModule } from './modules/user/user.module';
import { appConfig } from './app.config';
import { TmdbModule } from './modules/tmdb';
import { ShowModule } from './modules/show';
import { GoogleModule } from './modules/google';
import HealthModule from './modules/health/health.module';
import { AuthModule } from './modules/auth';
import { PreferenceModule } from './modules/preference';
import { WatchlistModule } from './modules/watchlist/watchlist.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env', '.env.production'],
    }),
    ConfigModule.forFeature(appConfig),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      driver: ApolloDriver,
      playground: false,
      plugins: [
        ApolloServerPluginLandingPageLocalDefault(),
        ApolloServerPluginInlineTrace(),
      ],
      cors: {
        credentials: 'include',
        origin: ['http://localhost:3003'],
      },
    }),
    HealthModule,
    TmdbModule,
    UserModule,
    ShowModule,
    GoogleModule,
    AuthModule,
    HealthModule,
    PreferenceModule,
    WatchlistModule,
  ],
})
export class AppModule {}
