import { Moment } from 'moment';
import { IConsommable } from 'app/shared/model/microstock/consommable.model';
import { IEquipement } from 'app/shared/model/microstock/equipement.model';
import { Etat } from 'app/shared/model/enumerations/etat.model';

export interface IChangement {
  id?: number;
  motif?: string;
  etat?: Etat;
  commentaire?: string;
  fileName?: string;
  fileId?: number;
  date?: string;
  consommable?: IConsommable;
  equipement?: IEquipement;
}

export const defaultValue: Readonly<IChangement> = {};
