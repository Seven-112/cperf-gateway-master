import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IProjectStartableTask, defaultValue } from 'app/shared/model/microproject/project-startable-task.model';

export const ACTION_TYPES = {
  FETCH_PROJECTSTARTABLETASK_LIST: 'projectStartableTask/FETCH_PROJECTSTARTABLETASK_LIST',
  FETCH_PROJECTSTARTABLETASK: 'projectStartableTask/FETCH_PROJECTSTARTABLETASK',
  CREATE_PROJECTSTARTABLETASK: 'projectStartableTask/CREATE_PROJECTSTARTABLETASK',
  UPDATE_PROJECTSTARTABLETASK: 'projectStartableTask/UPDATE_PROJECTSTARTABLETASK',
  DELETE_PROJECTSTARTABLETASK: 'projectStartableTask/DELETE_PROJECTSTARTABLETASK',
  RESET: 'projectStartableTask/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IProjectStartableTask>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export type ProjectStartableTaskState = Readonly<typeof initialState>;

// Reducer

export default (state: ProjectStartableTaskState = initialState, action): ProjectStartableTaskState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_PROJECTSTARTABLETASK_LIST):
    case REQUEST(ACTION_TYPES.FETCH_PROJECTSTARTABLETASK):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_PROJECTSTARTABLETASK):
    case REQUEST(ACTION_TYPES.UPDATE_PROJECTSTARTABLETASK):
    case REQUEST(ACTION_TYPES.DELETE_PROJECTSTARTABLETASK):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_PROJECTSTARTABLETASK_LIST):
    case FAILURE(ACTION_TYPES.FETCH_PROJECTSTARTABLETASK):
    case FAILURE(ACTION_TYPES.CREATE_PROJECTSTARTABLETASK):
    case FAILURE(ACTION_TYPES.UPDATE_PROJECTSTARTABLETASK):
    case FAILURE(ACTION_TYPES.DELETE_PROJECTSTARTABLETASK):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_PROJECTSTARTABLETASK_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    case SUCCESS(ACTION_TYPES.FETCH_PROJECTSTARTABLETASK):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_PROJECTSTARTABLETASK):
    case SUCCESS(ACTION_TYPES.UPDATE_PROJECTSTARTABLETASK):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_PROJECTSTARTABLETASK):
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

const apiUrl = 'services/microproject/api/project-startable-tasks';

// Actions

export const getEntities: ICrudGetAllAction<IProjectStartableTask> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_PROJECTSTARTABLETASK_LIST,
    payload: axios.get<IProjectStartableTask>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`),
  };
};

export const getEntity: ICrudGetAction<IProjectStartableTask> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_PROJECTSTARTABLETASK,
    payload: axios.get<IProjectStartableTask>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<IProjectStartableTask> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_PROJECTSTARTABLETASK,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IProjectStartableTask> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_PROJECTSTARTABLETASK,
    payload: axios.put(apiUrl, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IProjectStartableTask> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_PROJECTSTARTABLETASK,
    payload: axios.delete(requestUrl),
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
