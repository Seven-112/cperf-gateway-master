import { ITypeindicator } from 'app/shared/model/typeindicator.model';
import { IObjectif } from 'app/shared/model/objectif.model';

export interface IIndicator {
  id?: number;
  expectedResultNumber?: number;
  resultUnity?: string;
  label?: string;
  question?: string;
  resultEditableByActor?: boolean;
  numberResult?: number;
  percentResult?: number;
  resultAppreciation?: string;
  averagePercentage?: number;
  ponderation?: number;
  typeindicator?: ITypeindicator;
  objectif?: IObjectif;
  parent?: IIndicator;
}

export const defaultValue: Readonly<IIndicator> = {
  resultEditableByActor: false,
};
