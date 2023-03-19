import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { IQueryFieldResponse, defaultValue } from 'app/shared/model/qmanager/query-field-response.model';

export const ACTION_TYPES = {
  FETCH_QUERYFIELDRESPONSE_LIST: 'queryFieldResponse/FETCH_QUERYFIELDRESPONSE_LIST',
  FETCH_QUERYFIELDRESPONSE: 'queryFieldResponse/FETCH_QUERYFIELDRESPONSE',
  CREATE_QUERYFIELDRESPONSE: 'queryFieldResponse/CREATE_QUERYFIELDRESPONSE',
  UPDATE_QUERYFIELDRESPONSE: 'queryFieldResponse/UPDATE_QUERYFIELDRESPONSE',
  DELETE_QUERYFIELDRESPONSE: 'queryFieldResponse/DELETE_QUERYFIELDRESPONSE',
  SET_BLOB: 'queryFieldResponse/SET_BLOB',
  RESET: 'queryFieldResponse/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IQueryFieldResponse>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export type QueryFieldResponseState = Readonly<typeof initialState>;

// Reducer

export default (state: QueryFieldResponseState = initialState, action): QueryFieldResponseState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_QUERYFIELDRESPONSE_LIST):
    case REQUEST(ACTION_TYPES.FETCH_QUERYFIELDRESPONSE):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_QUERYFIELDRESPONSE):
    case REQUEST(ACTION_TYPES.UPDATE_QUERYFIELDRESPONSE):
    case REQUEST(ACTION_TYPES.DELETE_QUERYFIELDRESPONSE):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_QUERYFIELDRESPONSE_LIST):
    case FAILURE(ACTION_TYPES.FETCH_QUERYFIELDRESPONSE):
    case FAILURE(ACTION_TYPES.CREATE_QUERYFIELDRESPONSE):
    case FAILURE(ACTION_TYPES.UPDATE_QUERYFIELDRESPONSE):
    case FAILURE(ACTION_TYPES.DELETE_QUERYFIELDRESPONSE):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_QUERYFIELDRESPONSE_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    case SUCCESS(ACTION_TYPES.FETCH_QUERYFIELDRESPONSE):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_QUERYFIELDRESPONSE):
    case SUCCESS(ACTION_TYPES.UPDATE_QUERYFIELDRESPONSE):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_QUERYFIELDRESPONSE):
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

const apiUrl = 'services/qmanager/api/query-field-responses';

// Actions

export const getEntities: ICrudGetAllAction<IQueryFieldResponse> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_QUERYFIELDRESPONSE_LIST,
    payload: axios.get<IQueryFieldResponse>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`),
  };
};

export const getEntity: ICrudGetAction<IQueryFieldResponse> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_QUERYFIELDRESPONSE,
    payload: axios.get<IQueryFieldResponse>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<IQueryFieldResponse> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_QUERYFIELDRESPONSE,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IQueryFieldResponse> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_QUERYFIELDRESPONSE,
    payload: axios.put(apiUrl, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IQueryFieldResponse> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_QUERYFIELDRESPONSE,
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
