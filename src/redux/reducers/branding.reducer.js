import { brandingConstants } from '../../constants';

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
        branding: action.payload,
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
        branding: {},
        pending: true,
      };
    default:
      return state;
  }
}

export const getCurrentBranding = (state) => state.branding;
export const getBrandingPending = (state) => state.pending;
export const getBrandingError = (state) => state.error;
