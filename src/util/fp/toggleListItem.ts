import { compose, curry, equals, not } from 'rambda';

const toggleListItem = curry((value, list) =>
  list.includes(value)
    ? list.filter(compose(not, equals(value)))
    : [...list, value],
);

export { toggleListItem };
