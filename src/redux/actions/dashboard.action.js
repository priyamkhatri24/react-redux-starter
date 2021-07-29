import { dashboardConstants } from '../../constants';

function setDashboardDataToStore(payload) {
  return { type: dashboardConstants.DASHBOARDDATA, payload };
}

function setRedirectPathToStore(payload) {
  return { type: dashboardConstants.REDIRECTPATH, payload };
}

function clearDashboardDataFromStore() {
  return { type: dashboardConstants.CLEARDASHBOARDDATA };
}

export const dashboardActions = {
  setDashboardDataToStore,
  clearDashboardDataFromStore,
  setRedirectPathToStore,
};
