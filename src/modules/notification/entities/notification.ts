import 'reflect-metadata';
import { Field, HideField, Int, ObjectType } from '@nestjs/graphql';
import { Episode } from '../../show/entities/episode';

@ObjectType()
export class Notification {
  @Field(() => Int)
  id: number;

  @Field(() => Episode)
  episode?: Episode;

  @Field({ nullable: true })
  isRead: boolean;

  @HideField()
  episodeId: number;
}
