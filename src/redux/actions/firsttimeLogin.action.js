import { firstTimeLoginConstants } from '../../constants';

function setFirstTimeLoginToStore(payload) {
  return { type: firstTimeLoginConstants.FIRSTTIMELOGIN, payload };
}

export const firstTimeLoginActions = {
  setFirstTimeLoginToStore,
};
