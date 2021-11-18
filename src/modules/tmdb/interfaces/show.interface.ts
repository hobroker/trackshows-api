export interface PartialShowInterface {
  externalId: number;
  name: string;
  description: string;
  wideImage: string;
  tallImage: string;
  externalGenresIds?: number[];
}

export interface ShowDetailsInterface extends PartialShowInterface {
  episodeRuntime: number;
  isInProduction: boolean;
  status: string;
}
