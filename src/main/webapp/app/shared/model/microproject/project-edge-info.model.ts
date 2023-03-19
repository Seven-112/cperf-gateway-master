export interface IProjectEdgeInfo {
  id?: number;
  source?: string;
  target?: string;
  sourceHandle?: string;
  targetHandle?: string;
  processId?: number;
  valid?: boolean;
}

export const defaultValue: Readonly<IProjectEdgeInfo> = {
  valid: false,
};
