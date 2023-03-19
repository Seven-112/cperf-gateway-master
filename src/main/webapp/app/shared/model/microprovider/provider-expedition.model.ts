import { Moment } from 'moment';
import { ITenderAnswer } from 'app/shared/model/microprovider/tender-answer.model';

export interface IProviderExpedition {
  id?: number;
  countryOrigin?: string;
  departureDate?: string;
  portArivalDate?: string;
  siteDeliveryDate?: string;
  readOnly?: boolean;
  previewDepatureDate?: string;
  previewPortArivalDate?: string;
  previewSiteDeliveryDate?: string;
  transporter?: string;
  answer?: ITenderAnswer;
}

export const defaultValue: Readonly<IProviderExpedition> = {
  readOnly: false,
};
