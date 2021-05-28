import { displayConstants } from '../../constants';

const initialState = {
  displayData: [],
};

export function displayPage(state = initialState, action) {
  switch (action.type) {
    case displayConstants.DISPLAYDATA:
      return {
        ...state,
        displayData: action.payload,
      };
    default:
      return state;
  }
}

export const getCurrentDisplayData = (state) => state.displayPage.displayData;
