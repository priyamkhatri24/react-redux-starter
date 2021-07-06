import { dashboardConstants } from '../../constants';

const initialState = {
  dashboardData: {},
  redirectPath: null,
};

export function dashboard(state = initialState, action) {
  switch (action.type) {
    case dashboardConstants.DASHBOARDDATA:
      return {
        ...state,
        dashboardData: action.payload,
      };

    case dashboardConstants.REDIRECTPATH:
      return {
        ...state,
        redirectPath: action.payload,
      };

    case dashboardConstants.CLEARDASHBOARDDATA:
      return {
        ...state,
        dashboardData: {},
      };
    default:
      return state;
  }
}

export const getCurrentDashboardData = (state) => state.dashboard.dashboardData;
export const getCurrentRedirectPath = (state) => state.dashboard.redirectPath;
