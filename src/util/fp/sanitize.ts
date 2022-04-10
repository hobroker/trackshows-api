import { compose, replace, trim } from 'ramda';

export const sanitize = compose(trim, replace(/\s+/g, ' '));
