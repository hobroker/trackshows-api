import { RawPersonInterface } from './raw-person.interface';

export interface RawCrewInterface {
  showId: number;
  person: RawPersonInterface;
  department: string;
  job: string;
}
