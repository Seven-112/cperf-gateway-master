import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { IJustification, defaultValue } from 'app/shared/model/microprocess/justification.model';

export const ACTION_TYPES = {
  FETCH_JUSTIFICATION_LIST: 'justification/FETCH_JUSTIFICATION_LIST',
  FETCH_JUSTIFICATION: 'justification/FETCH_JUSTIFICATION',
  CREATE_JUSTIFICATION: 'justification/CREATE_JUSTIFICATION',
  UPDATE_JUSTIFICATION: 'justification/UPDATE_JUSTIFICATION',
  DELETE_JUSTIFICATION: 'justification/DELETE_JUSTIFICATION',
  RESET: 'justification/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IJustification>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export type JustificationState = Readonly<typeof initialState>;

// Reducer

export default (state: JustificationState = initialState, action): JustificationState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_JUSTIFICATION_LIST):
    case REQUEST(ACTION_TYPES.FETCH_JUSTIFICATION):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_JUSTIFICATION):
    case REQUEST(ACTION_TYPES.UPDATE_JUSTIFICATION):
    case REQUEST(ACTION_TYPES.DELETE_JUSTIFICATION):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_JUSTIFICATION_LIST):
    case FAILURE(ACTION_TYPES.FETCH_JUSTIFICATION):
    case FAILURE(ACTION_TYPES.CREATE_JUSTIFICATION):
    case FAILURE(ACTION_TYPES.UPDATE_JUSTIFICATION):
    case FAILURE(ACTION_TYPES.DELETE_JUSTIFICATION):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_JUSTIFICATION_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    case SUCCESS(ACTION_TYPES.FETCH_JUSTIFICATION):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_JUSTIFICATION):
    case SUCCESS(ACTION_TYPES.UPDATE_JUSTIFICATION):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_JUSTIFICATION):
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

const apiUrl = 'services/microprocess/api/justifications';

// Actions

export const getEntities: ICrudGetAllAction<IJustification> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_JUSTIFICATION_LIST,
    payload: axios.get<IJustification>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`),
  };
};

export const getEntity: ICrudGetAction<IJustification> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_JUSTIFICATION,
    payload: axios.get<IJustification>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<IJustification> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_JUSTIFICATION,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IJustification> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_JUSTIFICATION,
    payload: axios.put(apiUrl, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IJustification> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_JUSTIFICATION,
    payload: axios.delete(requestUrl),
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
