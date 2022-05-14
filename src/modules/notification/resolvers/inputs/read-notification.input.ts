import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class ReadNotificationInput {
  @Field(() => Int)
  notificationId: number;
}
