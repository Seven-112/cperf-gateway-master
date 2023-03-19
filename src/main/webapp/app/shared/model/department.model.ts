import { IEmployee } from 'app/shared/model/employee.model';

export interface IDepartment {
  id?: number;
  name?: string;
  employees?: IEmployee[];
}

export const defaultValue: Readonly<IDepartment> = {};
