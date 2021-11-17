import { splitEvery } from 'rambda';
import { call } from '../fp';

export async function serial<T>(
  fns: (() => Promise<T>)[],
  parallel = Infinity,
): Promise<T[]> {
  const results = [];
  const chunks = splitEvery(parallel, fns);

  for (const chunk of chunks) {
    const chunkResults = await Promise.all(chunk.map(call));

    results.push(...chunkResults);
  }

  return results;
}
