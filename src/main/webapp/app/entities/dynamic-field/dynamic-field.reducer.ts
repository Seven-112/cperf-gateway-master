import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IDynamicField, defaultValue } from 'app/shared/model/dynamic-field.model';

export const ACTION_TYPES = {
  FETCH_DYNAMICFIELD_LIST: 'dynamicField/FETCH_DYNAMICFIELD_LIST',
  FETCH_DYNAMICFIELD: 'dynamicField/FETCH_DYNAMICFIELD',
  CREATE_DYNAMICFIELD: 'dynamicField/CREATE_DYNAMICFIELD',
  UPDATE_DYNAMICFIELD: 'dynamicField/UPDATE_DYNAMICFIELD',
  DELETE_DYNAMICFIELD: 'dynamicField/DELETE_DYNAMICFIELD',
  RESET: 'dynamicField/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IDynamicField>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export type DynamicFieldState = Readonly<typeof initialState>;

// Reducer

export default (state: DynamicFieldState = initialState, action): DynamicFieldState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_DYNAMICFIELD_LIST):
    case REQUEST(ACTION_TYPES.FETCH_DYNAMICFIELD):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_DYNAMICFIELD):
    case REQUEST(ACTION_TYPES.UPDATE_DYNAMICFIELD):
    case REQUEST(ACTION_TYPES.DELETE_DYNAMICFIELD):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_DYNAMICFIELD_LIST):
    case FAILURE(ACTION_TYPES.FETCH_DYNAMICFIELD):
    case FAILURE(ACTION_TYPES.CREATE_DYNAMICFIELD):
    case FAILURE(ACTION_TYPES.UPDATE_DYNAMICFIELD):
    case FAILURE(ACTION_TYPES.DELETE_DYNAMICFIELD):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_DYNAMICFIELD_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    case SUCCESS(ACTION_TYPES.FETCH_DYNAMICFIELD):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_DYNAMICFIELD):
    case SUCCESS(ACTION_TYPES.UPDATE_DYNAMICFIELD):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_DYNAMICFIELD):
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

const apiUrl = 'api/dynamic-fields';

// Actions

export const getEntities: ICrudGetAllAction<IDynamicField> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_DYNAMICFIELD_LIST,
    payload: axios.get<IDynamicField>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`),
  };
};

export const getEntity: ICrudGetAction<IDynamicField> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_DYNAMICFIELD,
    payload: axios.get<IDynamicField>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<IDynamicField> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_DYNAMICFIELD,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IDynamicField> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_DYNAMICFIELD,
    payload: axios.put(apiUrl, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IDynamicField> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_DYNAMICFIELD,
    payload: axios.delete(requestUrl),
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
