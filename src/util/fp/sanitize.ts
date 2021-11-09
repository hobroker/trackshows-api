import { compose, replace } from 'rambda';

export const sanitize = compose<string, string, string>(
  replace(/\s+/g, ' '),
  replace(/\n/g, ' '),
);
