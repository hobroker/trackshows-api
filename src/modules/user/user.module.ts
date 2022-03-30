import { Module } from '@nestjs/common';
import { UserService } from './services';
import { PrismaModule } from '../prisma';
import { UserResolver } from './resolvers';

@Module({
  imports: [PrismaModule],
  exports: [UserService],
  providers: [UserService, UserResolver],
})
export class UserModule {}
