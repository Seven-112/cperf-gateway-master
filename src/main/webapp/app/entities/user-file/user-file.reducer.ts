import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IUserFile, defaultValue } from 'app/shared/model/user-file.model';

export const ACTION_TYPES = {
  FETCH_USERFILE_LIST: 'userFile/FETCH_USERFILE_LIST',
  FETCH_USERFILE: 'userFile/FETCH_USERFILE',
  CREATE_USERFILE: 'userFile/CREATE_USERFILE',
  UPDATE_USERFILE: 'userFile/UPDATE_USERFILE',
  DELETE_USERFILE: 'userFile/DELETE_USERFILE',
  RESET: 'userFile/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IUserFile>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export type UserFileState = Readonly<typeof initialState>;

// Reducer

export default (state: UserFileState = initialState, action): UserFileState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_USERFILE_LIST):
    case REQUEST(ACTION_TYPES.FETCH_USERFILE):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_USERFILE):
    case REQUEST(ACTION_TYPES.UPDATE_USERFILE):
    case REQUEST(ACTION_TYPES.DELETE_USERFILE):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_USERFILE_LIST):
    case FAILURE(ACTION_TYPES.FETCH_USERFILE):
    case FAILURE(ACTION_TYPES.CREATE_USERFILE):
    case FAILURE(ACTION_TYPES.UPDATE_USERFILE):
    case FAILURE(ACTION_TYPES.DELETE_USERFILE):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_USERFILE_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    case SUCCESS(ACTION_TYPES.FETCH_USERFILE):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_USERFILE):
    case SUCCESS(ACTION_TYPES.UPDATE_USERFILE):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_USERFILE):
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

const apiUrl = 'api/user-files';

// Actions

export const getEntities: ICrudGetAllAction<IUserFile> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_USERFILE_LIST,
    payload: axios.get<IUserFile>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`),
  };
};

export const getEntity: ICrudGetAction<IUserFile> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_USERFILE,
    payload: axios.get<IUserFile>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<IUserFile> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_USERFILE,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IUserFile> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_USERFILE,
    payload: axios.put(apiUrl, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IUserFile> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_USERFILE,
    payload: axios.delete(requestUrl),
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
