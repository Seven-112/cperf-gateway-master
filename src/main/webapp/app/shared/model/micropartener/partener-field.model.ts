import { IField } from 'app/shared/model/micropartener/field.model';
import { IPartener } from 'app/shared/model/micropartener/partener.model';

export interface IPartenerField {
  id?: number;
  val?: string;
  visible?: boolean;
  field?: IField;
  partener?: IPartener;
}

export const defaultValue: Readonly<IPartenerField> = {
  visible: false,
};
