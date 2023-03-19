import { IPartenerCategory } from 'app/shared/model/micropartener/partener-category.model';

export interface IEvaluationCriteria {
  id?: number;
  name?: string;
  ponderation?: number;
  category?: IPartenerCategory;
}

export const defaultValue: Readonly<IEvaluationCriteria> = {};
