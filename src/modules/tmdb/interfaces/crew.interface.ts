import { CreditInterface } from './credit.interface';

export interface CrewInterface extends CreditInterface {
  department: string;
  job: string;
}
