import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { IProjectCategory, defaultValue } from 'app/shared/model/microproject/project-category.model';

export const ACTION_TYPES = {
  FETCH_PROJECTCATEGORY_LIST: 'projectCategory/FETCH_PROJECTCATEGORY_LIST',
  FETCH_PROJECTCATEGORY: 'projectCategory/FETCH_PROJECTCATEGORY',
  CREATE_PROJECTCATEGORY: 'projectCategory/CREATE_PROJECTCATEGORY',
  UPDATE_PROJECTCATEGORY: 'projectCategory/UPDATE_PROJECTCATEGORY',
  DELETE_PROJECTCATEGORY: 'projectCategory/DELETE_PROJECTCATEGORY',
  RESET: 'projectCategory/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IProjectCategory>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export type ProjectCategoryState = Readonly<typeof initialState>;

// Reducer

export default (state: ProjectCategoryState = initialState, action): ProjectCategoryState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_PROJECTCATEGORY_LIST):
    case REQUEST(ACTION_TYPES.FETCH_PROJECTCATEGORY):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_PROJECTCATEGORY):
    case REQUEST(ACTION_TYPES.UPDATE_PROJECTCATEGORY):
    case REQUEST(ACTION_TYPES.DELETE_PROJECTCATEGORY):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_PROJECTCATEGORY_LIST):
    case FAILURE(ACTION_TYPES.FETCH_PROJECTCATEGORY):
    case FAILURE(ACTION_TYPES.CREATE_PROJECTCATEGORY):
    case FAILURE(ACTION_TYPES.UPDATE_PROJECTCATEGORY):
    case FAILURE(ACTION_TYPES.DELETE_PROJECTCATEGORY):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_PROJECTCATEGORY_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    case SUCCESS(ACTION_TYPES.FETCH_PROJECTCATEGORY):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_PROJECTCATEGORY):
    case SUCCESS(ACTION_TYPES.UPDATE_PROJECTCATEGORY):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_PROJECTCATEGORY):
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

const apiUrl = 'services/microproject/api/project-categories';

// Actions

export const getEntities: ICrudGetAllAction<IProjectCategory> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_PROJECTCATEGORY_LIST,
    payload: axios.get<IProjectCategory>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`),
  };
};

export const getEntity: ICrudGetAction<IProjectCategory> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_PROJECTCATEGORY,
    payload: axios.get<IProjectCategory>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<IProjectCategory> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_PROJECTCATEGORY,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IProjectCategory> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_PROJECTCATEGORY,
    payload: axios.put(apiUrl, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IProjectCategory> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_PROJECTCATEGORY,
    payload: axios.delete(requestUrl),
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
