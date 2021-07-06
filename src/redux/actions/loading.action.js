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

function setAmountLoadedToStore(payload) {
  return { type: loadingConstants.AMOUNTLOADED, payload };
}

function setTotalLoadedToStore(payload) {
  return { type: loadingConstants.TOTALLOADED, payload };
}

function spinner(payload) {
  return { type: loadingConstants.ISSPINNER, payload };
}

export const loadingActions = {
  success,
  error,
  pending,
  setAmountLoadedToStore,
  setTotalLoadedToStore,
  spinner,
};
