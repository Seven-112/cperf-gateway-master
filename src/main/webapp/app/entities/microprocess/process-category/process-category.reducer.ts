import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { IProcessCategory, defaultValue } from 'app/shared/model/microprocess/process-category.model';

export const ACTION_TYPES = {
  FETCH_PROCESSCATEGORY_LIST: 'processCategory/FETCH_PROCESSCATEGORY_LIST',
  FETCH_PROCESSCATEGORY_ALL: 'processCategory/FETCH_PROCESSCATEGORY_ALL',
  FETCH_PROCESSCATEGORY: 'processCategory/FETCH_PROCESSCATEGORY',
  CREATE_PROCESSCATEGORY: 'processCategory/CREATE_PROCESSCATEGORY',
  UPDATE_PROCESSCATEGORY: 'processCategory/UPDATE_PROCESSCATEGORY',
  DELETE_PROCESSCATEGORY: 'processCategory/DELETE_PROCESSCATEGORY',
  RESET: 'processCategory/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IProcessCategory>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export type ProcessCategoryState = Readonly<typeof initialState>;

// Reducer

export default (state: ProcessCategoryState = initialState, action): ProcessCategoryState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_PROCESSCATEGORY_LIST):
    case REQUEST(ACTION_TYPES.FETCH_PROCESSCATEGORY):
    case REQUEST(ACTION_TYPES.FETCH_PROCESSCATEGORY_ALL):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_PROCESSCATEGORY):
    case REQUEST(ACTION_TYPES.UPDATE_PROCESSCATEGORY):
    case REQUEST(ACTION_TYPES.DELETE_PROCESSCATEGORY):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_PROCESSCATEGORY_LIST):
    case FAILURE(ACTION_TYPES.FETCH_PROCESSCATEGORY_ALL):
    case FAILURE(ACTION_TYPES.FETCH_PROCESSCATEGORY):
    case FAILURE(ACTION_TYPES.CREATE_PROCESSCATEGORY):
    case FAILURE(ACTION_TYPES.UPDATE_PROCESSCATEGORY):
    case FAILURE(ACTION_TYPES.DELETE_PROCESSCATEGORY):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_PROCESSCATEGORY_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    case SUCCESS(ACTION_TYPES.FETCH_PROCESSCATEGORY_ALL):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.FETCH_PROCESSCATEGORY):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_PROCESSCATEGORY):
    case SUCCESS(ACTION_TYPES.UPDATE_PROCESSCATEGORY):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_PROCESSCATEGORY):
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

const apiUrl = 'services/microprocess/api/process-categories';

// Actions

export const getEntities: ICrudGetAllAction<IProcessCategory> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_PROCESSCATEGORY_LIST,
    payload: axios.get<IProcessCategory>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`),
  };
};

export const getAllEntities: ICrudGetAllAction<IProcessCategory> = () => {
  const requestUrl = `${apiUrl}/all`;
  return {
    type: ACTION_TYPES.FETCH_PROCESSCATEGORY_ALL,
    payload: axios.get<IProcessCategory>(`${requestUrl}`),
  };
};

export const getEntity: ICrudGetAction<IProcessCategory> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_PROCESSCATEGORY,
    payload: axios.get<IProcessCategory>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<IProcessCategory> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_PROCESSCATEGORY,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IProcessCategory> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_PROCESSCATEGORY,
    payload: axios.put(apiUrl, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IProcessCategory> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_PROCESSCATEGORY,
    payload: axios.delete(requestUrl),
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
