import { dashboardConstants } from '../../constants';

const initialState = {
  dashboardData: {},
  locationData: {},
  redirectPath: null,
  scrolledHeight: 0,
  firebaseToken: '',
};

export function dashboard(state = initialState, action) {
  switch (action.type) {
    case dashboardConstants.DASHBOARDDATA:
      return {
        ...state,
        dashboardData: action.payload,
      };

    case dashboardConstants.LOCATIONDATA:
      return {
        ...state,
        locationData: action.payload,
      };

    case dashboardConstants.REDIRECTPATH:
      return {
        ...state,
        redirectPath: action.payload,
      };

    case dashboardConstants.SCROLLEDHEIGHT:
      return {
        ...state,
        scrolledHeight: action.payload,
      };

    case dashboardConstants.FIREBASETOKEN:
      return {
        ...state,
        firebaseToken: action.payload,
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
export const getCurrentLocationData = (state) => state.dashboard.locationData;
export const getCurrentRedirectPath = (state) => state.dashboard.redirectPath;
export const getCurrentSccrolledHeight = (state) => state.dashboard.scrolledHeight;
export const getFirebaseToken = (state) => state.dashboard.firebaseToken;
