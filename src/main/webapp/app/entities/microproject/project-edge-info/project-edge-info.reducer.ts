import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { IProjectEdgeInfo, defaultValue } from 'app/shared/model/microproject/project-edge-info.model';

export const ACTION_TYPES = {
  FETCH_PROJECTEDGEINFO_LIST: 'projectEdgeInfo/FETCH_PROJECTEDGEINFO_LIST',
  FETCH_PROJECTEDGEINFO: 'projectEdgeInfo/FETCH_PROJECTEDGEINFO',
  CREATE_PROJECTEDGEINFO: 'projectEdgeInfo/CREATE_PROJECTEDGEINFO',
  UPDATE_PROJECTEDGEINFO: 'projectEdgeInfo/UPDATE_PROJECTEDGEINFO',
  DELETE_PROJECTEDGEINFO: 'projectEdgeInfo/DELETE_PROJECTEDGEINFO',
  RESET: 'projectEdgeInfo/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IProjectEdgeInfo>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export type ProjectEdgeInfoState = Readonly<typeof initialState>;

// Reducer

export default (state: ProjectEdgeInfoState = initialState, action): ProjectEdgeInfoState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_PROJECTEDGEINFO_LIST):
    case REQUEST(ACTION_TYPES.FETCH_PROJECTEDGEINFO):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_PROJECTEDGEINFO):
    case REQUEST(ACTION_TYPES.UPDATE_PROJECTEDGEINFO):
    case REQUEST(ACTION_TYPES.DELETE_PROJECTEDGEINFO):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_PROJECTEDGEINFO_LIST):
    case FAILURE(ACTION_TYPES.FETCH_PROJECTEDGEINFO):
    case FAILURE(ACTION_TYPES.CREATE_PROJECTEDGEINFO):
    case FAILURE(ACTION_TYPES.UPDATE_PROJECTEDGEINFO):
    case FAILURE(ACTION_TYPES.DELETE_PROJECTEDGEINFO):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_PROJECTEDGEINFO_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    case SUCCESS(ACTION_TYPES.FETCH_PROJECTEDGEINFO):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_PROJECTEDGEINFO):
    case SUCCESS(ACTION_TYPES.UPDATE_PROJECTEDGEINFO):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_PROJECTEDGEINFO):
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

const apiUrl = 'services/microproject/api/project-edge-infos';

// Actions

export const getEntities: ICrudGetAllAction<IProjectEdgeInfo> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_PROJECTEDGEINFO_LIST,
    payload: axios.get<IProjectEdgeInfo>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`),
  };
};

export const getEntity: ICrudGetAction<IProjectEdgeInfo> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_PROJECTEDGEINFO,
    payload: axios.get<IProjectEdgeInfo>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<IProjectEdgeInfo> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_PROJECTEDGEINFO,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IProjectEdgeInfo> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_PROJECTEDGEINFO,
    payload: axios.put(apiUrl, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IProjectEdgeInfo> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_PROJECTEDGEINFO,
    payload: axios.delete(requestUrl),
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
