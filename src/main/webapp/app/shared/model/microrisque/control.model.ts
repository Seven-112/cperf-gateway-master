import { IControlType } from 'app/shared/model/microrisque/control-type.model';
import { IControlMaturity } from 'app/shared/model/microrisque/control-maturity.model';
import { IRisk } from 'app/shared/model/microrisque/risk.model';

export interface IControl {
  id?: number;
  description?: string;
  validationRequired?: boolean;
  type?: IControlType;
  maturity?: IControlMaturity;
  risk?: IRisk;
}

export const defaultValue: Readonly<IControl> = {
  validationRequired: false,
};
