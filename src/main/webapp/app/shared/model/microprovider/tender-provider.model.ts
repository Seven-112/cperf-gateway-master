export interface ITenderProvider {
  id?: number;
  tenderId?: number;
  providerId?: number;
  providerEmail?: string;
  providerName?: string;
  valid?: boolean;
}

export const defaultValue: Readonly<ITenderProvider> = {
  valid: false,
};
