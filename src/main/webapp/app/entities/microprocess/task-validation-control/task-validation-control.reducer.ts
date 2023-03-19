import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { ITaskValidationControl, defaultValue } from 'app/shared/model/microprocess/task-validation-control.model';

export const ACTION_TYPES = {
  FETCH_TASKVALIDATIONCONTROL_LIST: 'taskValidationControl/FETCH_TASKVALIDATIONCONTROL_LIST',
  FETCH_TASKVALIDATIONCONTROL: 'taskValidationControl/FETCH_TASKVALIDATIONCONTROL',
  CREATE_TASKVALIDATIONCONTROL: 'taskValidationControl/CREATE_TASKVALIDATIONCONTROL',
  UPDATE_TASKVALIDATIONCONTROL: 'taskValidationControl/UPDATE_TASKVALIDATIONCONTROL',
  DELETE_TASKVALIDATIONCONTROL: 'taskValidationControl/DELETE_TASKVALIDATIONCONTROL',
  RESET: 'taskValidationControl/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<ITaskValidationControl>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export type TaskValidationControlState = Readonly<typeof initialState>;

// Reducer

export default (state: TaskValidationControlState = initialState, action): TaskValidationControlState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_TASKVALIDATIONCONTROL_LIST):
    case REQUEST(ACTION_TYPES.FETCH_TASKVALIDATIONCONTROL):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_TASKVALIDATIONCONTROL):
    case REQUEST(ACTION_TYPES.UPDATE_TASKVALIDATIONCONTROL):
    case REQUEST(ACTION_TYPES.DELETE_TASKVALIDATIONCONTROL):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_TASKVALIDATIONCONTROL_LIST):
    case FAILURE(ACTION_TYPES.FETCH_TASKVALIDATIONCONTROL):
    case FAILURE(ACTION_TYPES.CREATE_TASKVALIDATIONCONTROL):
    case FAILURE(ACTION_TYPES.UPDATE_TASKVALIDATIONCONTROL):
    case FAILURE(ACTION_TYPES.DELETE_TASKVALIDATIONCONTROL):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_TASKVALIDATIONCONTROL_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    case SUCCESS(ACTION_TYPES.FETCH_TASKVALIDATIONCONTROL):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_TASKVALIDATIONCONTROL):
    case SUCCESS(ACTION_TYPES.UPDATE_TASKVALIDATIONCONTROL):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_TASKVALIDATIONCONTROL):
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

const apiUrl = 'services/microprocess/api/task-validation-controls';

// Actions

export const getEntities: ICrudGetAllAction<ITaskValidationControl> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_TASKVALIDATIONCONTROL_LIST,
    payload: axios.get<ITaskValidationControl>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`),
  };
};

export const getEntity: ICrudGetAction<ITaskValidationControl> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_TASKVALIDATIONCONTROL,
    payload: axios.get<ITaskValidationControl>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<ITaskValidationControl> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_TASKVALIDATIONCONTROL,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<ITaskValidationControl> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_TASKVALIDATIONCONTROL,
    payload: axios.put(apiUrl, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<ITaskValidationControl> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_TASKVALIDATIONCONTROL,
    payload: axios.delete(requestUrl),
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
