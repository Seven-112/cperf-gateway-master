import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IItemCheckJustification, defaultValue } from 'app/shared/model/microprocess/item-check-justification.model';

export const ACTION_TYPES = {
  FETCH_ITEMCHECKJUSTIFICATION_LIST: 'itemCheckJustification/FETCH_ITEMCHECKJUSTIFICATION_LIST',
  FETCH_ITEMCHECKJUSTIFICATION: 'itemCheckJustification/FETCH_ITEMCHECKJUSTIFICATION',
  CREATE_ITEMCHECKJUSTIFICATION: 'itemCheckJustification/CREATE_ITEMCHECKJUSTIFICATION',
  UPDATE_ITEMCHECKJUSTIFICATION: 'itemCheckJustification/UPDATE_ITEMCHECKJUSTIFICATION',
  DELETE_ITEMCHECKJUSTIFICATION: 'itemCheckJustification/DELETE_ITEMCHECKJUSTIFICATION',
  SET_BLOB: 'itemCheckJustification/SET_BLOB',
  RESET: 'itemCheckJustification/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IItemCheckJustification>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export type ItemCheckJustificationState = Readonly<typeof initialState>;

// Reducer

export default (state: ItemCheckJustificationState = initialState, action): ItemCheckJustificationState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_ITEMCHECKJUSTIFICATION_LIST):
    case REQUEST(ACTION_TYPES.FETCH_ITEMCHECKJUSTIFICATION):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_ITEMCHECKJUSTIFICATION):
    case REQUEST(ACTION_TYPES.UPDATE_ITEMCHECKJUSTIFICATION):
    case REQUEST(ACTION_TYPES.DELETE_ITEMCHECKJUSTIFICATION):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_ITEMCHECKJUSTIFICATION_LIST):
    case FAILURE(ACTION_TYPES.FETCH_ITEMCHECKJUSTIFICATION):
    case FAILURE(ACTION_TYPES.CREATE_ITEMCHECKJUSTIFICATION):
    case FAILURE(ACTION_TYPES.UPDATE_ITEMCHECKJUSTIFICATION):
    case FAILURE(ACTION_TYPES.DELETE_ITEMCHECKJUSTIFICATION):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_ITEMCHECKJUSTIFICATION_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    case SUCCESS(ACTION_TYPES.FETCH_ITEMCHECKJUSTIFICATION):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_ITEMCHECKJUSTIFICATION):
    case SUCCESS(ACTION_TYPES.UPDATE_ITEMCHECKJUSTIFICATION):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_ITEMCHECKJUSTIFICATION):
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

const apiUrl = 'services/microprocess/api/item-check-justifications';

// Actions

export const getEntities: ICrudGetAllAction<IItemCheckJustification> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_ITEMCHECKJUSTIFICATION_LIST,
    payload: axios.get<IItemCheckJustification>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`),
  };
};

export const getEntity: ICrudGetAction<IItemCheckJustification> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_ITEMCHECKJUSTIFICATION,
    payload: axios.get<IItemCheckJustification>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<IItemCheckJustification> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_ITEMCHECKJUSTIFICATION,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IItemCheckJustification> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_ITEMCHECKJUSTIFICATION,
    payload: axios.put(apiUrl, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IItemCheckJustification> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_ITEMCHECKJUSTIFICATION,
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
