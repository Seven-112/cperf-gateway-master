import { PartenerRole } from 'app/shared/model/enumerations/partener-role.model';

export interface IPartenerCategory {
  id?: number;
  name?: string;
  role?: PartenerRole;
  noteMin?: number;
  noteMax?: number;
  parent?: IPartenerCategory;
}

export const defaultValue: Readonly<IPartenerCategory> = {};
