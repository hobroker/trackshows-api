import { toDate } from '../toDate';

describe('toDate', () => {
  test('should return null if falsy', () => {
    expect(toDate('')).toBe(null);
    expect(toDate(undefined)).toBe(null);
    expect(toDate(null)).toBe(null);
  });
  test('should return a Date object', () => {
    expect(toDate('20-01-2020').getTime()).toBe(
      new Date('20-01-2020').getTime(),
    );
  });
});
