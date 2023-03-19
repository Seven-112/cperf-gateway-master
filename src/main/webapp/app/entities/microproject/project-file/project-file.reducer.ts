import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { IProjectFile, defaultValue } from 'app/shared/model/microproject/project-file.model';

export const ACTION_TYPES = {
  FETCH_PROJECTFILE_LIST: 'projectFile/FETCH_PROJECTFILE_LIST',
  FETCH_PROJECTFILE: 'projectFile/FETCH_PROJECTFILE',
  CREATE_PROJECTFILE: 'projectFile/CREATE_PROJECTFILE',
  UPDATE_PROJECTFILE: 'projectFile/UPDATE_PROJECTFILE',
  DELETE_PROJECTFILE: 'projectFile/DELETE_PROJECTFILE',
  SET_BLOB: 'projectFile/SET_BLOB',
  RESET: 'projectFile/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IProjectFile>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export type ProjectFileState = Readonly<typeof initialState>;

// Reducer

export default (state: ProjectFileState = initialState, action): ProjectFileState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_PROJECTFILE_LIST):
    case REQUEST(ACTION_TYPES.FETCH_PROJECTFILE):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_PROJECTFILE):
    case REQUEST(ACTION_TYPES.UPDATE_PROJECTFILE):
    case REQUEST(ACTION_TYPES.DELETE_PROJECTFILE):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_PROJECTFILE_LIST):
    case FAILURE(ACTION_TYPES.FETCH_PROJECTFILE):
    case FAILURE(ACTION_TYPES.CREATE_PROJECTFILE):
    case FAILURE(ACTION_TYPES.UPDATE_PROJECTFILE):
    case FAILURE(ACTION_TYPES.DELETE_PROJECTFILE):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_PROJECTFILE_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    case SUCCESS(ACTION_TYPES.FETCH_PROJECTFILE):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_PROJECTFILE):
    case SUCCESS(ACTION_TYPES.UPDATE_PROJECTFILE):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_PROJECTFILE):
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

const apiUrl = 'services/microproject/api/project-files';

// Actions

export const getEntities: ICrudGetAllAction<IProjectFile> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_PROJECTFILE_LIST,
    payload: axios.get<IProjectFile>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`),
  };
};

export const getEntity: ICrudGetAction<IProjectFile> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_PROJECTFILE,
    payload: axios.get<IProjectFile>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<IProjectFile> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_PROJECTFILE,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IProjectFile> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_PROJECTFILE,
    payload: axios.put(apiUrl, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IProjectFile> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_PROJECTFILE,
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
