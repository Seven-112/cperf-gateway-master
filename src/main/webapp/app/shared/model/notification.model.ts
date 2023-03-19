import { Moment } from 'moment';
import { NotifType } from 'app/shared/model/enumerations/notif-type.model';

export interface INotification {
  id?: number;
  title?: string;
  note?: any;
  type?: NotifType;
  link?: string;
  seen?: boolean;
  blankTarget?: boolean;
  senderId?: number;
  targetId?: number;
  tag?: string;
  createdAt?: string;
}

export const defaultValue: Readonly<INotification> = {
  seen: false,
  blankTarget: false,
};
