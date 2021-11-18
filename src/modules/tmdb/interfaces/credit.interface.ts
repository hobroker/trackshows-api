export interface CreditInterface {
  externalId: number;
  personId?: number;
  showId?: number;
}

export interface CastInterface extends CreditInterface {
  order: number;
  character: string;
}

export interface CrewInterface extends CreditInterface {
  department: string;
  job: string;
}
