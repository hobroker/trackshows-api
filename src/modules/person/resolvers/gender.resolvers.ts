import 'reflect-metadata';
import { Query, Resolver } from '@nestjs/graphql';
import { Inject } from '@nestjs/common';
import { GenderService } from '../services';
import { Gender } from '../entities';

@Resolver(Gender)
export class GenderResolver {
  @Inject(GenderService)
  private genderService: GenderService;

  @Query(() => [Gender], { nullable: true })
  genders() {
    return this.genderService.list();
  }
}
