import axios from 'axios';
import { ICrudGetAction, Storage } from 'react-jhipster';
import { FAILURE, REQUEST, SUCCESS } from './action-type.util';

export const MODULES_UP_SESSION_KEY = 'modules-up';

export const ACTION_TYPES = {
  CHANGE_TODO_USER_ID: 'appUtils/HANGE_TODO_USER_ID',
  FIND_MODULES_UP: 'appUtils/FIND_MODULES_UP',
  CLEAR_MODULES_UP: 'appUtils/CLEAR_MODULES_UP',
};

const initialState = {
  todoUserId: null,
  modules: [],
};

export type AppUtilsState = Readonly<typeof initialState>;

export default (state: AppUtilsState = initialState, action): AppUtilsState => {
  switch (action.type) {
    case ACTION_TYPES.CHANGE_TODO_USER_ID: {
      return {
        ...state,
        todoUserId: action.userId || null,
      };
    }
    case ACTION_TYPES.CLEAR_MODULES_UP: {
      return {
        ...state,
        modules: [],
      };
    }
    case REQUEST(ACTION_TYPES.FIND_MODULES_UP):
      return {
        ...state,
        modules: [],
      };
    case FAILURE(ACTION_TYPES.FIND_MODULES_UP):
      return {
        ...state,
      };
    case SUCCESS(ACTION_TYPES.FIND_MODULES_UP):
      return {
        ...state,
        modules: action.payload.data,
      };
    default:
      return state;
  }
};

export const changeTodoUserId = newUserId => ({
  type: ACTION_TYPES.CHANGE_TODO_USER_ID,
  userId: newUserId,
});

export const getUpModules: any = () => async dispatch => {
  await dispatch({
    type: ACTION_TYPES.FIND_MODULES_UP,
    payload: axios.get<string[]>(`/api/config/services`),
  });
  /* if(result && result.result.payload.data && result.payload.data){
    Storage.session.set(MODULES_UP_SESSION_KEY, result.payload.data.join(","));
    Storage.local.set(MODULES_UP_SESSION_KEY, result.payload.data);
  } */
};

export const clearConfigUpModules = () => dispatch => {
  /*  if (Storage.local.get(MODULES_UP_SESSION_KEY)) {
    Storage.local.remove(MODULES_UP_SESSION_KEY);
  }
  if (Storage.session.get(MODULES_UP_SESSION_KEY)) {
    Storage.session.remove(MODULES_UP_SESSION_KEY);
  } */
  dispatch({
    type: ACTION_TYPES.CLEAR_MODULES_UP,
  });
};
