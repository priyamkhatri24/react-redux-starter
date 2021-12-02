import { userProfileConstants } from '../../constants';

const initialState = {
  firstName: '',
  lastName: '',
  contact: '',
  profileImage: '',
  userName: null,
  token: null,
  email: '',
  countryCode: '',
  address: '',
  birthday: '',
  gender: '',
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

    case userProfileConstants.EMAIL:
      return {
        ...state,
        email: action.payload,
      };

    case userProfileConstants.BIRTHDAY:
      return {
        ...state,
        birthday: action.payload,
      };
    case userProfileConstants.ADDRESS:
      return {
        ...state,
        address: action.payload,
      };
    case userProfileConstants.GENDER:
      return {
        ...state,
        gender: action.payload,
      };

    case userProfileConstants.COUNTRYCODE:
      return {
        ...state,
        countryCode: action.payload,
      };

    case userProfileConstants.USERNAME:
      return {
        ...state,
        userName: action.payload,
      };

    case userProfileConstants.TOKEN:
      return {
        ...state,
        token: action.payload,
      };

    case userProfileConstants.LOGOUT:
      return {
        ...state,
        firstName: '',
        lastName: '',
        contact: '',
        profileImage: '',
        userName: null,
        token: null,
        email: '',
        countryCode: '',
        birthday: '',
        address: '',
        gender: '',
      };

    default:
      return state;
  }
}

export const getUserProfile = (state) => state.userProfile;
export const getToken = (state) => state.userProfile.token;
