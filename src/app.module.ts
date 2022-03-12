import { join } from 'path';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { UserModule } from './modules/user/user.module';
import { appConfig } from './app.config';
import { TmdbModule } from './modules/tmdb';
import { PersonModule } from './modules/person';
import { ShowModule } from './modules/show';

@Module({
  imports: [
    ConfigModule.forFeature(appConfig),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      buildSchemaOptions: { dateScalarMode: 'timestamp' },
      driver: ApolloDriver,
    }),
    TmdbModule,
    UserModule,
    PersonModule,
    ShowModule,
  ],
})
export class AppModule {}
