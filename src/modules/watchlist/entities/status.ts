import 'reflect-metadata';
import { registerEnumType } from '@nestjs/graphql';

export enum Status {
  None,
  InWatchlist,
  StoppedWatching,
}

registerEnumType(Status, {
  name: 'Status',
});
