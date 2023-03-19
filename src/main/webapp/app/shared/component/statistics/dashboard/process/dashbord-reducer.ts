import { defaultValue, IKPI } from 'app/shared/model/microprocess/kpi.model';
import { PerfIndicatorUnity } from 'app/shared/model/perf-indicator.model';
import { FAILURE, REQUEST, SUCCESS } from 'app/shared/reducers/action-type.util';
import { convertDateFromServer } from 'app/shared/util/date-utils';
import { API_URIS } from 'app/shared/util/helpers';
import axios from 'axios';
import { DEFAULT_PERF_INDICATOR_UNITY } from '../unity-selector';

export const ACTION_TYPES = {
  FETCH_PROCESS_KPI: 'dashboard/FIND_PROCESS_KPI',
  FETCH_LIST_PROCESS_KPI: 'dashboard/LIST_PROCESS_KPI',
};

const initialState = {
  entity: defaultValue,
  entities: [] as ReadonlyArray<IKPI>,
  listLoading: false,
  loading: false,
};

export type ProcessKpiState = Readonly<typeof initialState>;

export default (state: ProcessKpiState = initialState, action): ProcessKpiState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_PROCESS_KPI):
      return {
        ...state,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.FETCH_LIST_PROCESS_KPI):
      return {
        ...state,
        listLoading: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_PROCESS_KPI):
      return {
        ...state,
        loading: false,
      };
    case FAILURE(ACTION_TYPES.FETCH_LIST_PROCESS_KPI):
      return {
        ...state,
        listLoading: false,
      };
    case SUCCESS(ACTION_TYPES.FETCH_PROCESS_KPI):
      return {
        ...state,
        entity: action.payload.data,
        loading: false,
      };
    case SUCCESS(ACTION_TYPES.FETCH_LIST_PROCESS_KPI):
      return {
        ...state,
        entities: [...action.payload.data],
        listLoading: false,
      };
    default:
      return state;
  }
};

export const getOne = (userIds: number[], dte?: Date) => {
  const strDate = convertDateFromServer(dte == null ? new Date() : dte);
  const requestUrl = `${API_URIS.processStatApiUri}/find?userIds=${[...userIds]}&date=${strDate}`;
  return {
    type: ACTION_TYPES.FETCH_PROCESS_KPI,
    payload: axios.get<IKPI>(requestUrl),
  };
};

export const getAll = (userIds?: number[], minDate?: Date, maxDate?: Date, unity?: PerfIndicatorUnity) => {
  if (unity === undefined || unity === null) unity = DEFAULT_PERF_INDICATOR_UNITY;
  let apiUri = `${API_URIS.processStatApiUri}/list?unity=${unity.toString()}`;
  if (userIds && userIds.length !== 0) apiUri = `${apiUri}&userIds=${[...userIds].join(',')}`;
  if (minDate) apiUri = `${apiUri}&minDate=${convertDateFromServer(minDate)}`;
  if (maxDate) apiUri = `${apiUri}&maxDate=${convertDateFromServer(maxDate)}`;
  return {
    type: ACTION_TYPES.FETCH_LIST_PROCESS_KPI,
    payload: axios.get<IKPI>(apiUri),
  };
};
