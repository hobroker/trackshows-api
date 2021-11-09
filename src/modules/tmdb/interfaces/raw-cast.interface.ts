import { RawPersonInterface } from './raw-person.interface';

export interface RawCastInterface {
  showId: number;
  person: RawPersonInterface;
  order: number;
  character: string;
}
