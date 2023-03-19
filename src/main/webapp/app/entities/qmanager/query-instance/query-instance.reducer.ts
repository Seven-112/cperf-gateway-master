import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IQueryInstance, defaultValue } from 'app/shared/model/qmanager/query-instance.model';

export const ACTION_TYPES = {
  FETCH_QUERYINSTANCE_LIST: 'queryInstance/FETCH_QUERYINSTANCE_LIST',
  FETCH_QUERYINSTANCE: 'queryInstance/FETCH_QUERYINSTANCE',
  CREATE_QUERYINSTANCE: 'queryInstance/CREATE_QUERYINSTANCE',
  UPDATE_QUERYINSTANCE: 'queryInstance/UPDATE_QUERYINSTANCE',
  DELETE_QUERYINSTANCE: 'queryInstance/DELETE_QUERYINSTANCE',
  RESET: 'queryInstance/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IQueryInstance>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export type QueryInstanceState = Readonly<typeof initialState>;

// Reducer

export default (state: QueryInstanceState = initialState, action): QueryInstanceState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_QUERYINSTANCE_LIST):
    case REQUEST(ACTION_TYPES.FETCH_QUERYINSTANCE):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_QUERYINSTANCE):
    case REQUEST(ACTION_TYPES.UPDATE_QUERYINSTANCE):
    case REQUEST(ACTION_TYPES.DELETE_QUERYINSTANCE):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_QUERYINSTANCE_LIST):
    case FAILURE(ACTION_TYPES.FETCH_QUERYINSTANCE):
    case FAILURE(ACTION_TYPES.CREATE_QUERYINSTANCE):
    case FAILURE(ACTION_TYPES.UPDATE_QUERYINSTANCE):
    case FAILURE(ACTION_TYPES.DELETE_QUERYINSTANCE):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_QUERYINSTANCE_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    case SUCCESS(ACTION_TYPES.FETCH_QUERYINSTANCE):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_QUERYINSTANCE):
    case SUCCESS(ACTION_TYPES.UPDATE_QUERYINSTANCE):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_QUERYINSTANCE):
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

const apiUrl = 'services/qmanager/api/query-instances';

// Actions

export const getEntities: ICrudGetAllAction<IQueryInstance> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_QUERYINSTANCE_LIST,
    payload: axios.get<IQueryInstance>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`),
  };
};

export const getEntity: ICrudGetAction<IQueryInstance> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_QUERYINSTANCE,
    payload: axios.get<IQueryInstance>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<IQueryInstance> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_QUERYINSTANCE,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IQueryInstance> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_QUERYINSTANCE,
    payload: axios.put(apiUrl, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IQueryInstance> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_QUERYINSTANCE,
    payload: axios.delete(requestUrl),
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
