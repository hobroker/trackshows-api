import { join } from 'path';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { UserModule } from './modules/user/user.module';
import { appConfig } from './app.config';
import { TmdbModule } from './modules/tmdb';
import { ShowModule } from './modules/show';
import { GoogleModule } from './modules/google';
import HealthModule from './modules/health/health.module';
import { AuthModule } from './modules/auth';
import { Timestamp } from './util/scalars';
import { PreferenceModule } from './modules/preference';

@Module({
  imports: [
    ConfigModule.forFeature(appConfig),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      buildSchemaOptions: { dateScalarMode: 'timestamp' },
      driver: ApolloDriver,
      cors: {
        credentials: true,
        origin: true,
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
  ],
  providers: [Timestamp],
})
export class AppModule {}
