import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IConsommable, defaultValue } from 'app/shared/model/microstock/consommable.model';

export const ACTION_TYPES = {
  FETCH_CONSOMMABLE_LIST: 'consommable/FETCH_CONSOMMABLE_LIST',
  FETCH_CONSOMMABLE: 'consommable/FETCH_CONSOMMABLE',
  CREATE_CONSOMMABLE: 'consommable/CREATE_CONSOMMABLE',
  UPDATE_CONSOMMABLE: 'consommable/UPDATE_CONSOMMABLE',
  DELETE_CONSOMMABLE: 'consommable/DELETE_CONSOMMABLE',
  RESET: 'consommable/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IConsommable>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export type ConsommableState = Readonly<typeof initialState>;

// Reducer

export default (state: ConsommableState = initialState, action): ConsommableState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_CONSOMMABLE_LIST):
    case REQUEST(ACTION_TYPES.FETCH_CONSOMMABLE):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_CONSOMMABLE):
    case REQUEST(ACTION_TYPES.UPDATE_CONSOMMABLE):
    case REQUEST(ACTION_TYPES.DELETE_CONSOMMABLE):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_CONSOMMABLE_LIST):
    case FAILURE(ACTION_TYPES.FETCH_CONSOMMABLE):
    case FAILURE(ACTION_TYPES.CREATE_CONSOMMABLE):
    case FAILURE(ACTION_TYPES.UPDATE_CONSOMMABLE):
    case FAILURE(ACTION_TYPES.DELETE_CONSOMMABLE):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_CONSOMMABLE_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    case SUCCESS(ACTION_TYPES.FETCH_CONSOMMABLE):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_CONSOMMABLE):
    case SUCCESS(ACTION_TYPES.UPDATE_CONSOMMABLE):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_CONSOMMABLE):
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

const apiUrl = 'services/microstock/api/consommables';

// Actions

export const getEntities: ICrudGetAllAction<IConsommable> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_CONSOMMABLE_LIST,
    payload: axios.get<IConsommable>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`),
  };
};

export const getEntity: ICrudGetAction<IConsommable> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_CONSOMMABLE,
    payload: axios.get<IConsommable>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<IConsommable> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_CONSOMMABLE,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IConsommable> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_CONSOMMABLE,
    payload: axios.put(apiUrl, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IConsommable> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_CONSOMMABLE,
    payload: axios.delete(requestUrl),
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
