import { ITender } from 'app/shared/model/microprovider/tender.model';

export interface ITenderFile {
  id?: number;
  name?: string;
  fileId?: number;
  tender?: ITender;
}

export const defaultValue: Readonly<ITenderFile> = {};
