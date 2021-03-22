import { conversationsConstants } from '../../constants';

function setSocket(payload) {
  return { type: conversationsConstants.CONNECTION, payload };
}

function setConversations(payload) {
  return { type: conversationsConstants.CONVERSATIONS, payload };
}

function setConversation(payload) {
  return { type: conversationsConstants.SET_CONVERSATION, payload };
}

function setMessages(payload) {
  return { type: conversationsConstants.SET_MESSAGES, payload };
}

export const conversationsActions = {
  setSocket,
  setConversations,
  setConversation,
  setMessages,
  //   setUserIdToStore,
  //   setCLientUserIdToStore,
  //   setUserUserIdToStore,
  //   setRoleArrayToStore,
  //   setClientIdToStore,
  //   clearClientIdDetails,
};
