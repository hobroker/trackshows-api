import { prop } from 'rambda';
import { indexByAndMap } from '../indexByAndMap';

describe('indexByAndMap', () => {
  test('should return the expected object', () => {
    expect(
      indexByAndMap(prop('id'), prop('name'), [
        { id: 1, name: 'foo' },
        { id: 2, name: 'bar' },
        { id: 3, name: 'baz' },
      ]),
    ).toEqual({
      1: 'foo',
      2: 'bar',
      3: 'baz',
    });
  });
});
