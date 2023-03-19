import { IControl } from 'app/shared/model/microrisque/control.model';
import { IRiskType } from 'app/shared/model/microrisque/risk-type.model';

export interface IRisk {
  id?: number;
  label?: string;
  probability?: number;
  gravity?: number;
  cause?: string;
  controls?: IControl[];
  type?: IRiskType;
}

export const defaultValue: Readonly<IRisk> = {};
