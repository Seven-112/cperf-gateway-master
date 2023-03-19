export interface IChrono {
  nbYears?: number;
  nbMonths?: number;
  nbDays?: number;
  nbHours?: number;
  nbMinutes?: number;
  nbSeconds?: number;
  exceeced?: boolean;
}

export const defaultValue: Readonly<IChrono> = {
  nbYears: 0,
  nbMonths: 0,
  nbDays: 0,
  nbHours: 0,
  nbMinutes: 0,
  nbSeconds: 0,
  exceeced: false,
};
