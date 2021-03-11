import { loadingConstants } from '../../constants';

const initialState = {
  isLoading: false,
  isLoadingError: false,
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

    default:
      return state;
  }
}

export const getCurrentLoadingStatus = (state) => state.loading.isLoading;
export const getCurrentErrorStatus = (state) => state.loading.isLoadingError;
