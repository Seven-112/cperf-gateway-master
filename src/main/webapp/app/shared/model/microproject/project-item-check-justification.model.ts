import { Moment } from 'moment';

export interface IProjectItemCheckJustification {
  id?: number;
  checked?: boolean;
  taskItemId?: number;
  justification?: any;
  dateAndTime?: string;
}

export const defaultValue: Readonly<IProjectItemCheckJustification> = {
  checked: false,
};
