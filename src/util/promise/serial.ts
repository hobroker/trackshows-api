import { splitEvery } from 'rambda';
import { call } from '../fp';

export const serial = async (
  fns: (() => Promise<any>)[],
  parallel = Infinity,
) => {
  const results = [];
  const chunks = splitEvery(parallel, fns);

  for (const chunk of chunks) {
    const chunkResults = await Promise.all(chunk.map(call));

    results.push(...chunkResults);
  }

  return results;
};
