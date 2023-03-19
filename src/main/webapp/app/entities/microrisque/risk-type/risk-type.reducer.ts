import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { IRiskType, defaultValue } from 'app/shared/model/microrisque/risk-type.model';

export const ACTION_TYPES = {
  FETCH_RISKTYPE_LIST: 'riskType/FETCH_RISKTYPE_LIST',
  FETCH_RISKTYPE: 'riskType/FETCH_RISKTYPE',
  CREATE_RISKTYPE: 'riskType/CREATE_RISKTYPE',
  UPDATE_RISKTYPE: 'riskType/UPDATE_RISKTYPE',
  DELETE_RISKTYPE: 'riskType/DELETE_RISKTYPE',
  RESET: 'riskType/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IRiskType>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export type RiskTypeState = Readonly<typeof initialState>;

// Reducer

export default (state: RiskTypeState = initialState, action): RiskTypeState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_RISKTYPE_LIST):
    case REQUEST(ACTION_TYPES.FETCH_RISKTYPE):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_RISKTYPE):
    case REQUEST(ACTION_TYPES.UPDATE_RISKTYPE):
    case REQUEST(ACTION_TYPES.DELETE_RISKTYPE):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_RISKTYPE_LIST):
    case FAILURE(ACTION_TYPES.FETCH_RISKTYPE):
    case FAILURE(ACTION_TYPES.CREATE_RISKTYPE):
    case FAILURE(ACTION_TYPES.UPDATE_RISKTYPE):
    case FAILURE(ACTION_TYPES.DELETE_RISKTYPE):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_RISKTYPE_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    case SUCCESS(ACTION_TYPES.FETCH_RISKTYPE):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_RISKTYPE):
    case SUCCESS(ACTION_TYPES.UPDATE_RISKTYPE):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_RISKTYPE):
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

const apiUrl = 'services/microrisque/api/risk-types';

// Actions

export const getEntities: ICrudGetAllAction<IRiskType> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_RISKTYPE_LIST,
    payload: axios.get<IRiskType>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`),
  };
};

export const getEntity: ICrudGetAction<IRiskType> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_RISKTYPE,
    payload: axios.get<IRiskType>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<IRiskType> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_RISKTYPE,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IRiskType> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_RISKTYPE,
    payload: axios.put(apiUrl, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IRiskType> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_RISKTYPE,
    payload: axios.delete(requestUrl),
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
