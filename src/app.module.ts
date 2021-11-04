import { join } from 'path';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { PostModule } from './modules/post/post.module';
import { UserModule } from './modules/user/user.module';
import { appConfig } from './app.config';
import { TmdbModule } from './modules/tmdb';
import { GenreModule } from './modules/genre';
import { PersonModule } from './modules/person';
import { KeywordModule } from './modules/keyword';

@Module({
  imports: [
    ConfigModule.forFeature(appConfig),
    GraphQLModule.forRoot({
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      buildSchemaOptions: { dateScalarMode: 'timestamp' },
    }),
    TmdbModule,
    PostModule,
    UserModule,
    GenreModule,
    PersonModule,
    KeywordModule,
  ],
})
export class AppModule {}
