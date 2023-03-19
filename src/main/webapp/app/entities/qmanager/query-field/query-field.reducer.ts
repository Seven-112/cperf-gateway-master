import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { IQueryField, defaultValue } from 'app/shared/model/qmanager/query-field.model';

export const ACTION_TYPES = {
  FETCH_QUERYFIELD_LIST: 'queryField/FETCH_QUERYFIELD_LIST',
  FETCH_QUERYFIELD: 'queryField/FETCH_QUERYFIELD',
  CREATE_QUERYFIELD: 'queryField/CREATE_QUERYFIELD',
  UPDATE_QUERYFIELD: 'queryField/UPDATE_QUERYFIELD',
  DELETE_QUERYFIELD: 'queryField/DELETE_QUERYFIELD',
  RESET: 'queryField/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IQueryField>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export type QueryFieldState = Readonly<typeof initialState>;

// Reducer

export default (state: QueryFieldState = initialState, action): QueryFieldState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_QUERYFIELD_LIST):
    case REQUEST(ACTION_TYPES.FETCH_QUERYFIELD):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_QUERYFIELD):
    case REQUEST(ACTION_TYPES.UPDATE_QUERYFIELD):
    case REQUEST(ACTION_TYPES.DELETE_QUERYFIELD):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_QUERYFIELD_LIST):
    case FAILURE(ACTION_TYPES.FETCH_QUERYFIELD):
    case FAILURE(ACTION_TYPES.CREATE_QUERYFIELD):
    case FAILURE(ACTION_TYPES.UPDATE_QUERYFIELD):
    case FAILURE(ACTION_TYPES.DELETE_QUERYFIELD):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_QUERYFIELD_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    case SUCCESS(ACTION_TYPES.FETCH_QUERYFIELD):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_QUERYFIELD):
    case SUCCESS(ACTION_TYPES.UPDATE_QUERYFIELD):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_QUERYFIELD):
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

const apiUrl = 'services/qmanager/api/query-fields';

// Actions

export const getEntities: ICrudGetAllAction<IQueryField> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_QUERYFIELD_LIST,
    payload: axios.get<IQueryField>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`),
  };
};

export const getEntity: ICrudGetAction<IQueryField> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_QUERYFIELD,
    payload: axios.get<IQueryField>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<IQueryField> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_QUERYFIELD,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IQueryField> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_QUERYFIELD,
    payload: axios.put(apiUrl, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IQueryField> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_QUERYFIELD,
    payload: axios.delete(requestUrl),
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
