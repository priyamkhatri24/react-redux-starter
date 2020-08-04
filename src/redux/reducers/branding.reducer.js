import { brandingConstants } from '../../constants/branding.constants';

const initialState = {
  pending: false,
  branding: {},
  error: null,
};

export function branding(state = initialState, action) {
  switch (action.type) {
    case brandingConstants.SUCCESS:
      return {
        ...state,
        branding: action.payload.result[0],
        pending: false,
      };
    case brandingConstants.ERROR:
      return {
        ...state,
        error: action.payload,
        pending: false,
      };
    case brandingConstants.CLEAR:
      return {
        ...state,
        pending: true,
      };
    default:
      return state;
  }
}

export const getCurrentBranding = (state) => state.branding;
export const getBrandingPending = (state) => state.pending;
export const getBrandingError = (state) => state.error;
