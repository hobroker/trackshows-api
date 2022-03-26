import { Request } from 'express';
import { User } from '../../user/entities';

export interface RequestWithUser extends Request {
  user: User;
}
