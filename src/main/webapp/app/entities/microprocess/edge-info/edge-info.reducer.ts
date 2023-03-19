import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { IEdgeInfo, defaultValue } from 'app/shared/model/microprocess/edge-info.model';

export const ACTION_TYPES = {
  FETCH_EDGEINFO_LIST: 'edgeInfo/FETCH_EDGEINFO_LIST',
  FETCH_EDGEINFO: 'edgeInfo/FETCH_EDGEINFO',
  CREATE_EDGEINFO: 'edgeInfo/CREATE_EDGEINFO',
  UPDATE_EDGEINFO: 'edgeInfo/UPDATE_EDGEINFO',
  DELETE_EDGEINFO: 'edgeInfo/DELETE_EDGEINFO',
  RESET: 'edgeInfo/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IEdgeInfo>,
  entity: defaultValue,
  updating: false,
  updateSuccess: false,
};

export type EdgeInfoState = Readonly<typeof initialState>;

// Reducer

export default (state: EdgeInfoState = initialState, action): EdgeInfoState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_EDGEINFO_LIST):
    case REQUEST(ACTION_TYPES.FETCH_EDGEINFO):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_EDGEINFO):
    case REQUEST(ACTION_TYPES.UPDATE_EDGEINFO):
    case REQUEST(ACTION_TYPES.DELETE_EDGEINFO):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_EDGEINFO_LIST):
    case FAILURE(ACTION_TYPES.FETCH_EDGEINFO):
    case FAILURE(ACTION_TYPES.CREATE_EDGEINFO):
    case FAILURE(ACTION_TYPES.UPDATE_EDGEINFO):
    case FAILURE(ACTION_TYPES.DELETE_EDGEINFO):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_EDGEINFO_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.FETCH_EDGEINFO):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_EDGEINFO):
    case SUCCESS(ACTION_TYPES.UPDATE_EDGEINFO):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_EDGEINFO):
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

const apiUrl = 'services/microprocess/api/edge-infos';

// Actions

export const getEntities: ICrudGetAllAction<IEdgeInfo> = (page, size, sort) => ({
  type: ACTION_TYPES.FETCH_EDGEINFO_LIST,
  payload: axios.get<IEdgeInfo>(`${apiUrl}?cacheBuster=${new Date().getTime()}`),
});

export const getEntity: ICrudGetAction<IEdgeInfo> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_EDGEINFO,
    payload: axios.get<IEdgeInfo>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<IEdgeInfo> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_EDGEINFO,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IEdgeInfo> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_EDGEINFO,
    payload: axios.put(apiUrl, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IEdgeInfo> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_EDGEINFO,
    payload: axios.delete(requestUrl),
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
