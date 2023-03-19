import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { IQueryFile, defaultValue } from 'app/shared/model/qmanager/query-file.model';

export const ACTION_TYPES = {
  FETCH_QUERYFILE_LIST: 'queryFile/FETCH_QUERYFILE_LIST',
  FETCH_QUERYFILE: 'queryFile/FETCH_QUERYFILE',
  CREATE_QUERYFILE: 'queryFile/CREATE_QUERYFILE',
  UPDATE_QUERYFILE: 'queryFile/UPDATE_QUERYFILE',
  DELETE_QUERYFILE: 'queryFile/DELETE_QUERYFILE',
  RESET: 'queryFile/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IQueryFile>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export type QueryFileState = Readonly<typeof initialState>;

// Reducer

export default (state: QueryFileState = initialState, action): QueryFileState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_QUERYFILE_LIST):
    case REQUEST(ACTION_TYPES.FETCH_QUERYFILE):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_QUERYFILE):
    case REQUEST(ACTION_TYPES.UPDATE_QUERYFILE):
    case REQUEST(ACTION_TYPES.DELETE_QUERYFILE):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_QUERYFILE_LIST):
    case FAILURE(ACTION_TYPES.FETCH_QUERYFILE):
    case FAILURE(ACTION_TYPES.CREATE_QUERYFILE):
    case FAILURE(ACTION_TYPES.UPDATE_QUERYFILE):
    case FAILURE(ACTION_TYPES.DELETE_QUERYFILE):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_QUERYFILE_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    case SUCCESS(ACTION_TYPES.FETCH_QUERYFILE):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_QUERYFILE):
    case SUCCESS(ACTION_TYPES.UPDATE_QUERYFILE):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_QUERYFILE):
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

const apiUrl = 'services/qmanager/api/query-files';

// Actions

export const getEntities: ICrudGetAllAction<IQueryFile> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_QUERYFILE_LIST,
    payload: axios.get<IQueryFile>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`),
  };
};

export const getEntity: ICrudGetAction<IQueryFile> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_QUERYFILE,
    payload: axios.get<IQueryFile>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<IQueryFile> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_QUERYFILE,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IQueryFile> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_QUERYFILE,
    payload: axios.put(apiUrl, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IQueryFile> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_QUERYFILE,
    payload: axios.delete(requestUrl),
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
