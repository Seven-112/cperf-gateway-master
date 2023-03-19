import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { IPartenerField, defaultValue } from 'app/shared/model/micropartener/partener-field.model';

export const ACTION_TYPES = {
  FETCH_PARTENERFIELD_LIST: 'partenerField/FETCH_PARTENERFIELD_LIST',
  FETCH_PARTENERFIELD: 'partenerField/FETCH_PARTENERFIELD',
  CREATE_PARTENERFIELD: 'partenerField/CREATE_PARTENERFIELD',
  UPDATE_PARTENERFIELD: 'partenerField/UPDATE_PARTENERFIELD',
  DELETE_PARTENERFIELD: 'partenerField/DELETE_PARTENERFIELD',
  RESET: 'partenerField/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IPartenerField>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export type PartenerFieldState = Readonly<typeof initialState>;

// Reducer

export default (state: PartenerFieldState = initialState, action): PartenerFieldState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_PARTENERFIELD_LIST):
    case REQUEST(ACTION_TYPES.FETCH_PARTENERFIELD):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_PARTENERFIELD):
    case REQUEST(ACTION_TYPES.UPDATE_PARTENERFIELD):
    case REQUEST(ACTION_TYPES.DELETE_PARTENERFIELD):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_PARTENERFIELD_LIST):
    case FAILURE(ACTION_TYPES.FETCH_PARTENERFIELD):
    case FAILURE(ACTION_TYPES.CREATE_PARTENERFIELD):
    case FAILURE(ACTION_TYPES.UPDATE_PARTENERFIELD):
    case FAILURE(ACTION_TYPES.DELETE_PARTENERFIELD):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_PARTENERFIELD_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    case SUCCESS(ACTION_TYPES.FETCH_PARTENERFIELD):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_PARTENERFIELD):
    case SUCCESS(ACTION_TYPES.UPDATE_PARTENERFIELD):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_PARTENERFIELD):
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

const apiUrl = 'services/micropartener/api/partener-fields';

// Actions

export const getEntities: ICrudGetAllAction<IPartenerField> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_PARTENERFIELD_LIST,
    payload: axios.get<IPartenerField>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`),
  };
};

export const getEntity: ICrudGetAction<IPartenerField> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_PARTENERFIELD,
    payload: axios.get<IPartenerField>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<IPartenerField> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_PARTENERFIELD,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IPartenerField> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_PARTENERFIELD,
    payload: axios.put(apiUrl, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IPartenerField> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_PARTENERFIELD,
    payload: axios.delete(requestUrl),
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
