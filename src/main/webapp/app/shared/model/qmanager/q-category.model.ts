export interface IQCategory {
  id?: number;
  name?: string;
  description?: string;
  parent?: IQCategory;
}

export const defaultValue: Readonly<IQCategory> = {
  name: '',
  description: '',
  parent: null,
};
