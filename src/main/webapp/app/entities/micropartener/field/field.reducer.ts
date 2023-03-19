import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { IField, defaultValue } from 'app/shared/model/micropartener/field.model';

export const ACTION_TYPES = {
  FETCH_FIELD_LIST: 'field/FETCH_FIELD_LIST',
  FETCH_FIELD: 'field/FETCH_FIELD',
  CREATE_FIELD: 'field/CREATE_FIELD',
  UPDATE_FIELD: 'field/UPDATE_FIELD',
  DELETE_FIELD: 'field/DELETE_FIELD',
  RESET: 'field/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IField>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export type FieldState = Readonly<typeof initialState>;

// Reducer

export default (state: FieldState = initialState, action): FieldState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_FIELD_LIST):
    case REQUEST(ACTION_TYPES.FETCH_FIELD):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_FIELD):
    case REQUEST(ACTION_TYPES.UPDATE_FIELD):
    case REQUEST(ACTION_TYPES.DELETE_FIELD):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_FIELD_LIST):
    case FAILURE(ACTION_TYPES.FETCH_FIELD):
    case FAILURE(ACTION_TYPES.CREATE_FIELD):
    case FAILURE(ACTION_TYPES.UPDATE_FIELD):
    case FAILURE(ACTION_TYPES.DELETE_FIELD):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_FIELD_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    case SUCCESS(ACTION_TYPES.FETCH_FIELD):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_FIELD):
    case SUCCESS(ACTION_TYPES.UPDATE_FIELD):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_FIELD):
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

const apiUrl = 'services/micropartener/api/fields';

// Actions

export const getEntities: ICrudGetAllAction<IField> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_FIELD_LIST,
    payload: axios.get<IField>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`),
  };
};

export const getEntity: ICrudGetAction<IField> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_FIELD,
    payload: axios.get<IField>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<IField> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_FIELD,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IField> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_FIELD,
    payload: axios.put(apiUrl, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IField> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_FIELD,
    payload: axios.delete(requestUrl),
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
