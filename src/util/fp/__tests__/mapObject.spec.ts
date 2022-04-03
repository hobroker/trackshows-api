import { mapObject } from '../mapObject';

describe('mapObject', () => {
  test('should return the expected object', () => {
    expect(
      mapObject((value, key) => key + value, {
        a: 1,
        b: 2,
        c: 3,
      }),
    ).toEqual({
      a: 'a1',
      b: 'b2',
      c: 'c3',
    });
  });
});
