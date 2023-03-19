import { IQCategory } from 'app/shared/model/qmanager/q-category.model';
import { IQueryClientType } from 'app/shared/model/qmanager/query-client-type.model';

export interface IQuery {
  id?: number;
  name?: string;
  processId?: number;
  editorId?: number;
  shared?: boolean;
  description?: any;
  ponctual?: boolean;
  category?: IQCategory;
  clientType?: IQueryClientType;
}

export const defaultValue: Readonly<IQuery> = {
  shared: false,
  ponctual: false,
};
