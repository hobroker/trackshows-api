import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Post } from './entities/post';
import { Prisma } from '@prisma/client';

type PostCreate = {
  title: string;
  content: string;
};

@Injectable()
export class PostService {
  constructor(
    @Inject(forwardRef(() => PrismaService))
    private readonly prismaService: PrismaService,
  ) {}

  findMany(search: string, skip: number, take: number): Promise<Post[]> {
    console.log('search', search);
    return this.prismaService.post.findMany({
      where: {
        published: true,
        ...(search && {
          OR: [
            { title: { contains: search } },
            { content: { contains: search } },
          ],
        }),
      },
      take: take || undefined,
      skip: skip || undefined,
    });
  }

  findById(id): Promise<Post> {
    return this.prismaService.post.findUnique({
      where: { id },
    });
  }

  create(data: PostCreate, authorEmail: string): Promise<Post> {
    return this.prismaService.post.create({
      data: {
        title: data.title,
        content: data.content,
        author: {
          connect: { email: authorEmail },
        },
      },
    });
  }

  delete(id: number): Promise<Post | null> {
    return this.prismaService.post.delete({
      where: {
        id: id,
      },
    });
  }
}
