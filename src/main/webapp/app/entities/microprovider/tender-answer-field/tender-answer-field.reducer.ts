import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { ITenderAnswerField, defaultValue } from 'app/shared/model/microprovider/tender-answer-field.model';

export const ACTION_TYPES = {
  FETCH_TENDERANSWERFIELD_LIST: 'tenderAnswerField/FETCH_TENDERANSWERFIELD_LIST',
  FETCH_TENDERANSWERFIELD: 'tenderAnswerField/FETCH_TENDERANSWERFIELD',
  CREATE_TENDERANSWERFIELD: 'tenderAnswerField/CREATE_TENDERANSWERFIELD',
  UPDATE_TENDERANSWERFIELD: 'tenderAnswerField/UPDATE_TENDERANSWERFIELD',
  DELETE_TENDERANSWERFIELD: 'tenderAnswerField/DELETE_TENDERANSWERFIELD',
  SET_BLOB: 'tenderAnswerField/SET_BLOB',
  RESET: 'tenderAnswerField/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<ITenderAnswerField>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export type TenderAnswerFieldState = Readonly<typeof initialState>;

// Reducer

export default (state: TenderAnswerFieldState = initialState, action): TenderAnswerFieldState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_TENDERANSWERFIELD_LIST):
    case REQUEST(ACTION_TYPES.FETCH_TENDERANSWERFIELD):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_TENDERANSWERFIELD):
    case REQUEST(ACTION_TYPES.UPDATE_TENDERANSWERFIELD):
    case REQUEST(ACTION_TYPES.DELETE_TENDERANSWERFIELD):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_TENDERANSWERFIELD_LIST):
    case FAILURE(ACTION_TYPES.FETCH_TENDERANSWERFIELD):
    case FAILURE(ACTION_TYPES.CREATE_TENDERANSWERFIELD):
    case FAILURE(ACTION_TYPES.UPDATE_TENDERANSWERFIELD):
    case FAILURE(ACTION_TYPES.DELETE_TENDERANSWERFIELD):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_TENDERANSWERFIELD_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    case SUCCESS(ACTION_TYPES.FETCH_TENDERANSWERFIELD):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_TENDERANSWERFIELD):
    case SUCCESS(ACTION_TYPES.UPDATE_TENDERANSWERFIELD):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_TENDERANSWERFIELD):
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

const apiUrl = 'services/microprovider/api/tender-answer-fields';

// Actions

export const getEntities: ICrudGetAllAction<ITenderAnswerField> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_TENDERANSWERFIELD_LIST,
    payload: axios.get<ITenderAnswerField>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`),
  };
};

export const getEntity: ICrudGetAction<ITenderAnswerField> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_TENDERANSWERFIELD,
    payload: axios.get<ITenderAnswerField>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<ITenderAnswerField> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_TENDERANSWERFIELD,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<ITenderAnswerField> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_TENDERANSWERFIELD,
    payload: axios.put(apiUrl, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<ITenderAnswerField> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_TENDERANSWERFIELD,
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
