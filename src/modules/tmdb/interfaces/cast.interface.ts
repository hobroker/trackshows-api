import { CreditInterface } from './credit.interface';

export interface CastInterface extends CreditInterface {
  order: number;
  character: string;
}
