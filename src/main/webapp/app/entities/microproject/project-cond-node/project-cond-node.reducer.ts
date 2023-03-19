import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { IProjectCondNode, defaultValue } from 'app/shared/model/microproject/project-cond-node.model';

export const ACTION_TYPES = {
  FETCH_PROJECTCONDNODE_LIST: 'projectCondNode/FETCH_PROJECTCONDNODE_LIST',
  FETCH_PROJECTCONDNODE: 'projectCondNode/FETCH_PROJECTCONDNODE',
  CREATE_PROJECTCONDNODE: 'projectCondNode/CREATE_PROJECTCONDNODE',
  UPDATE_PROJECTCONDNODE: 'projectCondNode/UPDATE_PROJECTCONDNODE',
  DELETE_PROJECTCONDNODE: 'projectCondNode/DELETE_PROJECTCONDNODE',
  RESET: 'projectCondNode/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IProjectCondNode>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export type ProjectCondNodeState = Readonly<typeof initialState>;

// Reducer

export default (state: ProjectCondNodeState = initialState, action): ProjectCondNodeState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_PROJECTCONDNODE_LIST):
    case REQUEST(ACTION_TYPES.FETCH_PROJECTCONDNODE):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_PROJECTCONDNODE):
    case REQUEST(ACTION_TYPES.UPDATE_PROJECTCONDNODE):
    case REQUEST(ACTION_TYPES.DELETE_PROJECTCONDNODE):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_PROJECTCONDNODE_LIST):
    case FAILURE(ACTION_TYPES.FETCH_PROJECTCONDNODE):
    case FAILURE(ACTION_TYPES.CREATE_PROJECTCONDNODE):
    case FAILURE(ACTION_TYPES.UPDATE_PROJECTCONDNODE):
    case FAILURE(ACTION_TYPES.DELETE_PROJECTCONDNODE):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_PROJECTCONDNODE_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    case SUCCESS(ACTION_TYPES.FETCH_PROJECTCONDNODE):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_PROJECTCONDNODE):
    case SUCCESS(ACTION_TYPES.UPDATE_PROJECTCONDNODE):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_PROJECTCONDNODE):
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

const apiUrl = 'services/microproject/api/project-cond-nodes';

// Actions

export const getEntities: ICrudGetAllAction<IProjectCondNode> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_PROJECTCONDNODE_LIST,
    payload: axios.get<IProjectCondNode>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`),
  };
};

export const getEntity: ICrudGetAction<IProjectCondNode> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_PROJECTCONDNODE,
    payload: axios.get<IProjectCondNode>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<IProjectCondNode> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_PROJECTCONDNODE,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IProjectCondNode> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_PROJECTCONDNODE,
    payload: axios.put(apiUrl, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IProjectCondNode> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_PROJECTCONDNODE,
    payload: axios.delete(requestUrl),
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
