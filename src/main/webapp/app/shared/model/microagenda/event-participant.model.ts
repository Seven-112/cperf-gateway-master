import { IAgendaEvent } from 'app/shared/model/microagenda/agenda-event.model';

export interface IEventParticipant {
  id?: number;
  participantId?: number;
  name?: string;
  email?: string;
  required?: boolean;
  event?: IAgendaEvent;
}

export const defaultValue: Readonly<IEventParticipant> = {
  required: false,
};
