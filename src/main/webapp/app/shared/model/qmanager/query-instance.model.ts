import { Moment } from 'moment';
import { IQuery } from 'app/shared/model/qmanager/query.model';
import { IQueryClient } from 'app/shared/model/qmanager/query-client.model';
import { QueryInstanceStatus } from 'app/shared/model/enumerations/query-instance-status.model';

export interface IQueryInstance {
  id?: number;
  name?: any;
  startAt?: string;
  userId?: number;
  status?: QueryInstanceStatus;
  ponctual?: boolean;
  query?: IQuery;
  client?: IQueryClient;
}

export const defaultValue: Readonly<IQueryInstance> = {
  ponctual: false,
};
