export interface ITableHeaderColumn {
  label: string;
  translationKeyPath?: string;
  minWidth?: number;
  align?: 'right' | 'left' | 'center';
  format?: (value: number) => string;
  searchFilter?: boolean;
  dataKey?: string;
  sortable?: boolean;
  sortDirection?: 'asc' | 'desc';
  inCollapse?: boolean;
}
