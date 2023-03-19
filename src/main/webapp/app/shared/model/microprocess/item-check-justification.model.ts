import { Moment } from 'moment';

export interface IItemCheckJustification {
  id?: number;
  checked?: boolean;
  taskItemId?: number;
  justification?: any;
  date?: string;
}

export const defaultValue: Readonly<IItemCheckJustification> = {
  checked: false,
};
