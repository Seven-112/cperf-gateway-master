export const ACTION_TYPES = {
  TOGGLE_MAIN_SIDEBARE_OPEN: 'drawer/TOGGLE_MAIN_SIDEBARE_OPEN',
};

const initialState = {
  mainSidebarOpen: true,
};

export type DrawerState = Readonly<typeof initialState>;

export default (state: DrawerState = initialState, action): DrawerState => {
  switch (action.type) {
    case ACTION_TYPES.TOGGLE_MAIN_SIDEBARE_OPEN: {
      return {
        ...state,
        mainSidebarOpen: !state.mainSidebarOpen,
      };
    }
    default:
      return state;
  }
};

export const toggleSideBarOpen: () => void = () => dispatch => {
  dispatch({ type: ACTION_TYPES.TOGGLE_MAIN_SIDEBARE_OPEN });
};
