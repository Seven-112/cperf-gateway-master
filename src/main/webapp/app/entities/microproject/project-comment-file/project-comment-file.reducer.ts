import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { IProjectCommentFile, defaultValue } from 'app/shared/model/microproject/project-comment-file.model';

export const ACTION_TYPES = {
  FETCH_PROJECTCOMMENTFILE_LIST: 'projectCommentFile/FETCH_PROJECTCOMMENTFILE_LIST',
  FETCH_PROJECTCOMMENTFILE: 'projectCommentFile/FETCH_PROJECTCOMMENTFILE',
  CREATE_PROJECTCOMMENTFILE: 'projectCommentFile/CREATE_PROJECTCOMMENTFILE',
  UPDATE_PROJECTCOMMENTFILE: 'projectCommentFile/UPDATE_PROJECTCOMMENTFILE',
  DELETE_PROJECTCOMMENTFILE: 'projectCommentFile/DELETE_PROJECTCOMMENTFILE',
  RESET: 'projectCommentFile/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IProjectCommentFile>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export type ProjectCommentFileState = Readonly<typeof initialState>;

// Reducer

export default (state: ProjectCommentFileState = initialState, action): ProjectCommentFileState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_PROJECTCOMMENTFILE_LIST):
    case REQUEST(ACTION_TYPES.FETCH_PROJECTCOMMENTFILE):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_PROJECTCOMMENTFILE):
    case REQUEST(ACTION_TYPES.UPDATE_PROJECTCOMMENTFILE):
    case REQUEST(ACTION_TYPES.DELETE_PROJECTCOMMENTFILE):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_PROJECTCOMMENTFILE_LIST):
    case FAILURE(ACTION_TYPES.FETCH_PROJECTCOMMENTFILE):
    case FAILURE(ACTION_TYPES.CREATE_PROJECTCOMMENTFILE):
    case FAILURE(ACTION_TYPES.UPDATE_PROJECTCOMMENTFILE):
    case FAILURE(ACTION_TYPES.DELETE_PROJECTCOMMENTFILE):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_PROJECTCOMMENTFILE_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    case SUCCESS(ACTION_TYPES.FETCH_PROJECTCOMMENTFILE):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_PROJECTCOMMENTFILE):
    case SUCCESS(ACTION_TYPES.UPDATE_PROJECTCOMMENTFILE):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_PROJECTCOMMENTFILE):
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

const apiUrl = 'services/microproject/api/project-comment-files';

// Actions

export const getEntities: ICrudGetAllAction<IProjectCommentFile> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_PROJECTCOMMENTFILE_LIST,
    payload: axios.get<IProjectCommentFile>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`),
  };
};

export const getEntity: ICrudGetAction<IProjectCommentFile> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_PROJECTCOMMENTFILE,
    payload: axios.get<IProjectCommentFile>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<IProjectCommentFile> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_PROJECTCOMMENTFILE,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IProjectCommentFile> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_PROJECTCOMMENTFILE,
    payload: axios.put(apiUrl, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IProjectCommentFile> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_PROJECTCOMMENTFILE,
    payload: axios.delete(requestUrl),
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
