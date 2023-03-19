import { DynamicFieldType } from 'app/shared/model/enumerations/dynamic-field-type.model';
import { DynamicFieldTag } from 'app/shared/model/enumerations/dynamic-field-tag.model';

export interface IDynamicField {
  id?: number;
  name?: string;
  type?: DynamicFieldType;
  required?: boolean;
  docId?: number;
  entityId?: number;
  tag?: DynamicFieldTag;
}

export const defaultValue: Readonly<IDynamicField> = {
  required: false,
};
