import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { ITenderAnswerExecution, defaultValue } from 'app/shared/model/microprovider/tender-answer-execution.model';

export const ACTION_TYPES = {
  FETCH_TENDERANSWEREXECUTION_LIST: 'tenderAnswerExecution/FETCH_TENDERANSWEREXECUTION_LIST',
  FETCH_TENDERANSWEREXECUTION: 'tenderAnswerExecution/FETCH_TENDERANSWEREXECUTION',
  CREATE_TENDERANSWEREXECUTION: 'tenderAnswerExecution/CREATE_TENDERANSWEREXECUTION',
  UPDATE_TENDERANSWEREXECUTION: 'tenderAnswerExecution/UPDATE_TENDERANSWEREXECUTION',
  DELETE_TENDERANSWEREXECUTION: 'tenderAnswerExecution/DELETE_TENDERANSWEREXECUTION',
  SET_BLOB: 'tenderAnswerExecution/SET_BLOB',
  RESET: 'tenderAnswerExecution/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<ITenderAnswerExecution>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export type TenderAnswerExecutionState = Readonly<typeof initialState>;

// Reducer

export default (state: TenderAnswerExecutionState = initialState, action): TenderAnswerExecutionState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_TENDERANSWEREXECUTION_LIST):
    case REQUEST(ACTION_TYPES.FETCH_TENDERANSWEREXECUTION):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_TENDERANSWEREXECUTION):
    case REQUEST(ACTION_TYPES.UPDATE_TENDERANSWEREXECUTION):
    case REQUEST(ACTION_TYPES.DELETE_TENDERANSWEREXECUTION):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_TENDERANSWEREXECUTION_LIST):
    case FAILURE(ACTION_TYPES.FETCH_TENDERANSWEREXECUTION):
    case FAILURE(ACTION_TYPES.CREATE_TENDERANSWEREXECUTION):
    case FAILURE(ACTION_TYPES.UPDATE_TENDERANSWEREXECUTION):
    case FAILURE(ACTION_TYPES.DELETE_TENDERANSWEREXECUTION):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_TENDERANSWEREXECUTION_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    case SUCCESS(ACTION_TYPES.FETCH_TENDERANSWEREXECUTION):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_TENDERANSWEREXECUTION):
    case SUCCESS(ACTION_TYPES.UPDATE_TENDERANSWEREXECUTION):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_TENDERANSWEREXECUTION):
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

const apiUrl = 'services/microprovider/api/tender-answer-executions';

// Actions

export const getEntities: ICrudGetAllAction<ITenderAnswerExecution> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_TENDERANSWEREXECUTION_LIST,
    payload: axios.get<ITenderAnswerExecution>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`),
  };
};

export const getEntity: ICrudGetAction<ITenderAnswerExecution> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_TENDERANSWEREXECUTION,
    payload: axios.get<ITenderAnswerExecution>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<ITenderAnswerExecution> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_TENDERANSWEREXECUTION,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<ITenderAnswerExecution> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_TENDERANSWEREXECUTION,
    payload: axios.put(apiUrl, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<ITenderAnswerExecution> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_TENDERANSWEREXECUTION,
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
