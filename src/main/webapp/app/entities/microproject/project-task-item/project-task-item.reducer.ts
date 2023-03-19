import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { IProjectTaskItem, defaultValue } from 'app/shared/model/microproject/project-task-item.model';

export const ACTION_TYPES = {
  FETCH_PROJECTTASKITEM_LIST: 'projectTaskItem/FETCH_PROJECTTASKITEM_LIST',
  FETCH_PROJECTTASKITEM: 'projectTaskItem/FETCH_PROJECTTASKITEM',
  CREATE_PROJECTTASKITEM: 'projectTaskItem/CREATE_PROJECTTASKITEM',
  UPDATE_PROJECTTASKITEM: 'projectTaskItem/UPDATE_PROJECTTASKITEM',
  DELETE_PROJECTTASKITEM: 'projectTaskItem/DELETE_PROJECTTASKITEM',
  RESET: 'projectTaskItem/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IProjectTaskItem>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export type ProjectTaskItemState = Readonly<typeof initialState>;

// Reducer

export default (state: ProjectTaskItemState = initialState, action): ProjectTaskItemState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_PROJECTTASKITEM_LIST):
    case REQUEST(ACTION_TYPES.FETCH_PROJECTTASKITEM):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_PROJECTTASKITEM):
    case REQUEST(ACTION_TYPES.UPDATE_PROJECTTASKITEM):
    case REQUEST(ACTION_TYPES.DELETE_PROJECTTASKITEM):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_PROJECTTASKITEM_LIST):
    case FAILURE(ACTION_TYPES.FETCH_PROJECTTASKITEM):
    case FAILURE(ACTION_TYPES.CREATE_PROJECTTASKITEM):
    case FAILURE(ACTION_TYPES.UPDATE_PROJECTTASKITEM):
    case FAILURE(ACTION_TYPES.DELETE_PROJECTTASKITEM):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_PROJECTTASKITEM_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    case SUCCESS(ACTION_TYPES.FETCH_PROJECTTASKITEM):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_PROJECTTASKITEM):
    case SUCCESS(ACTION_TYPES.UPDATE_PROJECTTASKITEM):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_PROJECTTASKITEM):
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

const apiUrl = 'services/microproject/api/project-task-items';

// Actions

export const getEntities: ICrudGetAllAction<IProjectTaskItem> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_PROJECTTASKITEM_LIST,
    payload: axios.get<IProjectTaskItem>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`),
  };
};

export const getEntity: ICrudGetAction<IProjectTaskItem> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_PROJECTTASKITEM,
    payload: axios.get<IProjectTaskItem>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<IProjectTaskItem> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_PROJECTTASKITEM,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IProjectTaskItem> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_PROJECTTASKITEM,
    payload: axios.put(apiUrl, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IProjectTaskItem> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_PROJECTTASKITEM,
    payload: axios.delete(requestUrl),
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
