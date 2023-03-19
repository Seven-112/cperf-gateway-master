import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { IPartenerCategory, defaultValue } from 'app/shared/model/micropartener/partener-category.model';

export const ACTION_TYPES = {
  FETCH_PARTENERCATEGORY_LIST: 'partenerCategory/FETCH_PARTENERCATEGORY_LIST',
  FETCH_PARTENERCATEGORY: 'partenerCategory/FETCH_PARTENERCATEGORY',
  CREATE_PARTENERCATEGORY: 'partenerCategory/CREATE_PARTENERCATEGORY',
  UPDATE_PARTENERCATEGORY: 'partenerCategory/UPDATE_PARTENERCATEGORY',
  DELETE_PARTENERCATEGORY: 'partenerCategory/DELETE_PARTENERCATEGORY',
  RESET: 'partenerCategory/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IPartenerCategory>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export type PartenerCategoryState = Readonly<typeof initialState>;

// Reducer

export default (state: PartenerCategoryState = initialState, action): PartenerCategoryState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_PARTENERCATEGORY_LIST):
    case REQUEST(ACTION_TYPES.FETCH_PARTENERCATEGORY):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_PARTENERCATEGORY):
    case REQUEST(ACTION_TYPES.UPDATE_PARTENERCATEGORY):
    case REQUEST(ACTION_TYPES.DELETE_PARTENERCATEGORY):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_PARTENERCATEGORY_LIST):
    case FAILURE(ACTION_TYPES.FETCH_PARTENERCATEGORY):
    case FAILURE(ACTION_TYPES.CREATE_PARTENERCATEGORY):
    case FAILURE(ACTION_TYPES.UPDATE_PARTENERCATEGORY):
    case FAILURE(ACTION_TYPES.DELETE_PARTENERCATEGORY):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_PARTENERCATEGORY_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    case SUCCESS(ACTION_TYPES.FETCH_PARTENERCATEGORY):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_PARTENERCATEGORY):
    case SUCCESS(ACTION_TYPES.UPDATE_PARTENERCATEGORY):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_PARTENERCATEGORY):
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

const apiUrl = 'services/micropartener/api/partener-categories';

// Actions

export const getEntities: ICrudGetAllAction<IPartenerCategory> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_PARTENERCATEGORY_LIST,
    payload: axios.get<IPartenerCategory>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`),
  };
};

export const getEntity: ICrudGetAction<IPartenerCategory> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_PARTENERCATEGORY,
    payload: axios.get<IPartenerCategory>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<IPartenerCategory> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_PARTENERCATEGORY,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IPartenerCategory> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_PARTENERCATEGORY,
    payload: axios.put(apiUrl, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IPartenerCategory> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_PARTENERCATEGORY,
    payload: axios.delete(requestUrl),
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
