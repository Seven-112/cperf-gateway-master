import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IProviderExecutionAverage, defaultValue } from 'app/shared/model/microprovider/provider-execution-average.model';

export const ACTION_TYPES = {
  FETCH_PROVIDEREXECUTIONAVERAGE_LIST: 'providerExecutionAverage/FETCH_PROVIDEREXECUTIONAVERAGE_LIST',
  FETCH_PROVIDEREXECUTIONAVERAGE: 'providerExecutionAverage/FETCH_PROVIDEREXECUTIONAVERAGE',
  CREATE_PROVIDEREXECUTIONAVERAGE: 'providerExecutionAverage/CREATE_PROVIDEREXECUTIONAVERAGE',
  UPDATE_PROVIDEREXECUTIONAVERAGE: 'providerExecutionAverage/UPDATE_PROVIDEREXECUTIONAVERAGE',
  DELETE_PROVIDEREXECUTIONAVERAGE: 'providerExecutionAverage/DELETE_PROVIDEREXECUTIONAVERAGE',
  RESET: 'providerExecutionAverage/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IProviderExecutionAverage>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export type ProviderExecutionAverageState = Readonly<typeof initialState>;

// Reducer

export default (state: ProviderExecutionAverageState = initialState, action): ProviderExecutionAverageState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_PROVIDEREXECUTIONAVERAGE_LIST):
    case REQUEST(ACTION_TYPES.FETCH_PROVIDEREXECUTIONAVERAGE):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_PROVIDEREXECUTIONAVERAGE):
    case REQUEST(ACTION_TYPES.UPDATE_PROVIDEREXECUTIONAVERAGE):
    case REQUEST(ACTION_TYPES.DELETE_PROVIDEREXECUTIONAVERAGE):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_PROVIDEREXECUTIONAVERAGE_LIST):
    case FAILURE(ACTION_TYPES.FETCH_PROVIDEREXECUTIONAVERAGE):
    case FAILURE(ACTION_TYPES.CREATE_PROVIDEREXECUTIONAVERAGE):
    case FAILURE(ACTION_TYPES.UPDATE_PROVIDEREXECUTIONAVERAGE):
    case FAILURE(ACTION_TYPES.DELETE_PROVIDEREXECUTIONAVERAGE):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_PROVIDEREXECUTIONAVERAGE_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    case SUCCESS(ACTION_TYPES.FETCH_PROVIDEREXECUTIONAVERAGE):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_PROVIDEREXECUTIONAVERAGE):
    case SUCCESS(ACTION_TYPES.UPDATE_PROVIDEREXECUTIONAVERAGE):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_PROVIDEREXECUTIONAVERAGE):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: {},
      };
    case ACTION_TYPES.RESET:
      return {
        ...initialState,
      };
    default:
      return state;
  }
};

const apiUrl = 'services/microprovider/api/provider-execution-averages';

// Actions

export const getEntities: ICrudGetAllAction<IProviderExecutionAverage> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_PROVIDEREXECUTIONAVERAGE_LIST,
    payload: axios.get<IProviderExecutionAverage>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`),
  };
};

export const getEntity: ICrudGetAction<IProviderExecutionAverage> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_PROVIDEREXECUTIONAVERAGE,
    payload: axios.get<IProviderExecutionAverage>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<IProviderExecutionAverage> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_PROVIDEREXECUTIONAVERAGE,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IProviderExecutionAverage> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_PROVIDEREXECUTIONAVERAGE,
    payload: axios.put(apiUrl, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IProviderExecutionAverage> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_PROVIDEREXECUTIONAVERAGE,
    payload: axios.delete(requestUrl),
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
