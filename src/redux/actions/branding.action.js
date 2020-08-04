import { brandingConstants } from '../../constants/branding.constants';

export const brandingActions = {
  success,
  error,
  clear,
};

function success(payload) {
  return { type: brandingConstants.SUCCESS, payload };
}

function error(payload) {
  return { type: brandingConstants.ERROR, payload };
}

function clear() {
  return { type: brandingConstants.CLEAR };
}
