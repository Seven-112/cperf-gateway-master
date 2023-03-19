import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IQueryInstanceValidation, defaultValue } from 'app/shared/model/qmanager/query-instance-validation.model';

export const ACTION_TYPES = {
  FETCH_QUERYINSTANCEVALIDATION_LIST: 'queryInstanceValidation/FETCH_QUERYINSTANCEVALIDATION_LIST',
  FETCH_QUERYINSTANCEVALIDATION: 'queryInstanceValidation/FETCH_QUERYINSTANCEVALIDATION',
  CREATE_QUERYINSTANCEVALIDATION: 'queryInstanceValidation/CREATE_QUERYINSTANCEVALIDATION',
  UPDATE_QUERYINSTANCEVALIDATION: 'queryInstanceValidation/UPDATE_QUERYINSTANCEVALIDATION',
  DELETE_QUERYINSTANCEVALIDATION: 'queryInstanceValidation/DELETE_QUERYINSTANCEVALIDATION',
  SET_BLOB: 'queryInstanceValidation/SET_BLOB',
  RESET: 'queryInstanceValidation/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IQueryInstanceValidation>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export type QueryInstanceValidationState = Readonly<typeof initialState>;

// Reducer

export default (state: QueryInstanceValidationState = initialState, action): QueryInstanceValidationState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_QUERYINSTANCEVALIDATION_LIST):
    case REQUEST(ACTION_TYPES.FETCH_QUERYINSTANCEVALIDATION):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_QUERYINSTANCEVALIDATION):
    case REQUEST(ACTION_TYPES.UPDATE_QUERYINSTANCEVALIDATION):
    case REQUEST(ACTION_TYPES.DELETE_QUERYINSTANCEVALIDATION):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_QUERYINSTANCEVALIDATION_LIST):
    case FAILURE(ACTION_TYPES.FETCH_QUERYINSTANCEVALIDATION):
    case FAILURE(ACTION_TYPES.CREATE_QUERYINSTANCEVALIDATION):
    case FAILURE(ACTION_TYPES.UPDATE_QUERYINSTANCEVALIDATION):
    case FAILURE(ACTION_TYPES.DELETE_QUERYINSTANCEVALIDATION):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_QUERYINSTANCEVALIDATION_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    case SUCCESS(ACTION_TYPES.FETCH_QUERYINSTANCEVALIDATION):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_QUERYINSTANCEVALIDATION):
    case SUCCESS(ACTION_TYPES.UPDATE_QUERYINSTANCEVALIDATION):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_QUERYINSTANCEVALIDATION):
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

const apiUrl = 'services/qmanager/api/query-instance-validations';

// Actions

export const getEntities: ICrudGetAllAction<IQueryInstanceValidation> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_QUERYINSTANCEVALIDATION_LIST,
    payload: axios.get<IQueryInstanceValidation>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`),
  };
};

export const getEntity: ICrudGetAction<IQueryInstanceValidation> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_QUERYINSTANCEVALIDATION,
    payload: axios.get<IQueryInstanceValidation>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<IQueryInstanceValidation> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_QUERYINSTANCEVALIDATION,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IQueryInstanceValidation> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_QUERYINSTANCEVALIDATION,
    payload: axios.put(apiUrl, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IQueryInstanceValidation> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_QUERYINSTANCEVALIDATION,
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
