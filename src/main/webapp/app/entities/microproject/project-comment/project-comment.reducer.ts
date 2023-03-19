import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { IProjectComment, defaultValue } from 'app/shared/model/microproject/project-comment.model';

export const ACTION_TYPES = {
  FETCH_PROJECTCOMMENT_LIST: 'projectComment/FETCH_PROJECTCOMMENT_LIST',
  FETCH_PROJECTCOMMENT: 'projectComment/FETCH_PROJECTCOMMENT',
  CREATE_PROJECTCOMMENT: 'projectComment/CREATE_PROJECTCOMMENT',
  UPDATE_PROJECTCOMMENT: 'projectComment/UPDATE_PROJECTCOMMENT',
  DELETE_PROJECTCOMMENT: 'projectComment/DELETE_PROJECTCOMMENT',
  SET_BLOB: 'projectComment/SET_BLOB',
  RESET: 'projectComment/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IProjectComment>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export type ProjectCommentState = Readonly<typeof initialState>;

// Reducer

export default (state: ProjectCommentState = initialState, action): ProjectCommentState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_PROJECTCOMMENT_LIST):
    case REQUEST(ACTION_TYPES.FETCH_PROJECTCOMMENT):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_PROJECTCOMMENT):
    case REQUEST(ACTION_TYPES.UPDATE_PROJECTCOMMENT):
    case REQUEST(ACTION_TYPES.DELETE_PROJECTCOMMENT):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_PROJECTCOMMENT_LIST):
    case FAILURE(ACTION_TYPES.FETCH_PROJECTCOMMENT):
    case FAILURE(ACTION_TYPES.CREATE_PROJECTCOMMENT):
    case FAILURE(ACTION_TYPES.UPDATE_PROJECTCOMMENT):
    case FAILURE(ACTION_TYPES.DELETE_PROJECTCOMMENT):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_PROJECTCOMMENT_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    case SUCCESS(ACTION_TYPES.FETCH_PROJECTCOMMENT):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_PROJECTCOMMENT):
    case SUCCESS(ACTION_TYPES.UPDATE_PROJECTCOMMENT):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_PROJECTCOMMENT):
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

const apiUrl = 'services/microproject/api/project-comments';

// Actions

export const getEntities: ICrudGetAllAction<IProjectComment> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_PROJECTCOMMENT_LIST,
    payload: axios.get<IProjectComment>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`),
  };
};

export const getEntity: ICrudGetAction<IProjectComment> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_PROJECTCOMMENT,
    payload: axios.get<IProjectComment>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<IProjectComment> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_PROJECTCOMMENT,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IProjectComment> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_PROJECTCOMMENT,
    payload: axios.put(apiUrl, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IProjectComment> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_PROJECTCOMMENT,
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
