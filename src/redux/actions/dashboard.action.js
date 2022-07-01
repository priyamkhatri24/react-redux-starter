import { dashboardConstants } from '../../constants';

function setDashboardDataToStore(payload) {
  return { type: dashboardConstants.DASHBOARDDATA, payload };
}

function setLocationDataToStore(payload) {
  return { type: dashboardConstants.LOCATIONDATA, payload };
}

function setRedirectPathToStore(payload) {
  return { type: dashboardConstants.REDIRECTPATH, payload };
}

function clearDashboardDataFromStore() {
  return { type: dashboardConstants.CLEARDASHBOARDDATA };
}

export const dashboardActions = {
  setDashboardDataToStore,
  setLocationDataToStore,
  clearDashboardDataFromStore,
  setRedirectPathToStore,
};
