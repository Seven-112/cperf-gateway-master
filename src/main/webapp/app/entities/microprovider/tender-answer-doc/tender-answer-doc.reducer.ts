import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { ITenderAnswerDoc, defaultValue } from 'app/shared/model/microprovider/tender-answer-doc.model';

export const ACTION_TYPES = {
  FETCH_TENDERANSWERDOC_LIST: 'tenderAnswerDoc/FETCH_TENDERANSWERDOC_LIST',
  FETCH_TENDERANSWERDOC: 'tenderAnswerDoc/FETCH_TENDERANSWERDOC',
  CREATE_TENDERANSWERDOC: 'tenderAnswerDoc/CREATE_TENDERANSWERDOC',
  UPDATE_TENDERANSWERDOC: 'tenderAnswerDoc/UPDATE_TENDERANSWERDOC',
  DELETE_TENDERANSWERDOC: 'tenderAnswerDoc/DELETE_TENDERANSWERDOC',
  RESET: 'tenderAnswerDoc/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<ITenderAnswerDoc>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export type TenderAnswerDocState = Readonly<typeof initialState>;

// Reducer

export default (state: TenderAnswerDocState = initialState, action): TenderAnswerDocState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_TENDERANSWERDOC_LIST):
    case REQUEST(ACTION_TYPES.FETCH_TENDERANSWERDOC):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_TENDERANSWERDOC):
    case REQUEST(ACTION_TYPES.UPDATE_TENDERANSWERDOC):
    case REQUEST(ACTION_TYPES.DELETE_TENDERANSWERDOC):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_TENDERANSWERDOC_LIST):
    case FAILURE(ACTION_TYPES.FETCH_TENDERANSWERDOC):
    case FAILURE(ACTION_TYPES.CREATE_TENDERANSWERDOC):
    case FAILURE(ACTION_TYPES.UPDATE_TENDERANSWERDOC):
    case FAILURE(ACTION_TYPES.DELETE_TENDERANSWERDOC):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_TENDERANSWERDOC_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    case SUCCESS(ACTION_TYPES.FETCH_TENDERANSWERDOC):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_TENDERANSWERDOC):
    case SUCCESS(ACTION_TYPES.UPDATE_TENDERANSWERDOC):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_TENDERANSWERDOC):
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

const apiUrl = 'services/microprovider/api/tender-answer-docs';

// Actions

export const getEntities: ICrudGetAllAction<ITenderAnswerDoc> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_TENDERANSWERDOC_LIST,
    payload: axios.get<ITenderAnswerDoc>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`),
  };
};

export const getEntity: ICrudGetAction<ITenderAnswerDoc> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_TENDERANSWERDOC,
    payload: axios.get<ITenderAnswerDoc>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<ITenderAnswerDoc> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_TENDERANSWERDOC,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<ITenderAnswerDoc> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_TENDERANSWERDOC,
    payload: axios.put(apiUrl, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<ITenderAnswerDoc> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_TENDERANSWERDOC,
    payload: axios.delete(requestUrl),
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
