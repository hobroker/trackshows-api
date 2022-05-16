import { join } from 'path';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import {
  ApolloServerPluginInlineTrace,
  ApolloServerPluginLandingPageLocalDefault,
} from 'apollo-server-core';
import { UserModule } from './modules/user';
import { appConfig } from './app.config';
import { TmdbModule } from './modules/tmdb';
import { ShowModule } from './modules/show';
import { GoogleModule } from './modules/google';
import { HealthModule } from './modules/health';
import { AuthModule, AuthService } from './modules/auth';
import { PreferenceModule } from './modules/preference';
import { WatchlistModule } from './modules/watchlist';
import { ReviewModule } from './modules/review';
import { StatsModule } from './modules/stats';
import { SearchModule } from './modules/search';
import { NotificationModule } from './modules/notification';
import { CORS_ORIGINS } from './app.constants';
import { getCookie } from './util/cookie';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env', '.env.production'],
    }),
    ConfigModule.forFeature(appConfig),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [AuthModule],
      inject: [AuthService],
      useFactory: async (authService: AuthService) => ({
        autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
        playground: false,
        // installSubscriptionHandlers: true,
        async context({ extra }) {
          let user = null;

          if (extra) {
            const authToken = getCookie(
              extra.request.headers.cookie,
              'Authentication',
            );

            user = await authService
              .getUserFromJwtToken(authToken)
              .catch(() => null);
          }

          return { user };
        },
        subscriptions: {
          'graphql-ws': {
            path: '/subscriptions',
          },
        },
        plugins: [
          ApolloServerPluginLandingPageLocalDefault(),
          ApolloServerPluginInlineTrace(),
        ],
        cors: {
          credentials: 'include',
          origin: CORS_ORIGINS,
        },
      }),
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
    ReviewModule,
    StatsModule,
    SearchModule,
    NotificationModule,
  ],
})
export class AppModule {}
