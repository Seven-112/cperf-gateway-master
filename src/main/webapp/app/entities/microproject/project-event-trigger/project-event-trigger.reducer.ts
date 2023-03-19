import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IProjectEventTrigger, defaultValue } from 'app/shared/model/microproject/project-event-trigger.model';

export const ACTION_TYPES = {
  FETCH_PROJECTEVENTTRIGGER_LIST: 'projectEventTrigger/FETCH_PROJECTEVENTTRIGGER_LIST',
  FETCH_PROJECTEVENTTRIGGER: 'projectEventTrigger/FETCH_PROJECTEVENTTRIGGER',
  CREATE_PROJECTEVENTTRIGGER: 'projectEventTrigger/CREATE_PROJECTEVENTTRIGGER',
  UPDATE_PROJECTEVENTTRIGGER: 'projectEventTrigger/UPDATE_PROJECTEVENTTRIGGER',
  DELETE_PROJECTEVENTTRIGGER: 'projectEventTrigger/DELETE_PROJECTEVENTTRIGGER',
  RESET: 'projectEventTrigger/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IProjectEventTrigger>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export type ProjectEventTriggerState = Readonly<typeof initialState>;

// Reducer

export default (state: ProjectEventTriggerState = initialState, action): ProjectEventTriggerState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_PROJECTEVENTTRIGGER_LIST):
    case REQUEST(ACTION_TYPES.FETCH_PROJECTEVENTTRIGGER):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_PROJECTEVENTTRIGGER):
    case REQUEST(ACTION_TYPES.UPDATE_PROJECTEVENTTRIGGER):
    case REQUEST(ACTION_TYPES.DELETE_PROJECTEVENTTRIGGER):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_PROJECTEVENTTRIGGER_LIST):
    case FAILURE(ACTION_TYPES.FETCH_PROJECTEVENTTRIGGER):
    case FAILURE(ACTION_TYPES.CREATE_PROJECTEVENTTRIGGER):
    case FAILURE(ACTION_TYPES.UPDATE_PROJECTEVENTTRIGGER):
    case FAILURE(ACTION_TYPES.DELETE_PROJECTEVENTTRIGGER):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_PROJECTEVENTTRIGGER_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    case SUCCESS(ACTION_TYPES.FETCH_PROJECTEVENTTRIGGER):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_PROJECTEVENTTRIGGER):
    case SUCCESS(ACTION_TYPES.UPDATE_PROJECTEVENTTRIGGER):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_PROJECTEVENTTRIGGER):
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

const apiUrl = 'services/microproject/api/project-event-triggers';

// Actions

export const getEntities: ICrudGetAllAction<IProjectEventTrigger> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_PROJECTEVENTTRIGGER_LIST,
    payload: axios.get<IProjectEventTrigger>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`),
  };
};

export const getEntity: ICrudGetAction<IProjectEventTrigger> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_PROJECTEVENTTRIGGER,
    payload: axios.get<IProjectEventTrigger>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<IProjectEventTrigger> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_PROJECTEVENTTRIGGER,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IProjectEventTrigger> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_PROJECTEVENTTRIGGER,
    payload: axios.put(apiUrl, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IProjectEventTrigger> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_PROJECTEVENTTRIGGER,
    payload: axios.delete(requestUrl),
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
