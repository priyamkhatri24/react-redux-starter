import { userConstants } from '../../constants';

function setUserIdToStore(payload) {
  return { type: userConstants.USERID, payload };
}

function setClientIdToStore(payload) {
  return { type: userConstants.CLIENTID, payload };
}

function setCLientUserIdToStore(payload) {
  return { type: userConstants.CLIENTUSERID, payload };
}

function setUserUserIdToStore(payload) {
  return { type: userConstants.USERUSERID, payload };
}

function setRoleArrayToStore(payload) {
  return { type: userConstants.ROLEARRAY, payload };
}

export const clientUserIdActions = {
  setUserIdToStore,
  setCLientUserIdToStore,
  setUserUserIdToStore,
  setRoleArrayToStore,
  setClientIdToStore,
};
