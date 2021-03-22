import { feeConstants } from '../../constants';

const initialState = {
  feePlanType: '',
};

export function fees(state = initialState, action) {
  switch (action.type) {
    case feeConstants.FEEPLANTYPE:
      return {
        ...state,
        feePlanType: action.payload,
      };
    default:
      return state;
  }
}

export const getfeePlanType = (state) => state.fees.feePlanType;
