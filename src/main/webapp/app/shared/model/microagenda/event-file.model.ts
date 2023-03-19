import { IAgendaEvent } from 'app/shared/model/microagenda/agenda-event.model';

export interface IEventFile {
  id?: number;
  fileId?: number;
  fileName?: string;
  event?: IAgendaEvent;
}

export const defaultValue: Readonly<IEventFile> = {};
