import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { IPartener, defaultValue } from 'app/shared/model/micropartener/partener.model';

export const ACTION_TYPES = {
  FETCH_PARTENER_LIST: 'partener/FETCH_PARTENER_LIST',
  FETCH_PARTENER: 'partener/FETCH_PARTENER',
  CREATE_PARTENER: 'partener/CREATE_PARTENER',
  UPDATE_PARTENER: 'partener/UPDATE_PARTENER',
  DELETE_PARTENER: 'partener/DELETE_PARTENER',
  RESET: 'partener/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IPartener>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export type PartenerState = Readonly<typeof initialState>;

// Reducer

export default (state: PartenerState = initialState, action): PartenerState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_PARTENER_LIST):
    case REQUEST(ACTION_TYPES.FETCH_PARTENER):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_PARTENER):
    case REQUEST(ACTION_TYPES.UPDATE_PARTENER):
    case REQUEST(ACTION_TYPES.DELETE_PARTENER):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_PARTENER_LIST):
    case FAILURE(ACTION_TYPES.FETCH_PARTENER):
    case FAILURE(ACTION_TYPES.CREATE_PARTENER):
    case FAILURE(ACTION_TYPES.UPDATE_PARTENER):
    case FAILURE(ACTION_TYPES.DELETE_PARTENER):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_PARTENER_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    case SUCCESS(ACTION_TYPES.FETCH_PARTENER):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_PARTENER):
    case SUCCESS(ACTION_TYPES.UPDATE_PARTENER):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_PARTENER):
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

const apiUrl = 'services/micropartener/api/parteners';

// Actions

export const getEntities: ICrudGetAllAction<IPartener> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_PARTENER_LIST,
    payload: axios.get<IPartener>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`),
  };
};

export const getEntity: ICrudGetAction<IPartener> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_PARTENER,
    payload: axios.get<IPartener>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<IPartener> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_PARTENER,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IPartener> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_PARTENER,
    payload: axios.put(apiUrl, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IPartener> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_PARTENER,
    payload: axios.delete(requestUrl),
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
