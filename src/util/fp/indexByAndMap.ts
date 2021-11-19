import { curry } from 'rambda';

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
