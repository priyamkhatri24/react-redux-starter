import { firstTimeLoginConstants } from '../../constants';

const initialState = {
  firstTimeLogin: false,
};

export function firstTimeLogin(state = initialState, action) {
  switch (action.type) {
    case firstTimeLoginConstants.FIRSTTIMELOGIN:
      return {
        ...state,
        firstTimeLogin: action.payload,
      };

    default:
      return state;
  }
}

export const getFirstTimeLoginState = (state) => state.firstTimeLogin.firstTimeLogin;
