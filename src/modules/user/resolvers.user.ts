import 'reflect-metadata';
import {
  Args,
  Field,
  InputType,
  Mutation,
  Query,
  Resolver,
} from '@nestjs/graphql';
import { Inject } from '@nestjs/common';
import { User } from './entities/user';
import { UserService } from './user.service';

@InputType()
class UserCreateInput {
  @Field()
  email: string;

  @Field({ nullable: true })
  name: string;
}

@Resolver(User)
export class UserResolver {
  constructor(@Inject(UserService) private userService: UserService) {}

  @Mutation(() => User)
  async signupUser(@Args('data') data: UserCreateInput): Promise<User> {
    return this.userService.create(data);
  }

  @Query(() => [User], { nullable: true })
  async allUsers() {
    return this.userService.findMany();
  }
}
