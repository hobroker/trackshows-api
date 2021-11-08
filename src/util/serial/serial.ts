export const serial = (fns: (() => Promise<any>)[]) =>
  fns.reduce(
    (acc, fn) =>
      acc.then((result) => fn().then(Array.prototype.concat.bind(result))),
    Promise.resolve([]),
  );
