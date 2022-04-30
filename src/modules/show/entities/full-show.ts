import 'reflect-metadata';
import { Field, ObjectType } from '@nestjs/graphql';
import { PartialShow } from './partial-show';
import { ShowDetails } from './show-details';

@ObjectType()
export class FullShow extends PartialShow {
  @Field(() => ShowDetails)
  details: ShowDetails;
}
