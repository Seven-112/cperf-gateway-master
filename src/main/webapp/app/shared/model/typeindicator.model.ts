export interface ITypeindicator {
  id?: number;
  name?: string;
  measurable?: boolean;
  valid?: boolean;
}

export const defaultValue: Readonly<ITypeindicator> = {
  measurable: false,
  valid: false,
};
