import { compose, curry, equals, not } from 'ramda';

const toggleListItem = curry((value, list) =>
  list.includes(value)
    ? list.filter(compose(not, equals(value)))
    : [...list, value],
);

export { toggleListItem };
