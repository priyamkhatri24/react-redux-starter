import { colorConstants } from '../../constants';

const initialState = {
  color: {},
};

export function color(state = initialState, action) {
  switch (action.type) {
    case colorConstants.SUCCESS:
      return {
        ...state,
        color: action.payload,
      };

    case colorConstants.CLEAR:
      return {
        ...state,
        color: {},
      };
    default:
      return state;
  }
}

export const getCurrentcolor = (state) => state.color;
