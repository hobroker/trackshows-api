import { RawEpisodeInterface } from './raw-episode.interface';

export interface RawSeasonInterface {
  externalId: number;
  name: string;
  description?: string;
  tallImage: string;
  number: number;
  showId: number;
  episodes: RawEpisodeInterface[];
}
