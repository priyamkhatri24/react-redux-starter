import { firstTimeLoginConstants } from '../../constants';

function setFirstTimeLoginToStore(payload) {
  return { type: firstTimeLoginConstants.FIRSTTIMELOGIN, payload };
}

function setComeBackFromTestsToStore(payload) {
  return { type: firstTimeLoginConstants.COMEBACKFROMTESTS, payload };
}

export const firstTimeLoginActions = {
  setFirstTimeLoginToStore,
  setComeBackFromTestsToStore,
};
