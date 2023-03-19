import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { IProjectTaskValidationControl, defaultValue } from 'app/shared/model/microproject/project-task-validation-control.model';

export const ACTION_TYPES = {
  FETCH_PROJECTTASKVALIDATIONCONTROL_LIST: 'projectTaskValidationControl/FETCH_PROJECTTASKVALIDATIONCONTROL_LIST',
  FETCH_PROJECTTASKVALIDATIONCONTROL: 'projectTaskValidationControl/FETCH_PROJECTTASKVALIDATIONCONTROL',
  CREATE_PROJECTTASKVALIDATIONCONTROL: 'projectTaskValidationControl/CREATE_PROJECTTASKVALIDATIONCONTROL',
  UPDATE_PROJECTTASKVALIDATIONCONTROL: 'projectTaskValidationControl/UPDATE_PROJECTTASKVALIDATIONCONTROL',
  DELETE_PROJECTTASKVALIDATIONCONTROL: 'projectTaskValidationControl/DELETE_PROJECTTASKVALIDATIONCONTROL',
  RESET: 'projectTaskValidationControl/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IProjectTaskValidationControl>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export type ProjectTaskValidationControlState = Readonly<typeof initialState>;

// Reducer

export default (state: ProjectTaskValidationControlState = initialState, action): ProjectTaskValidationControlState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_PROJECTTASKVALIDATIONCONTROL_LIST):
    case REQUEST(ACTION_TYPES.FETCH_PROJECTTASKVALIDATIONCONTROL):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_PROJECTTASKVALIDATIONCONTROL):
    case REQUEST(ACTION_TYPES.UPDATE_PROJECTTASKVALIDATIONCONTROL):
    case REQUEST(ACTION_TYPES.DELETE_PROJECTTASKVALIDATIONCONTROL):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_PROJECTTASKVALIDATIONCONTROL_LIST):
    case FAILURE(ACTION_TYPES.FETCH_PROJECTTASKVALIDATIONCONTROL):
    case FAILURE(ACTION_TYPES.CREATE_PROJECTTASKVALIDATIONCONTROL):
    case FAILURE(ACTION_TYPES.UPDATE_PROJECTTASKVALIDATIONCONTROL):
    case FAILURE(ACTION_TYPES.DELETE_PROJECTTASKVALIDATIONCONTROL):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_PROJECTTASKVALIDATIONCONTROL_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    case SUCCESS(ACTION_TYPES.FETCH_PROJECTTASKVALIDATIONCONTROL):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_PROJECTTASKVALIDATIONCONTROL):
    case SUCCESS(ACTION_TYPES.UPDATE_PROJECTTASKVALIDATIONCONTROL):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_PROJECTTASKVALIDATIONCONTROL):
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

const apiUrl = 'services/microproject/api/project-task-validation-controls';

// Actions

export const getEntities: ICrudGetAllAction<IProjectTaskValidationControl> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_PROJECTTASKVALIDATIONCONTROL_LIST,
    payload: axios.get<IProjectTaskValidationControl>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`),
  };
};

export const getEntity: ICrudGetAction<IProjectTaskValidationControl> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_PROJECTTASKVALIDATIONCONTROL,
    payload: axios.get<IProjectTaskValidationControl>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<IProjectTaskValidationControl> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_PROJECTTASKVALIDATIONCONTROL,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IProjectTaskValidationControl> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_PROJECTTASKVALIDATIONCONTROL,
    payload: axios.put(apiUrl, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IProjectTaskValidationControl> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_PROJECTTASKVALIDATIONCONTROL,
    payload: axios.delete(requestUrl),
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
