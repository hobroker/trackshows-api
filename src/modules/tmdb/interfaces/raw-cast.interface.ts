import { RawCreditInterface } from './raw-credit.interface';

export interface RawCastInterface extends RawCreditInterface {
  order: number;
  character: string;
}
