import { IPartenerCategory } from 'app/shared/model/micropartener/partener-category.model';

export interface IPartenerCategoryValidator {
  id?: number;
  userId?: number;
  category?: IPartenerCategory;
}

export const defaultValue: Readonly<IPartenerCategoryValidator> = {};
