import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { IExecutionValidation, defaultValue } from 'app/shared/model/microprovider/execution-validation.model';

export const ACTION_TYPES = {
  FETCH_EXECUTIONVALIDATION_LIST: 'executionValidation/FETCH_EXECUTIONVALIDATION_LIST',
  FETCH_EXECUTIONVALIDATION: 'executionValidation/FETCH_EXECUTIONVALIDATION',
  CREATE_EXECUTIONVALIDATION: 'executionValidation/CREATE_EXECUTIONVALIDATION',
  UPDATE_EXECUTIONVALIDATION: 'executionValidation/UPDATE_EXECUTIONVALIDATION',
  DELETE_EXECUTIONVALIDATION: 'executionValidation/DELETE_EXECUTIONVALIDATION',
  SET_BLOB: 'executionValidation/SET_BLOB',
  RESET: 'executionValidation/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IExecutionValidation>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export type ExecutionValidationState = Readonly<typeof initialState>;

// Reducer

export default (state: ExecutionValidationState = initialState, action): ExecutionValidationState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_EXECUTIONVALIDATION_LIST):
    case REQUEST(ACTION_TYPES.FETCH_EXECUTIONVALIDATION):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_EXECUTIONVALIDATION):
    case REQUEST(ACTION_TYPES.UPDATE_EXECUTIONVALIDATION):
    case REQUEST(ACTION_TYPES.DELETE_EXECUTIONVALIDATION):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_EXECUTIONVALIDATION_LIST):
    case FAILURE(ACTION_TYPES.FETCH_EXECUTIONVALIDATION):
    case FAILURE(ACTION_TYPES.CREATE_EXECUTIONVALIDATION):
    case FAILURE(ACTION_TYPES.UPDATE_EXECUTIONVALIDATION):
    case FAILURE(ACTION_TYPES.DELETE_EXECUTIONVALIDATION):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_EXECUTIONVALIDATION_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    case SUCCESS(ACTION_TYPES.FETCH_EXECUTIONVALIDATION):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_EXECUTIONVALIDATION):
    case SUCCESS(ACTION_TYPES.UPDATE_EXECUTIONVALIDATION):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_EXECUTIONVALIDATION):
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

const apiUrl = 'services/microprovider/api/execution-validations';

// Actions

export const getEntities: ICrudGetAllAction<IExecutionValidation> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_EXECUTIONVALIDATION_LIST,
    payload: axios.get<IExecutionValidation>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`),
  };
};

export const getEntity: ICrudGetAction<IExecutionValidation> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_EXECUTIONVALIDATION,
    payload: axios.get<IExecutionValidation>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<IExecutionValidation> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_EXECUTIONVALIDATION,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IExecutionValidation> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_EXECUTIONVALIDATION,
    payload: axios.put(apiUrl, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IExecutionValidation> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_EXECUTIONVALIDATION,
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
