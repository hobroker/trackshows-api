import { curry } from 'ramda';

export const indexByAndMap = curry(
  (indexByFn, mapFn, list): { [x: string]: any } =>
    list.reduce(
      (acc, item) => ({
        ...acc,
        [indexByFn(item)]: mapFn(item),
      }),
      {},
    ),
);
