export interface RawPersonInterface {
  externalId: number;
  name: string;
  description?: string;
  image: string;
  birthday: Date;
  deathday: Date | null;
  genderId: number;
}
