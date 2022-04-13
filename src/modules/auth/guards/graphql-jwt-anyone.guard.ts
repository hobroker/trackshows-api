import { Injectable } from '@nestjs/common';
import { GraphqlJwtAuthGuard } from './graphql-jwt-auth.guard';

@Injectable()
export class GraphqlJwtAnyoneGuard extends GraphqlJwtAuthGuard {
  handleRequest(err, user) {
    if (err || !user) {
      return null;
    }

    return user;
  }
}
