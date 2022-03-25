import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { googleConfig } from './google.config';
import { GoogleController } from './controllers';
import { GoogleService } from './services';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth';

@Module({
  imports: [ConfigModule.forFeature(googleConfig), UserModule, AuthModule],
  providers: [GoogleService],
  controllers: [GoogleController],
})
export class GoogleModule {}
