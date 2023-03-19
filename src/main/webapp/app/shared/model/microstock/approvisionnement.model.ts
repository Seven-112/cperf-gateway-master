import { Moment } from 'moment';

export interface IApprovisionnement {
  id?: number;
  quantite?: number;
  motif?: string;
  dateAjout?: string;
  delaisAttente?: string;
}

export const defaultValue: Readonly<IApprovisionnement> = {};
