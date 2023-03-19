export interface IEventExeption {
  id?: number;
  eventId?: number;
  hour?: number;
  month?: number;
  year?: number;
  dateOfMonth?: number;
}

export const defaultValue: Readonly<IEventExeption> = {};
