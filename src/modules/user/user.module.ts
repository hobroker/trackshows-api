import { Module } from '@nestjs/common';
import { UserResolver } from './resolvers.user';
import { UserService } from './user.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  exports: [UserService],
  providers: [UserService, UserResolver],
})
export class UserModule {}
