import { RawPersonInterface } from './raw-person.interface';

export interface RawCrewInterface {
  person: RawPersonInterface;
  department: string;
  job: string;
}
