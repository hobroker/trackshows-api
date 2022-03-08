import { sanitize } from '../sanitize';

describe('sanitize', () => {
  test('should remove multiple spaces', () => {
    expect(sanitize('something  ')).toBe('something');
  });
  test('should remove new lines', () => {
    expect(sanitize('one\ntwo\nthree')).toBe('one two three');
  });
});
