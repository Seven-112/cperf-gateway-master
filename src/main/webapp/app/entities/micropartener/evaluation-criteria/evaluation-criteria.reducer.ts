import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { IEvaluationCriteria, defaultValue } from 'app/shared/model/micropartener/evaluation-criteria.model';

export const ACTION_TYPES = {
  FETCH_EVALUATIONCRITERIA_LIST: 'evaluationCriteria/FETCH_EVALUATIONCRITERIA_LIST',
  FETCH_EVALUATIONCRITERIA: 'evaluationCriteria/FETCH_EVALUATIONCRITERIA',
  CREATE_EVALUATIONCRITERIA: 'evaluationCriteria/CREATE_EVALUATIONCRITERIA',
  UPDATE_EVALUATIONCRITERIA: 'evaluationCriteria/UPDATE_EVALUATIONCRITERIA',
  DELETE_EVALUATIONCRITERIA: 'evaluationCriteria/DELETE_EVALUATIONCRITERIA',
  RESET: 'evaluationCriteria/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IEvaluationCriteria>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export type EvaluationCriteriaState = Readonly<typeof initialState>;

// Reducer

export default (state: EvaluationCriteriaState = initialState, action): EvaluationCriteriaState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_EVALUATIONCRITERIA_LIST):
    case REQUEST(ACTION_TYPES.FETCH_EVALUATIONCRITERIA):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_EVALUATIONCRITERIA):
    case REQUEST(ACTION_TYPES.UPDATE_EVALUATIONCRITERIA):
    case REQUEST(ACTION_TYPES.DELETE_EVALUATIONCRITERIA):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_EVALUATIONCRITERIA_LIST):
    case FAILURE(ACTION_TYPES.FETCH_EVALUATIONCRITERIA):
    case FAILURE(ACTION_TYPES.CREATE_EVALUATIONCRITERIA):
    case FAILURE(ACTION_TYPES.UPDATE_EVALUATIONCRITERIA):
    case FAILURE(ACTION_TYPES.DELETE_EVALUATIONCRITERIA):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_EVALUATIONCRITERIA_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    case SUCCESS(ACTION_TYPES.FETCH_EVALUATIONCRITERIA):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_EVALUATIONCRITERIA):
    case SUCCESS(ACTION_TYPES.UPDATE_EVALUATIONCRITERIA):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_EVALUATIONCRITERIA):
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

const apiUrl = 'services/micropartener/api/evaluation-criteria';

// Actions

export const getEntities: ICrudGetAllAction<IEvaluationCriteria> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_EVALUATIONCRITERIA_LIST,
    payload: axios.get<IEvaluationCriteria>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`),
  };
};

export const getEntity: ICrudGetAction<IEvaluationCriteria> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_EVALUATIONCRITERIA,
    payload: axios.get<IEvaluationCriteria>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<IEvaluationCriteria> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_EVALUATIONCRITERIA,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IEvaluationCriteria> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_EVALUATIONCRITERIA,
    payload: axios.put(apiUrl, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IEvaluationCriteria> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_EVALUATIONCRITERIA,
    payload: axios.delete(requestUrl),
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
