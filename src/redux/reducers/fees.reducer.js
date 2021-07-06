import { feeConstants } from '../../constants';

const initialState = {
  feePlanType: '',
  feeMonthlyPlanArray: [],
  feeCustomPlanArray: [],
  feeOneTimePlanArray: [],
  feeStudentClientUserId: '',
};

export function fees(state = initialState, action) {
  switch (action.type) {
    case feeConstants.FEEPLANTYPE:
      return {
        ...state,
        feePlanType: action.payload,
      };
    case feeConstants.FEEMONTHLYPLANARRAY:
      return {
        ...state,
        feeMonthlyPlanArray: action.payload,
      };
    case feeConstants.FEECUSTOMPLANARRAY:
      return {
        ...state,
        feeCustomPlanArray: action.payload,
      };

    case feeConstants.FEEONETIMEPLANARRAY:
      return {
        ...state,
        feeOneTimePlanArray: action.payload,
      };

    case feeConstants.FEESTUDENTCLIENTUSERID:
      return {
        ...state,
        feeStudentClientUserId: action.payload,
      };

    default:
      return state;
  }
}

export const getfeePlanType = (state) => state.fees.feePlanType;
export const getfeeMonthlyPlanArray = (state) => state.fees.feeMonthlyPlanArray;
export const getfeeCustomPlanArray = (state) => state.fees.feeCustomPlanArray;
export const getfeeOneTimePlanArray = (state) => state.fees.feeOneTimePlanArray;
export const getFeeClientUserId = (state) => state.fees.feeStudentClientUserId;
