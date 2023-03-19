import { ITenderProviderSelection } from 'app/shared/model/microprovider/tender-provider-selection.model';

export interface ITenderProviderSelectionValidation {
  id?: number;
  validatorId?: number;
  approved?: boolean;
  justification?: any;
  selection?: ITenderProviderSelection;
}

export const defaultValue: Readonly<ITenderProviderSelectionValidation> = {
  approved: false,
};
