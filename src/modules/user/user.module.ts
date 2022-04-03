import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma';
import { UserService } from './services';
import { UserResolver } from './resolvers';

@Module({
  imports: [PrismaModule],
  exports: [UserService],
  providers: [UserService, UserResolver],
})
export class UserModule {}
