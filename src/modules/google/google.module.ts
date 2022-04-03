import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth';
import { googleConfig } from './google.config';
import { GoogleService } from './services';
import { GoogleResolver } from './resolvers';

@Module({
  imports: [ConfigModule.forFeature(googleConfig), UserModule, AuthModule],
  providers: [GoogleService, GoogleResolver],
})
export class GoogleModule {}
