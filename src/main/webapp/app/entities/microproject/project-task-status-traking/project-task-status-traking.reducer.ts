import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IProjectTaskStatusTraking, defaultValue } from 'app/shared/model/microproject/project-task-status-traking.model';

export const ACTION_TYPES = {
  FETCH_PROJECTTASKSTATUSTRAKING_LIST: 'projectTaskStatusTraking/FETCH_PROJECTTASKSTATUSTRAKING_LIST',
  FETCH_PROJECTTASKSTATUSTRAKING: 'projectTaskStatusTraking/FETCH_PROJECTTASKSTATUSTRAKING',
  CREATE_PROJECTTASKSTATUSTRAKING: 'projectTaskStatusTraking/CREATE_PROJECTTASKSTATUSTRAKING',
  UPDATE_PROJECTTASKSTATUSTRAKING: 'projectTaskStatusTraking/UPDATE_PROJECTTASKSTATUSTRAKING',
  DELETE_PROJECTTASKSTATUSTRAKING: 'projectTaskStatusTraking/DELETE_PROJECTTASKSTATUSTRAKING',
  SET_BLOB: 'projectTaskStatusTraking/SET_BLOB',
  RESET: 'projectTaskStatusTraking/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IProjectTaskStatusTraking>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export type ProjectTaskStatusTrakingState = Readonly<typeof initialState>;

// Reducer

export default (state: ProjectTaskStatusTrakingState = initialState, action): ProjectTaskStatusTrakingState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_PROJECTTASKSTATUSTRAKING_LIST):
    case REQUEST(ACTION_TYPES.FETCH_PROJECTTASKSTATUSTRAKING):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_PROJECTTASKSTATUSTRAKING):
    case REQUEST(ACTION_TYPES.UPDATE_PROJECTTASKSTATUSTRAKING):
    case REQUEST(ACTION_TYPES.DELETE_PROJECTTASKSTATUSTRAKING):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_PROJECTTASKSTATUSTRAKING_LIST):
    case FAILURE(ACTION_TYPES.FETCH_PROJECTTASKSTATUSTRAKING):
    case FAILURE(ACTION_TYPES.CREATE_PROJECTTASKSTATUSTRAKING):
    case FAILURE(ACTION_TYPES.UPDATE_PROJECTTASKSTATUSTRAKING):
    case FAILURE(ACTION_TYPES.DELETE_PROJECTTASKSTATUSTRAKING):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_PROJECTTASKSTATUSTRAKING_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    case SUCCESS(ACTION_TYPES.FETCH_PROJECTTASKSTATUSTRAKING):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_PROJECTTASKSTATUSTRAKING):
    case SUCCESS(ACTION_TYPES.UPDATE_PROJECTTASKSTATUSTRAKING):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_PROJECTTASKSTATUSTRAKING):
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

const apiUrl = 'services/microproject/api/project-task-status-trakings';

// Actions

export const getEntities: ICrudGetAllAction<IProjectTaskStatusTraking> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_PROJECTTASKSTATUSTRAKING_LIST,
    payload: axios.get<IProjectTaskStatusTraking>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`),
  };
};

export const getEntity: ICrudGetAction<IProjectTaskStatusTraking> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_PROJECTTASKSTATUSTRAKING,
    payload: axios.get<IProjectTaskStatusTraking>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<IProjectTaskStatusTraking> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_PROJECTTASKSTATUSTRAKING,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IProjectTaskStatusTraking> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_PROJECTTASKSTATUSTRAKING,
    payload: axios.put(apiUrl, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IProjectTaskStatusTraking> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_PROJECTTASKSTATUSTRAKING,
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
