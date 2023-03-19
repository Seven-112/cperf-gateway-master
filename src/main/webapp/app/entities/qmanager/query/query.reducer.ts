import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { IQuery, defaultValue } from 'app/shared/model/qmanager/query.model';

export const ACTION_TYPES = {
  FETCH_QUERY_LIST: 'query/FETCH_QUERY_LIST',
  FETCH_QUERY: 'query/FETCH_QUERY',
  CREATE_QUERY: 'query/CREATE_QUERY',
  UPDATE_QUERY: 'query/UPDATE_QUERY',
  DELETE_QUERY: 'query/DELETE_QUERY',
  SET_BLOB: 'query/SET_BLOB',
  RESET: 'query/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IQuery>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export type QueryState = Readonly<typeof initialState>;

// Reducer

export default (state: QueryState = initialState, action): QueryState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_QUERY_LIST):
    case REQUEST(ACTION_TYPES.FETCH_QUERY):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_QUERY):
    case REQUEST(ACTION_TYPES.UPDATE_QUERY):
    case REQUEST(ACTION_TYPES.DELETE_QUERY):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_QUERY_LIST):
    case FAILURE(ACTION_TYPES.FETCH_QUERY):
    case FAILURE(ACTION_TYPES.CREATE_QUERY):
    case FAILURE(ACTION_TYPES.UPDATE_QUERY):
    case FAILURE(ACTION_TYPES.DELETE_QUERY):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_QUERY_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    case SUCCESS(ACTION_TYPES.FETCH_QUERY):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_QUERY):
    case SUCCESS(ACTION_TYPES.UPDATE_QUERY):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_QUERY):
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

const apiUrl = 'services/qmanager/api/queries';

// Actions

export const getEntities: ICrudGetAllAction<IQuery> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_QUERY_LIST,
    payload: axios.get<IQuery>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`),
  };
};

export const getEntity: ICrudGetAction<IQuery> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_QUERY,
    payload: axios.get<IQuery>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<IQuery> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_QUERY,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IQuery> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_QUERY,
    payload: axios.put(apiUrl, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IQuery> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_QUERY,
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
