import { Request } from 'express';
import { User } from '../../user/entities';

export interface RequestWithAnyoneInterface extends Request {
  user: User | null;
}
