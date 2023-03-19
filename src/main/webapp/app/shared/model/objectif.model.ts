import { Moment } from 'moment';
import { ITypeObjectif } from 'app/shared/model/type-objectif.model';
import { IFonction } from 'app/shared/model/fonction.model';
import { IDepartment } from 'app/shared/model/department.model';
import { IEmployee } from 'app/shared/model/employee.model';
import { ObjectifCategorie } from 'app/shared/model/enumerations/objectif-categorie.model';

export interface IObjectif {
  id?: number;
  name?: string;
  delay?: number;
  createdAt?: string;
  categorie?: ObjectifCategorie;
  averagePercentage?: number;
  ponderation?: number;
  realized?: boolean;
  typeObjectif?: ITypeObjectif;
  fonction?: IFonction;
  department?: IDepartment;
  employee?: IEmployee;
  parent?: IObjectif;
}

export const defaultValue: Readonly<IObjectif> = {
  realized: false,
};
