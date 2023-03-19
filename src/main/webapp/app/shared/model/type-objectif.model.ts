import { ObjectifTypeEvaluationUnity } from 'app/shared/model/enumerations/objectif-type-evaluation-unity.model';

export interface ITypeObjectif {
  id?: number;
  name?: string;
  evalutationUnity?: ObjectifTypeEvaluationUnity;
  valid?: boolean;
}

export const defaultValue: Readonly<ITypeObjectif> = {
  valid: false,
};
