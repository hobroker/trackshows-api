import { curry } from 'rambda';

export const mapObject = curry((fn, object: { [x: string]: any }) =>
  Object.entries(object).reduce(
    (acc, [key, value]) => ({
      ...acc,
      [key]: fn(value, key),
    }),
    {},
  ),
);
