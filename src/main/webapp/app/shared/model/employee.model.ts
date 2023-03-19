import { Moment } from 'moment';
import { IDepartment } from 'app/shared/model/department.model';
import { IFonction } from 'app/shared/model/fonction.model';

export interface IEmployee {
  id?: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  salary?: number;
  hireDate?: string;
  managerId?: number;
  path?: any;
  photoId?: number;
  photoName?: string;
  department?: IDepartment;
  fonction?: IFonction;
}

export const defaultValue: Readonly<IEmployee> = {};
