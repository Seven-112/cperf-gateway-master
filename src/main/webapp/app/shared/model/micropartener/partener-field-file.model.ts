import { IPartenerField } from 'app/shared/model/micropartener/partener-field.model';

export interface IPartenerFieldFile {
  id?: number;
  fileId?: number;
  fileName?: string;
  partenerField?: IPartenerField;
}

export const defaultValue: Readonly<IPartenerFieldFile> = {};
