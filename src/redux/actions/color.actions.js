import { colorConstants } from '../../constants';

function success(payload) {
  return { type: colorConstants.SUCCESS, payload };
}

function clear() {
  return { type: colorConstants.CLEAR };
}

export const colorActions = {
  success,
  clear,
};
