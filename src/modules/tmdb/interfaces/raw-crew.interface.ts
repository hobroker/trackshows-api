import { RawCreditInterface } from './raw-credit.interface';

export interface RawCrewInterface extends RawCreditInterface {
  department: string;
  job: string;
}
