import { IEquipement } from 'app/shared/model/microstock/equipement.model';

export interface IEngeneering {
  id?: number;
  expertise?: string;
  commentaire?: string;
  equipement?: IEquipement;
}

export const defaultValue: Readonly<IEngeneering> = {};
