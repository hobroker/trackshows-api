import { Field, InputType, Int } from '@nestjs/graphql';
import { Status } from '../../entities';

@InputType()
export class ShowWithStatusInput {
  @Field(() => Int)
  showId: number;

  @Field(() => Status)
  status: Status;
}
