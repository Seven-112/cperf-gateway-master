import { IPartenerCategory } from 'app/shared/model/micropartener/partener-category.model';

export interface IPartener {
  id?: number;
  email?: string;
  userId?: number;
  name?: string;
  category?: IPartenerCategory;
}

export const defaultValue: Readonly<IPartener> = {};
