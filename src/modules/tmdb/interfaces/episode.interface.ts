export interface EpisodeInterface {
  externalId: number;
  seasonId: number;
  name: string;
  description: string | null;
  wideImage: string | null;
  airDate: Date;
  number: number;
  seasonNumber: number;
}
