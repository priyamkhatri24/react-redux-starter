import { brandingConstants } from '../../constants';

const initialState = {
  pending: false,
  branding: {},
  error: null,
  currentComponent: 'Welcome',
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
    case brandingConstants.CURRENTCOMPONENT:
      return {
        ...state,
        currentComponent: action.payload,
      };
    default:
      return state;
  }
}

export const getCurrentBranding = (state) => state.branding;
export const getBrandingPending = (state) => state.pending;
export const getBrandingError = (state) => state.error;
export const getCurrentComponent = (state) => state.branding.currentComponent;
