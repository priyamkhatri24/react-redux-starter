import { dashboardConstants } from '../../constants';

const initialState = {
  dashboardData: {},
};

export function dashboard(state = initialState, action) {
  switch (action.type) {
    case dashboardConstants.DASHBOARDDATA:
      return {
        ...state,
        dashboardData: action.payload,
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
