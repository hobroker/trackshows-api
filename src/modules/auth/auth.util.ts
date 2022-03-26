export const createCookie = (
  name: string,
  { value = '', maxAge = '0', path = '/' } = {},
) => `${name}=${value}; Path=${path}; Max-Age=${maxAge}`;
