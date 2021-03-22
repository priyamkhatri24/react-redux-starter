import { conversationsConstants } from '../../constants';

const initialState = {
  socket: null,
  conversations: [],
  conversation: null,
};

export function conversations(state = initialState, action) {
  switch (action.type) {
    case conversationsConstants.CONNECTION:
      return {
        ...state,
        socket: action.payload,
      };

    case conversationsConstants.CONVERSATIONS:
      return {
        ...state,
        conversations: action.payload,
      };

    case conversationsConstants.SET_CONVERSATION:
      return {
        ...state,
        conversation: action.payload,
      };
    // case userConstants.USERID:
    //   return {
    //     ...state,
    //     userId: action.payload,
    //   };

    // case userConstants.CLIENTID:
    //   return {
    //     ...state,
    //     clientId: action.payload,
    //   };
    // case userConstants.CLIENTUSERID:
    //   return {
    //     ...state,
    //     clientUserId: action.payload,
    //   };
    // case userConstants.USERUSERID:
    //   return {
    //     ...state,
    //     userUserID: action.payload,
    //   };

    // case userConstants.ROLEARRAY:
    //   return {
    //     ...state,
    //     roleArray: action.payload,
    //   };
    case conversationsConstants.CLEAR:
      return {
        socket: null,
        conversations: [],
      };
    default:
      return state;
  }
}

export const getSocket = (state) => state.conversations.socket;

export const getConversations = (state) => state.conversations.conversations;

export const getConversation = (state) => state.conversations.conversation;

// export const getUserId = (state) => state.clientUserIdUpdate.userId;
// export const getClientUserId = (state) => state.clientUserIdUpdate.clientUserId;
// export const getUserUserId = (state) => state.clientUserIdUpdate.userUserID;
// export const getRoleArray = (state) => state.clientUserIdUpdate.roleArray;
// export const getClientId = (state) => state.clientUserIdUpdate.clientId;
