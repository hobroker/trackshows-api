export const mapPropToProp =
  (keyProp: string, valueProp: string) =>
  (array: any[]): { [x: string]: any } =>
    array.reduce(
      (acc, item) => ({
        ...acc,
        [item[keyProp]]: item[valueProp],
      }),
      {},
    );

export const mapExternalIdToId = mapPropToProp('externalId', 'id');
