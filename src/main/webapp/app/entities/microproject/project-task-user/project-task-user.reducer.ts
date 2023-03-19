import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { IProjectTaskUser, defaultValue } from 'app/shared/model/microproject/project-task-user.model';

export const ACTION_TYPES = {
  FETCH_PROJECTTASKUSER_LIST: 'projectTaskUser/FETCH_PROJECTTASKUSER_LIST',
  FETCH_PROJECTTASKUSER: 'projectTaskUser/FETCH_PROJECTTASKUSER',
  CREATE_PROJECTTASKUSER: 'projectTaskUser/CREATE_PROJECTTASKUSER',
  UPDATE_PROJECTTASKUSER: 'projectTaskUser/UPDATE_PROJECTTASKUSER',
  DELETE_PROJECTTASKUSER: 'projectTaskUser/DELETE_PROJECTTASKUSER',
  RESET: 'projectTaskUser/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IProjectTaskUser>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export type ProjectTaskUserState = Readonly<typeof initialState>;

// Reducer

export default (state: ProjectTaskUserState = initialState, action): ProjectTaskUserState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_PROJECTTASKUSER_LIST):
    case REQUEST(ACTION_TYPES.FETCH_PROJECTTASKUSER):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_PROJECTTASKUSER):
    case REQUEST(ACTION_TYPES.UPDATE_PROJECTTASKUSER):
    case REQUEST(ACTION_TYPES.DELETE_PROJECTTASKUSER):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_PROJECTTASKUSER_LIST):
    case FAILURE(ACTION_TYPES.FETCH_PROJECTTASKUSER):
    case FAILURE(ACTION_TYPES.CREATE_PROJECTTASKUSER):
    case FAILURE(ACTION_TYPES.UPDATE_PROJECTTASKUSER):
    case FAILURE(ACTION_TYPES.DELETE_PROJECTTASKUSER):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_PROJECTTASKUSER_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    case SUCCESS(ACTION_TYPES.FETCH_PROJECTTASKUSER):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_PROJECTTASKUSER):
    case SUCCESS(ACTION_TYPES.UPDATE_PROJECTTASKUSER):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_PROJECTTASKUSER):
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

const apiUrl = 'services/microproject/api/project-task-users';

// Actions

export const getEntities: ICrudGetAllAction<IProjectTaskUser> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_PROJECTTASKUSER_LIST,
    payload: axios.get<IProjectTaskUser>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`),
  };
};

export const getEntity: ICrudGetAction<IProjectTaskUser> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_PROJECTTASKUSER,
    payload: axios.get<IProjectTaskUser>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<IProjectTaskUser> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_PROJECTTASKUSER,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IProjectTaskUser> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_PROJECTTASKUSER,
    payload: axios.put(apiUrl, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IProjectTaskUser> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_PROJECTTASKUSER,
    payload: axios.delete(requestUrl),
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
