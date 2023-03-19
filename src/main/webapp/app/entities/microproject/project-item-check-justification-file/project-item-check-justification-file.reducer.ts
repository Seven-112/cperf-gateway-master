import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import {
  IProjectItemCheckJustificationFile,
  defaultValue,
} from 'app/shared/model/microproject/project-item-check-justification-file.model';

export const ACTION_TYPES = {
  FETCH_PROJECTITEMCHECKJUSTIFICATIONFILE_LIST: 'projectItemCheckJustificationFile/FETCH_PROJECTITEMCHECKJUSTIFICATIONFILE_LIST',
  FETCH_PROJECTITEMCHECKJUSTIFICATIONFILE: 'projectItemCheckJustificationFile/FETCH_PROJECTITEMCHECKJUSTIFICATIONFILE',
  CREATE_PROJECTITEMCHECKJUSTIFICATIONFILE: 'projectItemCheckJustificationFile/CREATE_PROJECTITEMCHECKJUSTIFICATIONFILE',
  UPDATE_PROJECTITEMCHECKJUSTIFICATIONFILE: 'projectItemCheckJustificationFile/UPDATE_PROJECTITEMCHECKJUSTIFICATIONFILE',
  DELETE_PROJECTITEMCHECKJUSTIFICATIONFILE: 'projectItemCheckJustificationFile/DELETE_PROJECTITEMCHECKJUSTIFICATIONFILE',
  RESET: 'projectItemCheckJustificationFile/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IProjectItemCheckJustificationFile>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export type ProjectItemCheckJustificationFileState = Readonly<typeof initialState>;

// Reducer

export default (state: ProjectItemCheckJustificationFileState = initialState, action): ProjectItemCheckJustificationFileState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_PROJECTITEMCHECKJUSTIFICATIONFILE_LIST):
    case REQUEST(ACTION_TYPES.FETCH_PROJECTITEMCHECKJUSTIFICATIONFILE):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_PROJECTITEMCHECKJUSTIFICATIONFILE):
    case REQUEST(ACTION_TYPES.UPDATE_PROJECTITEMCHECKJUSTIFICATIONFILE):
    case REQUEST(ACTION_TYPES.DELETE_PROJECTITEMCHECKJUSTIFICATIONFILE):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_PROJECTITEMCHECKJUSTIFICATIONFILE_LIST):
    case FAILURE(ACTION_TYPES.FETCH_PROJECTITEMCHECKJUSTIFICATIONFILE):
    case FAILURE(ACTION_TYPES.CREATE_PROJECTITEMCHECKJUSTIFICATIONFILE):
    case FAILURE(ACTION_TYPES.UPDATE_PROJECTITEMCHECKJUSTIFICATIONFILE):
    case FAILURE(ACTION_TYPES.DELETE_PROJECTITEMCHECKJUSTIFICATIONFILE):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_PROJECTITEMCHECKJUSTIFICATIONFILE_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    case SUCCESS(ACTION_TYPES.FETCH_PROJECTITEMCHECKJUSTIFICATIONFILE):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_PROJECTITEMCHECKJUSTIFICATIONFILE):
    case SUCCESS(ACTION_TYPES.UPDATE_PROJECTITEMCHECKJUSTIFICATIONFILE):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_PROJECTITEMCHECKJUSTIFICATIONFILE):
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

const apiUrl = 'services/microproject/api/project-item-check-justification-files';

// Actions

export const getEntities: ICrudGetAllAction<IProjectItemCheckJustificationFile> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_PROJECTITEMCHECKJUSTIFICATIONFILE_LIST,
    payload: axios.get<IProjectItemCheckJustificationFile>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`),
  };
};

export const getEntity: ICrudGetAction<IProjectItemCheckJustificationFile> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_PROJECTITEMCHECKJUSTIFICATIONFILE,
    payload: axios.get<IProjectItemCheckJustificationFile>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<IProjectItemCheckJustificationFile> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_PROJECTITEMCHECKJUSTIFICATIONFILE,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IProjectItemCheckJustificationFile> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_PROJECTITEMCHECKJUSTIFICATIONFILE,
    payload: axios.put(apiUrl, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IProjectItemCheckJustificationFile> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_PROJECTITEMCHECKJUSTIFICATIONFILE,
    payload: axios.delete(requestUrl),
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
