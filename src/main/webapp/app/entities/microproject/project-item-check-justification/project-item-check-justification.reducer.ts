import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IProjectItemCheckJustification, defaultValue } from 'app/shared/model/microproject/project-item-check-justification.model';

export const ACTION_TYPES = {
  FETCH_PROJECTITEMCHECKJUSTIFICATION_LIST: 'projectItemCheckJustification/FETCH_PROJECTITEMCHECKJUSTIFICATION_LIST',
  FETCH_PROJECTITEMCHECKJUSTIFICATION: 'projectItemCheckJustification/FETCH_PROJECTITEMCHECKJUSTIFICATION',
  CREATE_PROJECTITEMCHECKJUSTIFICATION: 'projectItemCheckJustification/CREATE_PROJECTITEMCHECKJUSTIFICATION',
  UPDATE_PROJECTITEMCHECKJUSTIFICATION: 'projectItemCheckJustification/UPDATE_PROJECTITEMCHECKJUSTIFICATION',
  DELETE_PROJECTITEMCHECKJUSTIFICATION: 'projectItemCheckJustification/DELETE_PROJECTITEMCHECKJUSTIFICATION',
  SET_BLOB: 'projectItemCheckJustification/SET_BLOB',
  RESET: 'projectItemCheckJustification/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IProjectItemCheckJustification>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export type ProjectItemCheckJustificationState = Readonly<typeof initialState>;

// Reducer

export default (state: ProjectItemCheckJustificationState = initialState, action): ProjectItemCheckJustificationState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_PROJECTITEMCHECKJUSTIFICATION_LIST):
    case REQUEST(ACTION_TYPES.FETCH_PROJECTITEMCHECKJUSTIFICATION):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_PROJECTITEMCHECKJUSTIFICATION):
    case REQUEST(ACTION_TYPES.UPDATE_PROJECTITEMCHECKJUSTIFICATION):
    case REQUEST(ACTION_TYPES.DELETE_PROJECTITEMCHECKJUSTIFICATION):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_PROJECTITEMCHECKJUSTIFICATION_LIST):
    case FAILURE(ACTION_TYPES.FETCH_PROJECTITEMCHECKJUSTIFICATION):
    case FAILURE(ACTION_TYPES.CREATE_PROJECTITEMCHECKJUSTIFICATION):
    case FAILURE(ACTION_TYPES.UPDATE_PROJECTITEMCHECKJUSTIFICATION):
    case FAILURE(ACTION_TYPES.DELETE_PROJECTITEMCHECKJUSTIFICATION):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_PROJECTITEMCHECKJUSTIFICATION_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    case SUCCESS(ACTION_TYPES.FETCH_PROJECTITEMCHECKJUSTIFICATION):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_PROJECTITEMCHECKJUSTIFICATION):
    case SUCCESS(ACTION_TYPES.UPDATE_PROJECTITEMCHECKJUSTIFICATION):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_PROJECTITEMCHECKJUSTIFICATION):
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

const apiUrl = 'services/microproject/api/project-item-check-justifications';

// Actions

export const getEntities: ICrudGetAllAction<IProjectItemCheckJustification> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_PROJECTITEMCHECKJUSTIFICATION_LIST,
    payload: axios.get<IProjectItemCheckJustification>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`),
  };
};

export const getEntity: ICrudGetAction<IProjectItemCheckJustification> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_PROJECTITEMCHECKJUSTIFICATION,
    payload: axios.get<IProjectItemCheckJustification>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<IProjectItemCheckJustification> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_PROJECTITEMCHECKJUSTIFICATION,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IProjectItemCheckJustification> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_PROJECTITEMCHECKJUSTIFICATION,
    payload: axios.put(apiUrl, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IProjectItemCheckJustification> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_PROJECTITEMCHECKJUSTIFICATION,
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
