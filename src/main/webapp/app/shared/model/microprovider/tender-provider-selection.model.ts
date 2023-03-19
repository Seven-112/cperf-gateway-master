import { ITender } from 'app/shared/model/microprovider/tender.model';

export interface ITenderProviderSelection {
  id?: number;
  providerId?: number;
  valid?: boolean;
  userId?: number;
  validated?: boolean;
  tender?: ITender;
}

export const defaultValue: Readonly<ITenderProviderSelection> = {
  valid: false,
  validated: false,
};
