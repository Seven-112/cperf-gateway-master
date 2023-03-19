import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IProcedure, defaultValue } from 'app/shared/model/microprocess/procedure.model';

export const ACTION_TYPES = {
  FETCH_PROCEDURE_LIST: 'procedure/FETCH_PROCEDURE_LIST',
  FETCH_PROCEDURE: 'procedure/FETCH_PROCEDURE',
  CREATE_PROCEDURE: 'procedure/CREATE_PROCEDURE',
  UPDATE_PROCEDURE: 'procedure/UPDATE_PROCEDURE',
  DELETE_PROCEDURE: 'procedure/DELETE_PROCEDURE',
  RESET: 'procedure/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IProcedure>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export type ProcedureState = Readonly<typeof initialState>;

// Reducer

export default (state: ProcedureState = initialState, action): ProcedureState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_PROCEDURE_LIST):
    case REQUEST(ACTION_TYPES.FETCH_PROCEDURE):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_PROCEDURE):
    case REQUEST(ACTION_TYPES.UPDATE_PROCEDURE):
    case REQUEST(ACTION_TYPES.DELETE_PROCEDURE):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_PROCEDURE_LIST):
    case FAILURE(ACTION_TYPES.FETCH_PROCEDURE):
    case FAILURE(ACTION_TYPES.CREATE_PROCEDURE):
    case FAILURE(ACTION_TYPES.UPDATE_PROCEDURE):
    case FAILURE(ACTION_TYPES.DELETE_PROCEDURE):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_PROCEDURE_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    case SUCCESS(ACTION_TYPES.FETCH_PROCEDURE):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_PROCEDURE):
    case SUCCESS(ACTION_TYPES.UPDATE_PROCEDURE):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_PROCEDURE):
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

const apiUrl = 'services/microprocess/api/procedures';

// Actions

export const getEntities: ICrudGetAllAction<IProcedure> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_PROCEDURE_LIST,
    payload: axios.get<IProcedure>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`),
  };
};

export const getEntity: ICrudGetAction<IProcedure> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_PROCEDURE,
    payload: axios.get<IProcedure>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<IProcedure> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_PROCEDURE,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IProcedure> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_PROCEDURE,
    payload: axios.put(apiUrl, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IProcedure> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_PROCEDURE,
    payload: axios.delete(requestUrl),
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
