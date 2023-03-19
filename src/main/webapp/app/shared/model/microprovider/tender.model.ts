import { Moment } from 'moment';

export interface ITender {
  id?: number;
  object?: string;
  userId?: number;
  targetCategoryId?: number;
  createdAt?: string;
  expireAt?: string;
  content?: any;
  executionDeleyRequired?: boolean;
  closed?: boolean;
  published?: boolean;
  concernedProviderIds?: any;
}

export const defaultValue: Readonly<ITender> = {
  executionDeleyRequired: false,
  closed: false,
  published: false,
};
