import { GenreInterface } from './genre.interface';
import { KeywordInterface } from './keyword.interface';
import { SeasonInterface } from './season.interface';
import { StatusInterface } from './status.interface';

export interface PartialShowInterface {
  externalId: number;
  name: string;
  description: string;
  wideImage: string;
  tallImage: string;
}

export interface ShowDetailsInterface {
  externalId: number;
  episodeRuntime: number;
  isInProduction: boolean;
  status: StatusInterface;
  genres: GenreInterface[];
  seasons: SeasonInterface[];
  keywords: KeywordInterface[];
}
