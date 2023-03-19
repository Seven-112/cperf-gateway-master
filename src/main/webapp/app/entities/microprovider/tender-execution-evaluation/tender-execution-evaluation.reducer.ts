import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { ITenderExecutionEvaluation, defaultValue } from 'app/shared/model/microprovider/tender-execution-evaluation.model';

export const ACTION_TYPES = {
  FETCH_TENDEREXECUTIONEVALUATION_LIST: 'tenderExecutionEvaluation/FETCH_TENDEREXECUTIONEVALUATION_LIST',
  FETCH_TENDEREXECUTIONEVALUATION: 'tenderExecutionEvaluation/FETCH_TENDEREXECUTIONEVALUATION',
  CREATE_TENDEREXECUTIONEVALUATION: 'tenderExecutionEvaluation/CREATE_TENDEREXECUTIONEVALUATION',
  UPDATE_TENDEREXECUTIONEVALUATION: 'tenderExecutionEvaluation/UPDATE_TENDEREXECUTIONEVALUATION',
  DELETE_TENDEREXECUTIONEVALUATION: 'tenderExecutionEvaluation/DELETE_TENDEREXECUTIONEVALUATION',
  SET_BLOB: 'tenderExecutionEvaluation/SET_BLOB',
  RESET: 'tenderExecutionEvaluation/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<ITenderExecutionEvaluation>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export type TenderExecutionEvaluationState = Readonly<typeof initialState>;

// Reducer

export default (state: TenderExecutionEvaluationState = initialState, action): TenderExecutionEvaluationState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_TENDEREXECUTIONEVALUATION_LIST):
    case REQUEST(ACTION_TYPES.FETCH_TENDEREXECUTIONEVALUATION):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_TENDEREXECUTIONEVALUATION):
    case REQUEST(ACTION_TYPES.UPDATE_TENDEREXECUTIONEVALUATION):
    case REQUEST(ACTION_TYPES.DELETE_TENDEREXECUTIONEVALUATION):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_TENDEREXECUTIONEVALUATION_LIST):
    case FAILURE(ACTION_TYPES.FETCH_TENDEREXECUTIONEVALUATION):
    case FAILURE(ACTION_TYPES.CREATE_TENDEREXECUTIONEVALUATION):
    case FAILURE(ACTION_TYPES.UPDATE_TENDEREXECUTIONEVALUATION):
    case FAILURE(ACTION_TYPES.DELETE_TENDEREXECUTIONEVALUATION):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_TENDEREXECUTIONEVALUATION_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    case SUCCESS(ACTION_TYPES.FETCH_TENDEREXECUTIONEVALUATION):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_TENDEREXECUTIONEVALUATION):
    case SUCCESS(ACTION_TYPES.UPDATE_TENDEREXECUTIONEVALUATION):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_TENDEREXECUTIONEVALUATION):
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

const apiUrl = 'services/microprovider/api/tender-execution-evaluations';

// Actions

export const getEntities: ICrudGetAllAction<ITenderExecutionEvaluation> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_TENDEREXECUTIONEVALUATION_LIST,
    payload: axios.get<ITenderExecutionEvaluation>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`),
  };
};

export const getEntity: ICrudGetAction<ITenderExecutionEvaluation> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_TENDEREXECUTIONEVALUATION,
    payload: axios.get<ITenderExecutionEvaluation>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<ITenderExecutionEvaluation> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_TENDEREXECUTIONEVALUATION,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<ITenderExecutionEvaluation> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_TENDEREXECUTIONEVALUATION,
    payload: axios.put(apiUrl, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<ITenderExecutionEvaluation> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_TENDEREXECUTIONEVALUATION,
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
