// we create a separate action since it is possible that clientUserId / UserId
// be present during other parts of the login flow.
// However, userProfile Shall be created only at login.

import { userProfileConstants } from '../../constants';

function setFirstNameToStore(payload) {
  return { type: userProfileConstants.FIRSTNAME, payload };
}

function setLastNameToStore(payload) {
  return { type: userProfileConstants.LASTNAME, payload };
}

function setContactToStore(payload) {
  return { type: userProfileConstants.CONTACT, payload };
}

function setProfileImageToStore(payload) {
  return { type: userProfileConstants.PROFILEIMAGE, payload };
}

function setTokenToStore(payload) {
  return { type: userProfileConstants.TOKEN, payload };
}
// action to logout user by making userProfile as null

function clearUserProfile() {
  return { type: userProfileConstants.LOGOUT };
}

export const userProfileActions = {
  setFirstNameToStore,
  setLastNameToStore,
  setProfileImageToStore,
  setContactToStore,
  setTokenToStore,
  clearUserProfile,
};
