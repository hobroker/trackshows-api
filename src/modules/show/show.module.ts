import { Module } from '@nestjs/common';
import { GenreService, ShowService } from './services';
import { GenreResolver, ShowResolver } from './resolvers';
import { PrismaModule } from '../prisma';

@Module({
  imports: [PrismaModule],
  exports: [ShowService, GenreService],
  providers: [ShowService, ShowResolver, GenreService, GenreResolver],
})
export class ShowModule {}
