import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { IPartenerCategoryValidator, defaultValue } from 'app/shared/model/micropartener/partener-category-validator.model';

export const ACTION_TYPES = {
  FETCH_PARTENERCATEGORYVALIDATOR_LIST: 'partenerCategoryValidator/FETCH_PARTENERCATEGORYVALIDATOR_LIST',
  FETCH_PARTENERCATEGORYVALIDATOR: 'partenerCategoryValidator/FETCH_PARTENERCATEGORYVALIDATOR',
  CREATE_PARTENERCATEGORYVALIDATOR: 'partenerCategoryValidator/CREATE_PARTENERCATEGORYVALIDATOR',
  UPDATE_PARTENERCATEGORYVALIDATOR: 'partenerCategoryValidator/UPDATE_PARTENERCATEGORYVALIDATOR',
  DELETE_PARTENERCATEGORYVALIDATOR: 'partenerCategoryValidator/DELETE_PARTENERCATEGORYVALIDATOR',
  RESET: 'partenerCategoryValidator/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IPartenerCategoryValidator>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export type PartenerCategoryValidatorState = Readonly<typeof initialState>;

// Reducer

export default (state: PartenerCategoryValidatorState = initialState, action): PartenerCategoryValidatorState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_PARTENERCATEGORYVALIDATOR_LIST):
    case REQUEST(ACTION_TYPES.FETCH_PARTENERCATEGORYVALIDATOR):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_PARTENERCATEGORYVALIDATOR):
    case REQUEST(ACTION_TYPES.UPDATE_PARTENERCATEGORYVALIDATOR):
    case REQUEST(ACTION_TYPES.DELETE_PARTENERCATEGORYVALIDATOR):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_PARTENERCATEGORYVALIDATOR_LIST):
    case FAILURE(ACTION_TYPES.FETCH_PARTENERCATEGORYVALIDATOR):
    case FAILURE(ACTION_TYPES.CREATE_PARTENERCATEGORYVALIDATOR):
    case FAILURE(ACTION_TYPES.UPDATE_PARTENERCATEGORYVALIDATOR):
    case FAILURE(ACTION_TYPES.DELETE_PARTENERCATEGORYVALIDATOR):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_PARTENERCATEGORYVALIDATOR_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    case SUCCESS(ACTION_TYPES.FETCH_PARTENERCATEGORYVALIDATOR):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_PARTENERCATEGORYVALIDATOR):
    case SUCCESS(ACTION_TYPES.UPDATE_PARTENERCATEGORYVALIDATOR):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_PARTENERCATEGORYVALIDATOR):
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

const apiUrl = 'services/micropartener/api/partener-category-validators';

// Actions

export const getEntities: ICrudGetAllAction<IPartenerCategoryValidator> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_PARTENERCATEGORYVALIDATOR_LIST,
    payload: axios.get<IPartenerCategoryValidator>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`),
  };
};

export const getEntity: ICrudGetAction<IPartenerCategoryValidator> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_PARTENERCATEGORYVALIDATOR,
    payload: axios.get<IPartenerCategoryValidator>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<IPartenerCategoryValidator> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_PARTENERCATEGORYVALIDATOR,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IPartenerCategoryValidator> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_PARTENERCATEGORYVALIDATOR,
    payload: axios.put(apiUrl, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IPartenerCategoryValidator> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_PARTENERCATEGORYVALIDATOR,
    payload: axios.delete(requestUrl),
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
