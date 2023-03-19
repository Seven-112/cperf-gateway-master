import { IPartenerCategory } from 'app/shared/model/micropartener/partener-category.model';
import { FieldType } from 'app/shared/model/enumerations/field-type.model';

export interface IField {
  id?: number;
  label?: string;
  type?: FieldType;
  optinal?: boolean;
  requestFiles?: boolean;
  category?: IPartenerCategory;
}

export const defaultValue: Readonly<IField> = {
  optinal: false,
  requestFiles: false,
};
