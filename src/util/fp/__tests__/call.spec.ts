import { call } from '../call';

describe('call', () => {
  test('should call the function with provided arguments', () => {
    const fn = jest.fn();

    call(fn, 1, 2, 3);

    expect(fn).toHaveBeenCalledWith(1, 2, 3);
  });
});
