import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { ITypeindicator, defaultValue } from 'app/shared/model/typeindicator.model';

export const ACTION_TYPES = {
  FETCH_TYPEINDICATOR_LIST: 'typeindicator/FETCH_TYPEINDICATOR_LIST',
  FETCH_TYPEINDICATOR: 'typeindicator/FETCH_TYPEINDICATOR',
  CREATE_TYPEINDICATOR: 'typeindicator/CREATE_TYPEINDICATOR',
  UPDATE_TYPEINDICATOR: 'typeindicator/UPDATE_TYPEINDICATOR',
  DELETE_TYPEINDICATOR: 'typeindicator/DELETE_TYPEINDICATOR',
  RESET: 'typeindicator/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<ITypeindicator>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export type TypeindicatorState = Readonly<typeof initialState>;

// Reducer

export default (state: TypeindicatorState = initialState, action): TypeindicatorState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_TYPEINDICATOR_LIST):
    case REQUEST(ACTION_TYPES.FETCH_TYPEINDICATOR):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_TYPEINDICATOR):
    case REQUEST(ACTION_TYPES.UPDATE_TYPEINDICATOR):
    case REQUEST(ACTION_TYPES.DELETE_TYPEINDICATOR):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_TYPEINDICATOR_LIST):
    case FAILURE(ACTION_TYPES.FETCH_TYPEINDICATOR):
    case FAILURE(ACTION_TYPES.CREATE_TYPEINDICATOR):
    case FAILURE(ACTION_TYPES.UPDATE_TYPEINDICATOR):
    case FAILURE(ACTION_TYPES.DELETE_TYPEINDICATOR):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_TYPEINDICATOR_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    case SUCCESS(ACTION_TYPES.FETCH_TYPEINDICATOR):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_TYPEINDICATOR):
    case SUCCESS(ACTION_TYPES.UPDATE_TYPEINDICATOR):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_TYPEINDICATOR):
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

const apiUrl = 'api/typeindicators';

// Actions

export const getEntities: ICrudGetAllAction<ITypeindicator> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_TYPEINDICATOR_LIST,
    payload: axios.get<ITypeindicator>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`),
  };
};

export const getEntity: ICrudGetAction<ITypeindicator> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_TYPEINDICATOR,
    payload: axios.get<ITypeindicator>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<ITypeindicator> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_TYPEINDICATOR,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<ITypeindicator> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_TYPEINDICATOR,
    payload: axios.put(apiUrl, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<ITypeindicator> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_TYPEINDICATOR,
    payload: axios.delete(requestUrl),
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
