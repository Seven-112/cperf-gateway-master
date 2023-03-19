export interface IPrivilege {
  id?: number;
  constrained?: boolean;
  authority?: string;
  entity?: string;
  action?: string;
}

export const defaultValue: Readonly<IPrivilege> = {
  constrained: false,
};
