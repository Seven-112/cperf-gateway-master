import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { IMshzFile, defaultValue } from 'app/shared/model/microfilemanager/mshz-file.model';

export const ACTION_TYPES = {
  FETCH_MSHZFILE_LIST: 'mshzFile/FETCH_MSHZFILE_LIST',
  FETCH_MSHZFILE: 'mshzFile/FETCH_MSHZFILE',
  CREATE_MSHZFILE: 'mshzFile/CREATE_MSHZFILE',
  UPDATE_MSHZFILE: 'mshzFile/UPDATE_MSHZFILE',
  DELETE_MSHZFILE: 'mshzFile/DELETE_MSHZFILE',
  SET_BLOB: 'mshzFile/SET_BLOB',
  RESET: 'mshzFile/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IMshzFile>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export type MshzFileState = Readonly<typeof initialState>;

// Reducer

export default (state: MshzFileState = initialState, action): MshzFileState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_MSHZFILE_LIST):
    case REQUEST(ACTION_TYPES.FETCH_MSHZFILE):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_MSHZFILE):
    case REQUEST(ACTION_TYPES.UPDATE_MSHZFILE):
    case REQUEST(ACTION_TYPES.DELETE_MSHZFILE):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_MSHZFILE_LIST):
    case FAILURE(ACTION_TYPES.FETCH_MSHZFILE):
    case FAILURE(ACTION_TYPES.CREATE_MSHZFILE):
    case FAILURE(ACTION_TYPES.UPDATE_MSHZFILE):
    case FAILURE(ACTION_TYPES.DELETE_MSHZFILE):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_MSHZFILE_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    case SUCCESS(ACTION_TYPES.FETCH_MSHZFILE):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_MSHZFILE):
    case SUCCESS(ACTION_TYPES.UPDATE_MSHZFILE):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_MSHZFILE):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: {},
      };
    case ACTION_TYPES.SET_BLOB: {
      const { name, data, contentType } = action.payload;
      return {
        ...state,
        entity: {
          ...state.entity,
          [name]: data,
          [name + 'ContentType']: contentType,
        },
      };
    }
    case ACTION_TYPES.RESET:
      return {
        ...initialState,
      };
    default:
      return state;
  }
};

const apiUrl = 'services/microfilemanager/api/mshz-files';

// Actions

export const getEntities: ICrudGetAllAction<IMshzFile> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_MSHZFILE_LIST,
    payload: axios.get<IMshzFile>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`),
  };
};

export const getEntity: ICrudGetAction<IMshzFile> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_MSHZFILE,
    payload: axios.get<IMshzFile>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<IMshzFile> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_MSHZFILE,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IMshzFile> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_MSHZFILE,
    payload: axios.put(apiUrl, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IMshzFile> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_MSHZFILE,
    payload: axios.delete(requestUrl),
  });
  dispatch(getEntities());
  return result;
};

export const setBlob = (name, data, contentType?) => ({
  type: ACTION_TYPES.SET_BLOB,
  payload: {
    name,
    data,
    contentType,
  },
});

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
