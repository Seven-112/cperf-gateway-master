import { IUser } from 'app/shared/model/user.model';
import { IEmployee } from 'app/shared/model/employee.model';

export interface IUserExtra {
  id?: number;
  photoId?: number;
  user?: IUser;
  employee?: IEmployee;
}

export const defaultValue: Readonly<IUserExtra> = {};
