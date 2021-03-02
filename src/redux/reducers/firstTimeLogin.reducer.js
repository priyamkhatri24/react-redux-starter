import { firstTimeLoginConstants } from '../../constants';

const initialState = {
  firstTimeLogin: false,
  comeBackFromTests: false,
};

export function firstTimeLogin(state = initialState, action) {
  switch (action.type) {
    case firstTimeLoginConstants.FIRSTTIMELOGIN:
      return {
        ...state,
        firstTimeLogin: action.payload,
      };
    case firstTimeLoginConstants.COMEBACKFROMTESTS:
      return {
        ...state,
        comeBackFromTests: action.payload,
      };

    default:
      return state;
  }
}

export const getFirstTimeLoginState = (state) => state.firstTimeLogin.firstTimeLogin;
export const getComeBackFromTests = (state) => state.firstTimeLogin.comeBackFromTests;
