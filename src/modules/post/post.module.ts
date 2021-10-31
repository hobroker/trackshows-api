import { Module } from '@nestjs/common';
import { PostResolver } from './resolvers.post';
import { PrismaModule } from '../prisma';
import { PostService } from './post.service';

@Module({
  imports: [PrismaModule],
  exports: [PostService],
  providers: [PostService, PostResolver],
})
export class PostModule {}
