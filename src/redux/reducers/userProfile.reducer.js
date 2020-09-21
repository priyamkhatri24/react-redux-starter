import { userProfileConstants } from '../../constants';

const initialState = {
  firstName: null,
  lastName: null,
  contact: null,
  profileImage: null,
  token: null,
};

export function userProfile(state = initialState, action) {
  switch (action.type) {
    case userProfileConstants.FIRSTNAME:
      return {
        ...state,
        firstName: action.payload,
      };
    case userProfileConstants.LASTNAME:
      return {
        ...state,
        lastName: action.payload,
      };
    case userProfileConstants.CONTACT:
      return {
        ...state,
        contact: action.payload,
      };

    case userProfileConstants.PROFILEIMAGE:
      return {
        ...state,
        profileImage: action.payload,
      };

    case userProfileConstants.TOKEN:
      return {
        ...state,
        token: action.payload,
      };

    case userProfileConstants.LOGOUT:
      return {
        ...state,
        firstName: null,
        lastName: null,
        contact: null,
        profileImage: null,
        token: null,
      };

    default:
      return state;
  }
}

export const getUserProfile = (state) => state.userProfile;
export const getToken = (state) => state.userProfile.token;
