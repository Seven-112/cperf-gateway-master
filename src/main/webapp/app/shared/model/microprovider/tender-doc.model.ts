import { ITender } from 'app/shared/model/microprovider/tender.model';

export interface ITenderDoc {
  id?: number;
  description?: string;
  optional?: boolean;
  tender?: ITender;
}

export const defaultValue: Readonly<ITenderDoc> = {
  optional: false,
};
