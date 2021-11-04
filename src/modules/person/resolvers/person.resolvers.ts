import 'reflect-metadata';
import { Query, Resolver } from '@nestjs/graphql';
import { Inject } from '@nestjs/common';
import { PersonService } from '../services';
import { Person } from '../entities';

@Resolver(Person)
export class PersonResolver {
  @Inject(PersonService)
  private personService: PersonService;

  @Query(() => [Person], { nullable: true })
  persons() {
    return this.personService.list();
  }
}
