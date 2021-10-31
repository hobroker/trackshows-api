import { join } from 'path';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { PostModule } from './modules/post/post.module';
import { UserModule } from './modules/user/user.module';
import { appConfig } from './app.config';
import { TmdbModule } from './modules/tmdb';
import { GenreModule } from './modules/genre';

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
  ],
})
export class AppModule {}
