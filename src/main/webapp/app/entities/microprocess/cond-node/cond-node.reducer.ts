import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { ICondNode, defaultValue } from 'app/shared/model/microprocess/cond-node.model';

export const ACTION_TYPES = {
  FETCH_CONDNODE_LIST: 'condNode/FETCH_CONDNODE_LIST',
  FETCH_CONDNODE: 'condNode/FETCH_CONDNODE',
  CREATE_CONDNODE: 'condNode/CREATE_CONDNODE',
  UPDATE_CONDNODE: 'condNode/UPDATE_CONDNODE',
  DELETE_CONDNODE: 'condNode/DELETE_CONDNODE',
  RESET: 'condNode/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<ICondNode>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export type CondNodeState = Readonly<typeof initialState>;

// Reducer

export default (state: CondNodeState = initialState, action): CondNodeState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_CONDNODE_LIST):
    case REQUEST(ACTION_TYPES.FETCH_CONDNODE):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_CONDNODE):
    case REQUEST(ACTION_TYPES.UPDATE_CONDNODE):
    case REQUEST(ACTION_TYPES.DELETE_CONDNODE):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_CONDNODE_LIST):
    case FAILURE(ACTION_TYPES.FETCH_CONDNODE):
    case FAILURE(ACTION_TYPES.CREATE_CONDNODE):
    case FAILURE(ACTION_TYPES.UPDATE_CONDNODE):
    case FAILURE(ACTION_TYPES.DELETE_CONDNODE):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_CONDNODE_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    case SUCCESS(ACTION_TYPES.FETCH_CONDNODE):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_CONDNODE):
    case SUCCESS(ACTION_TYPES.UPDATE_CONDNODE):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_CONDNODE):
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

const apiUrl = 'services/microprocess/api/cond-nodes';

// Actions

export const getEntities: ICrudGetAllAction<ICondNode> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_CONDNODE_LIST,
    payload: axios.get<ICondNode>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`),
  };
};

export const getEntity: ICrudGetAction<ICondNode> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_CONDNODE,
    payload: axios.get<ICondNode>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<ICondNode> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_CONDNODE,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<ICondNode> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_CONDNODE,
    payload: axios.put(apiUrl, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<ICondNode> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_CONDNODE,
    payload: axios.delete(requestUrl),
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
