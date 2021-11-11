export const mapExternalIdToId = (data) =>
  data.reduce(
    (acc, item) => ({
      ...acc,
      [item.externalId]: item.id,
    }),
    {},
  );
