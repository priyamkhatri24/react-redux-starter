import { dashboardConstants } from '../../constants/index';

function setDashboardDataToStore(payload) {
  return { type: dashboardConstants.DASHBOARDDATA, payload };
}

function setLocationDataToStore(payload) {
  return { type: dashboardConstants.LOCATIONDATA, payload };
}

function setRedirectPathToStore(payload) {
  return { type: dashboardConstants.REDIRECTPATH, payload };
}

function setScrolledHeightOfDocumentToStore(payload) {
  return { type: dashboardConstants.SCROLLEDHEIGHT, payload };
}

function setTokenToStore(payload) {
  console.log('firebase token getting saved');
  return { type: dashboardConstants.FIREBASETOKEN, payload };
}

function clearDashboardDataFromStore() {
  return { type: dashboardConstants.CLEARDASHBOARDDATA };
}

export const dashboardActions = {
  setDashboardDataToStore,
  setLocationDataToStore,
  clearDashboardDataFromStore,
  setRedirectPathToStore,
  setTokenToStore,
  setScrolledHeightOfDocumentToStore,
};
