import 'reflect-metadata';
import { registerEnumType } from '@nestjs/graphql';

export enum Status {
  None,
  InWatchlist,
  StoppedWatching,
  FinishedWatching,
}

registerEnumType(Status, {
  name: 'Status',
});
