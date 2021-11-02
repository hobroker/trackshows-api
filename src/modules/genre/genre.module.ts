import { Module } from '@nestjs/common';
import { GenreService } from './services';
import { GenreResolver } from './resolvers';
import { PrismaModule } from '../prisma';

@Module({
  imports: [PrismaModule],
  exports: [GenreService],
  providers: [GenreService, GenreResolver],
})
export class GenreModule {}
