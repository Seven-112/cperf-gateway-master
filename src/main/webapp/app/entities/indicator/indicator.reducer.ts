import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IIndicator, defaultValue } from 'app/shared/model/indicator.model';

export const ACTION_TYPES = {
  FETCH_INDICATOR_LIST: 'indicator/FETCH_INDICATOR_LIST',
  FETCH_INDICATOR: 'indicator/FETCH_INDICATOR',
  CREATE_INDICATOR: 'indicator/CREATE_INDICATOR',
  UPDATE_INDICATOR: 'indicator/UPDATE_INDICATOR',
  DELETE_INDICATOR: 'indicator/DELETE_INDICATOR',
  RESET: 'indicator/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IIndicator>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export type IndicatorState = Readonly<typeof initialState>;

// Reducer

export default (state: IndicatorState = initialState, action): IndicatorState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_INDICATOR_LIST):
    case REQUEST(ACTION_TYPES.FETCH_INDICATOR):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_INDICATOR):
    case REQUEST(ACTION_TYPES.UPDATE_INDICATOR):
    case REQUEST(ACTION_TYPES.DELETE_INDICATOR):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_INDICATOR_LIST):
    case FAILURE(ACTION_TYPES.FETCH_INDICATOR):
    case FAILURE(ACTION_TYPES.CREATE_INDICATOR):
    case FAILURE(ACTION_TYPES.UPDATE_INDICATOR):
    case FAILURE(ACTION_TYPES.DELETE_INDICATOR):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_INDICATOR_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    case SUCCESS(ACTION_TYPES.FETCH_INDICATOR):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_INDICATOR):
    case SUCCESS(ACTION_TYPES.UPDATE_INDICATOR):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_INDICATOR):
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

const apiUrl = 'api/indicators';

// Actions

export const getEntities: ICrudGetAllAction<IIndicator> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_INDICATOR_LIST,
    payload: axios.get<IIndicator>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`),
  };
};

export const getEntity: ICrudGetAction<IIndicator> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_INDICATOR,
    payload: axios.get<IIndicator>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<IIndicator> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_INDICATOR,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IIndicator> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_INDICATOR,
    payload: axios.put(apiUrl, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IIndicator> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_INDICATOR,
    payload: axios.delete(requestUrl),
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
