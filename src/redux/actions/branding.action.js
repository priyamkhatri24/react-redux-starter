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

export const brandingActions = {
  success,
  error,
  clear,
};
