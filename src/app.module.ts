import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { GraphQLModule } from '@nestjs/graphql';
import { PostModule } from './modules/post/post.module';
import { UserModule } from './modules/user/user.module';
import { appConfig } from './app.config';

@Module({
  imports: [
    ConfigModule.forFeature(appConfig),
    GraphQLModule.forRoot({
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      buildSchemaOptions: { dateScalarMode: 'timestamp' },
    }),
    PostModule,
    UserModule,
  ],
  providers: [],
})
export class AppModule {}
