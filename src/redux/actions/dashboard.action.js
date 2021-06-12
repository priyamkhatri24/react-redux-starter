import { dashboardConstants } from '../../constants';

function setDashboardDataToStore(payload) {
  return { type: dashboardConstants.DASHBOARDDATA, payload };
}

function clearDashboardDataFromStore() {
  return { type: dashboardConstants.CLEARDASHBOARDDATA };
}

export const dashboardActions = {
  setDashboardDataToStore,
  clearDashboardDataFromStore,
};
