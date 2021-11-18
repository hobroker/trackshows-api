import { EpisodeInterface } from './episode.interface';

export interface SeasonInterface {
  externalId: number;
  name: string;
  description: string;
  tallImage: string;
  number: number;
  episodes?: EpisodeInterface[];
}
