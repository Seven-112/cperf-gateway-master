import { Moment } from 'moment';
import { IChangement } from 'app/shared/model/microstock/changement.model';
import { IEngeneering } from 'app/shared/model/microstock/engeneering.model';

export interface IEquipement {
  id?: number;
  nom?: string;
  description?: string;
  dateAjout?: string;
  dateRemplacement?: string;
  changements?: IChangement[];
  engeneerings?: IEngeneering[];
  composantDe?: IEquipement;
}

export const defaultValue: Readonly<IEquipement> = {};
