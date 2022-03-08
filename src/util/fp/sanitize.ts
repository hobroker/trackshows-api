import { compose, replace, trim } from 'rambda';

export const sanitize = compose<string, string, string, string>(
  trim,
  replace(/\s+/g, ' '),
  replace(/\n/g, ' '),
);
