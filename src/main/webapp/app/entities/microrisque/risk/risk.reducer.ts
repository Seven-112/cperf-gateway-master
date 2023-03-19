import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { IRisk, defaultValue } from 'app/shared/model/microrisque/risk.model';

export const ACTION_TYPES = {
  FETCH_RISK_LIST: 'risk/FETCH_RISK_LIST',
  FETCH_RISK: 'risk/FETCH_RISK',
  CREATE_RISK: 'risk/CREATE_RISK',
  UPDATE_RISK: 'risk/UPDATE_RISK',
  DELETE_RISK: 'risk/DELETE_RISK',
  RESET: 'risk/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IRisk>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export type RiskState = Readonly<typeof initialState>;

// Reducer

export default (state: RiskState = initialState, action): RiskState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_RISK_LIST):
    case REQUEST(ACTION_TYPES.FETCH_RISK):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_RISK):
    case REQUEST(ACTION_TYPES.UPDATE_RISK):
    case REQUEST(ACTION_TYPES.DELETE_RISK):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_RISK_LIST):
    case FAILURE(ACTION_TYPES.FETCH_RISK):
    case FAILURE(ACTION_TYPES.CREATE_RISK):
    case FAILURE(ACTION_TYPES.UPDATE_RISK):
    case FAILURE(ACTION_TYPES.DELETE_RISK):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_RISK_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    case SUCCESS(ACTION_TYPES.FETCH_RISK):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_RISK):
    case SUCCESS(ACTION_TYPES.UPDATE_RISK):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_RISK):
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

const apiUrl = 'services/microrisque/api/risks';

// Actions

export const getEntities: ICrudGetAllAction<IRisk> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_RISK_LIST,
    payload: axios.get<IRisk>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`),
  };
};

export const getEntity: ICrudGetAction<IRisk> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_RISK,
    payload: axios.get<IRisk>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<IRisk> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_RISK,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IRisk> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_RISK,
    payload: axios.put(apiUrl, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IRisk> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_RISK,
    payload: axios.delete(requestUrl),
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
