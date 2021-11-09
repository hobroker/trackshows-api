export interface RawEpisodeInterface {
  externalId: number;
  name: string;
  description: string | null;
  wideImage: string | null;
  airDate: Date;
  number: number;
  seasonNumber: number;
}
