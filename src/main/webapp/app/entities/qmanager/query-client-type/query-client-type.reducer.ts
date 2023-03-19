import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { IQueryClientType, defaultValue } from 'app/shared/model/qmanager/query-client-type.model';

export const ACTION_TYPES = {
  FETCH_QUERYCLIENTTYPE_LIST: 'queryClientType/FETCH_QUERYCLIENTTYPE_LIST',
  FETCH_QUERYCLIENTTYPE: 'queryClientType/FETCH_QUERYCLIENTTYPE',
  CREATE_QUERYCLIENTTYPE: 'queryClientType/CREATE_QUERYCLIENTTYPE',
  UPDATE_QUERYCLIENTTYPE: 'queryClientType/UPDATE_QUERYCLIENTTYPE',
  DELETE_QUERYCLIENTTYPE: 'queryClientType/DELETE_QUERYCLIENTTYPE',
  RESET: 'queryClientType/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IQueryClientType>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export type QueryClientTypeState = Readonly<typeof initialState>;

// Reducer

export default (state: QueryClientTypeState = initialState, action): QueryClientTypeState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_QUERYCLIENTTYPE_LIST):
    case REQUEST(ACTION_TYPES.FETCH_QUERYCLIENTTYPE):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_QUERYCLIENTTYPE):
    case REQUEST(ACTION_TYPES.UPDATE_QUERYCLIENTTYPE):
    case REQUEST(ACTION_TYPES.DELETE_QUERYCLIENTTYPE):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_QUERYCLIENTTYPE_LIST):
    case FAILURE(ACTION_TYPES.FETCH_QUERYCLIENTTYPE):
    case FAILURE(ACTION_TYPES.CREATE_QUERYCLIENTTYPE):
    case FAILURE(ACTION_TYPES.UPDATE_QUERYCLIENTTYPE):
    case FAILURE(ACTION_TYPES.DELETE_QUERYCLIENTTYPE):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_QUERYCLIENTTYPE_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    case SUCCESS(ACTION_TYPES.FETCH_QUERYCLIENTTYPE):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_QUERYCLIENTTYPE):
    case SUCCESS(ACTION_TYPES.UPDATE_QUERYCLIENTTYPE):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_QUERYCLIENTTYPE):
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

const apiUrl = 'services/qmanager/api/query-client-types';

// Actions

export const getEntities: ICrudGetAllAction<IQueryClientType> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_QUERYCLIENTTYPE_LIST,
    payload: axios.get<IQueryClientType>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`),
  };
};

export const getEntity: ICrudGetAction<IQueryClientType> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_QUERYCLIENTTYPE,
    payload: axios.get<IQueryClientType>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<IQueryClientType> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_QUERYCLIENTTYPE,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IQueryClientType> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_QUERYCLIENTTYPE,
    payload: axios.put(apiUrl, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IQueryClientType> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_QUERYCLIENTTYPE,
    payload: axios.delete(requestUrl),
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
