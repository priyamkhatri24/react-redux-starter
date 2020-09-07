import { brandingConstants } from '../../constants/branding.constants';

const initialState = {
  userId: null,
  clientUserId: null,
};

export function clientUserIdUpdate(state = initialState, action) {
  switch (action.type) {
    case brandingConstants.USERID:
      return {
        ...state,
        userId: action.payload,
      };
    case brandingConstants.CLIENTUSERID:
      return {
        ...state,
        clientUserId: action.payload,
      };
    default:
      return state;
  }
}

export const getUserId = (state) => state.clientUserIdUpdate.userId;
export const getClientUserId = (state) => state.clientUserIdUpdate.clientUserId;
