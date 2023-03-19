import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { IControl, defaultValue } from 'app/shared/model/microrisque/control.model';

export const ACTION_TYPES = {
  FETCH_CONTROL_LIST: 'control/FETCH_CONTROL_LIST',
  FETCH_CONTROL: 'control/FETCH_CONTROL',
  CREATE_CONTROL: 'control/CREATE_CONTROL',
  UPDATE_CONTROL: 'control/UPDATE_CONTROL',
  DELETE_CONTROL: 'control/DELETE_CONTROL',
  RESET: 'control/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IControl>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export type ControlState = Readonly<typeof initialState>;

// Reducer

export default (state: ControlState = initialState, action): ControlState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_CONTROL_LIST):
    case REQUEST(ACTION_TYPES.FETCH_CONTROL):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_CONTROL):
    case REQUEST(ACTION_TYPES.UPDATE_CONTROL):
    case REQUEST(ACTION_TYPES.DELETE_CONTROL):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_CONTROL_LIST):
    case FAILURE(ACTION_TYPES.FETCH_CONTROL):
    case FAILURE(ACTION_TYPES.CREATE_CONTROL):
    case FAILURE(ACTION_TYPES.UPDATE_CONTROL):
    case FAILURE(ACTION_TYPES.DELETE_CONTROL):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_CONTROL_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    case SUCCESS(ACTION_TYPES.FETCH_CONTROL):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_CONTROL):
    case SUCCESS(ACTION_TYPES.UPDATE_CONTROL):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_CONTROL):
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

const apiUrl = 'services/microrisque/api/controls';

// Actions

export const getEntities: ICrudGetAllAction<IControl> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_CONTROL_LIST,
    payload: axios.get<IControl>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`),
  };
};

export const getEntity: ICrudGetAction<IControl> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_CONTROL,
    payload: axios.get<IControl>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<IControl> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_CONTROL,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IControl> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_CONTROL,
    payload: axios.put(apiUrl, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IControl> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_CONTROL,
    payload: axios.delete(requestUrl),
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
