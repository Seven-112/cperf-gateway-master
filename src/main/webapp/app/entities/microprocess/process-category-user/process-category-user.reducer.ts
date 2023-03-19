import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { IProcessCategoryUser, defaultValue } from 'app/shared/model/microprocess/process-category-user.model';

export const ACTION_TYPES = {
  FETCH_PROCESSCATEGORYUSER_LIST: 'processCategoryUser/FETCH_PROCESSCATEGORYUSER_LIST',
  FETCH_PROCESSCATEGORYUSER: 'processCategoryUser/FETCH_PROCESSCATEGORYUSER',
  CREATE_PROCESSCATEGORYUSER: 'processCategoryUser/CREATE_PROCESSCATEGORYUSER',
  UPDATE_PROCESSCATEGORYUSER: 'processCategoryUser/UPDATE_PROCESSCATEGORYUSER',
  DELETE_PROCESSCATEGORYUSER: 'processCategoryUser/DELETE_PROCESSCATEGORYUSER',
  RESET: 'processCategoryUser/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IProcessCategoryUser>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export type ProcessCategoryUserState = Readonly<typeof initialState>;

// Reducer

export default (state: ProcessCategoryUserState = initialState, action): ProcessCategoryUserState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_PROCESSCATEGORYUSER_LIST):
    case REQUEST(ACTION_TYPES.FETCH_PROCESSCATEGORYUSER):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_PROCESSCATEGORYUSER):
    case REQUEST(ACTION_TYPES.UPDATE_PROCESSCATEGORYUSER):
    case REQUEST(ACTION_TYPES.DELETE_PROCESSCATEGORYUSER):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_PROCESSCATEGORYUSER_LIST):
    case FAILURE(ACTION_TYPES.FETCH_PROCESSCATEGORYUSER):
    case FAILURE(ACTION_TYPES.CREATE_PROCESSCATEGORYUSER):
    case FAILURE(ACTION_TYPES.UPDATE_PROCESSCATEGORYUSER):
    case FAILURE(ACTION_TYPES.DELETE_PROCESSCATEGORYUSER):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_PROCESSCATEGORYUSER_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    case SUCCESS(ACTION_TYPES.FETCH_PROCESSCATEGORYUSER):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_PROCESSCATEGORYUSER):
    case SUCCESS(ACTION_TYPES.UPDATE_PROCESSCATEGORYUSER):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_PROCESSCATEGORYUSER):
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

const apiUrl = 'services/microprocess/api/process-category-users';

// Actions

export const getEntities: ICrudGetAllAction<IProcessCategoryUser> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_PROCESSCATEGORYUSER_LIST,
    payload: axios.get<IProcessCategoryUser>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`),
  };
};

export const getEntity: ICrudGetAction<IProcessCategoryUser> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_PROCESSCATEGORYUSER,
    payload: axios.get<IProcessCategoryUser>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<IProcessCategoryUser> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_PROCESSCATEGORYUSER,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IProcessCategoryUser> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_PROCESSCATEGORYUSER,
    payload: axios.put(apiUrl, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IProcessCategoryUser> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_PROCESSCATEGORYUSER,
    payload: axios.delete(requestUrl),
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
