import { compose, replace, trim } from 'rambda';

export const sanitize = compose(trim, replace(/\s+/g, ' '));
