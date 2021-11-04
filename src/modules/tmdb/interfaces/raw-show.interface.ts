import { RawGenreInterface } from './raw-genre.interface';
import { RawStatusInterface } from './raw-status.interface';
import { RawSeasonInterface } from './raw-season.interface';
import { RawKeywordInterface } from './raw-keyword.interface';

export interface RawShowInterface {
  externalId: number;
  name: string;
  description?: string;
  wideImage: string;
  tallImage: string;
  episodeRuntime: number;
  isInProduction: boolean;
  status: RawStatusInterface;
  genres: RawGenreInterface[];
  seasons: RawSeasonInterface[];
  keywords: RawKeywordInterface[];
}
