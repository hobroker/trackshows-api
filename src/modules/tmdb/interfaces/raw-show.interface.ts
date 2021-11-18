export interface RawPartialShowInterface {
  externalId: number;
  name: string;
  description: string;
  wideImage: string;
  tallImage: string;
  externalGenresIds?: number[];
}

export interface RawShowInterface extends RawPartialShowInterface {
  episodeRuntime: number;
  isInProduction: boolean;
  status: string;
}
