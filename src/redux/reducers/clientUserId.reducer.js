import { userConstants } from '../../constants';

const initialState = {
  userId: null,
  clientId: null,
  clientUserId: null,
  userUserID: null,
  roleArray: [],
};

export function clientUserIdUpdate(state = initialState, action) {
  switch (action.type) {
    case userConstants.USERID:
      return {
        ...state,
        userId: action.payload,
      };

    case userConstants.CLIENTID:
      return {
        ...state,
        clientId: action.payload,
      };
    case userConstants.CLIENTUSERID:
      return {
        ...state,
        clientUserId: action.payload,
      };
    case userConstants.USERUSERID:
      return {
        ...state,
        userUserID: action.payload,
      };

    case userConstants.ROLEARRAY:
      return {
        ...state,
        roleArray: action.payload,
      };
    default:
      return state;
  }
}

export const getUserId = (state) => state.clientUserIdUpdate.userId;
export const getClientUserId = (state) => state.clientUserIdUpdate.clientUserId;
export const getUserUserId = (state) => state.clientUserIdUpdate.userUserID;
export const getRoleArray = (state) => state.clientUserIdUpdate.roleArray;
export const getClientId = (state) => state.clientUserIdUpdate.clientId;
