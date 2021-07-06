import { feeConstants } from '../../constants';

function setFeePlanTypeToStore(payload) {
  return { type: feeConstants.FEEPLANTYPE, payload };
}

function setFeeMonthlyPlanArrayToStore(payload) {
  return { type: feeConstants.FEEMONTHLYPLANARRAY, payload };
}

function setFeeCustomPlanArrayToStore(payload) {
  return { type: feeConstants.FEECUSTOMPLANARRAY, payload };
}

function setFeeOneTimePlanArrayToStore(payload) {
  return { type: feeConstants.FEEONETIMEPLANARRAY, payload };
}

function setFeeStudentClientUserIdToStore(payload) {
  return { type: feeConstants.FEESTUDENTCLIENTUSERID, payload };
}

export const feeActions = {
  setFeePlanTypeToStore,
  setFeeOneTimePlanArrayToStore,
  setFeeMonthlyPlanArrayToStore,
  setFeeCustomPlanArrayToStore,
  setFeeStudentClientUserIdToStore,
};
