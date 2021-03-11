import { loadingConstants } from '../../constants';

function success(payload) {
  return { type: loadingConstants.SUCCESS, payload };
}

function pending() {
  return { type: loadingConstants.PENDING };
}

function error() {
  return { type: loadingConstants.ERROR };
}

export const loadingActions = {
  success,
  error,
  pending,
};
