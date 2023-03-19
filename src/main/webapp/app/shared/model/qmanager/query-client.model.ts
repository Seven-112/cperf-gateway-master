import { IQueryClientType } from 'app/shared/model/qmanager/query-client-type.model';

export interface IQueryClient {
  id?: number;
  name?: string;
  accountNum?: string;
  disabled?: boolean;
  type?: IQueryClientType;
}

export const defaultValue: Readonly<IQueryClient> = {
  disabled: false,
};
