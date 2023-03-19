import { Moment } from 'moment';
import { IChangement } from 'app/shared/model/microstock/changement.model';

export interface IConsommable {
  id?: number;
  nom?: string;
  description?: string;
  dateAjout?: string;
  dateRemplacement?: string;
  quantite?: number;
  changements?: IChangement[];
  composantDe?: IConsommable;
}

export const defaultValue: Readonly<IConsommable> = {};
