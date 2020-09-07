import { brandingConstants } from '../../constants/branding.constants';

export const clientUserIdActions = {
  setUserIdToStore,
  setCLientUserIdToStore,
};

function setUserIdToStore(payload) {
  return { type: brandingConstants.USERID, payload };
}

function setCLientUserIdToStore(payload) {
  return { type: brandingConstants.CLIENTUSERID, payload };
}
