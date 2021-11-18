export interface PersonInterface {
  externalId: number;
  name: string;
  description: string | null;
  image: string | null;
  birthday: Date | null;
  deathday: Date | null;
  externalGenderId: number;
}

export interface GenderInterface {
  externalId: number;
}
