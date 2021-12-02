import { brandingConstants } from '../../constants';

function success(payload) {
  return { type: brandingConstants.SUCCESS, payload };
}

function error(payload) {
  return { type: brandingConstants.ERROR, payload };
}

function clear() {
  return { type: brandingConstants.CLEAR };
}

function setCurrentComponentToStore(payload) {
  return { type: brandingConstants.CURRENTCOMPONENT, payload };
}

export const brandingActions = {
  success,
  error,
  clear,
  setCurrentComponentToStore,
};
