import { loadingConstants } from '../../constants';

const initialState = {
  isLoading: false,
  isLoadingError: false,
  totalLoaded: 100,
  amountLoaded: 0,
  isSpinner: false,
};

export function loading(state = initialState, action) {
  switch (action.type) {
    case loadingConstants.SUCCESS:
      return {
        ...state,
        isLoading: false,
      };

    case loadingConstants.PENDING:
      return {
        ...state,
        isLoading: true,
      };

    case loadingConstants.ERROR:
      return {
        ...state,
        isLoading: false,
        isLoadingError: true,
      };

    case loadingConstants.AMOUNTLOADED:
      return {
        ...state,
        amountLoaded: action.payload,
      };

    case loadingConstants.TOTALLOADED:
      return {
        ...state,
        totalLoaded: action.payload,
      };

    case loadingConstants.ISSPINNER:
      return {
        ...state,
        isSpinner: action.payload,
      };

    default:
      return state;
  }
}

export const getCurrentLoadingStatus = (state) => state.loading.isLoading;
export const getCurrentErrorStatus = (state) => state.loading.isLoadingError;
export const getAmountLoaded = (state) => state.loading.amountLoaded;
export const getTotalLoaded = (state) => state.loading.totalLoaded;
export const getStatusOfSpinner = (state) => state.loading.isSpinner;
