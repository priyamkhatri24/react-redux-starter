import { feeConstants } from '../../constants';

function setFeePlanTypeToStore(payload) {
  return { type: feeConstants.FEEPLANTYPE, payload };
}

export const feeActions = {
  setFeePlanTypeToStore,
};
