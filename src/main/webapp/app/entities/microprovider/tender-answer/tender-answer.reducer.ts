import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { ITenderAnswer, defaultValue } from 'app/shared/model/microprovider/tender-answer.model';

export const ACTION_TYPES = {
  FETCH_TENDERANSWER_LIST: 'tenderAnswer/FETCH_TENDERANSWER_LIST',
  FETCH_TENDERANSWER: 'tenderAnswer/FETCH_TENDERANSWER',
  CREATE_TENDERANSWER: 'tenderAnswer/CREATE_TENDERANSWER',
  UPDATE_TENDERANSWER: 'tenderAnswer/UPDATE_TENDERANSWER',
  DELETE_TENDERANSWER: 'tenderAnswer/DELETE_TENDERANSWER',
  SET_BLOB: 'tenderAnswer/SET_BLOB',
  RESET: 'tenderAnswer/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<ITenderAnswer>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export type TenderAnswerState = Readonly<typeof initialState>;

// Reducer

export default (state: TenderAnswerState = initialState, action): TenderAnswerState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_TENDERANSWER_LIST):
    case REQUEST(ACTION_TYPES.FETCH_TENDERANSWER):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_TENDERANSWER):
    case REQUEST(ACTION_TYPES.UPDATE_TENDERANSWER):
    case REQUEST(ACTION_TYPES.DELETE_TENDERANSWER):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_TENDERANSWER_LIST):
    case FAILURE(ACTION_TYPES.FETCH_TENDERANSWER):
    case FAILURE(ACTION_TYPES.CREATE_TENDERANSWER):
    case FAILURE(ACTION_TYPES.UPDATE_TENDERANSWER):
    case FAILURE(ACTION_TYPES.DELETE_TENDERANSWER):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_TENDERANSWER_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    case SUCCESS(ACTION_TYPES.FETCH_TENDERANSWER):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_TENDERANSWER):
    case SUCCESS(ACTION_TYPES.UPDATE_TENDERANSWER):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_TENDERANSWER):
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

const apiUrl = 'services/microprovider/api/tender-answers';

// Actions

export const getEntities: ICrudGetAllAction<ITenderAnswer> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_TENDERANSWER_LIST,
    payload: axios.get<ITenderAnswer>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`),
  };
};

export const getEntity: ICrudGetAction<ITenderAnswer> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_TENDERANSWER,
    payload: axios.get<ITenderAnswer>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<ITenderAnswer> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_TENDERANSWER,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<ITenderAnswer> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_TENDERANSWER,
    payload: axios.put(apiUrl, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<ITenderAnswer> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_TENDERANSWER,
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
