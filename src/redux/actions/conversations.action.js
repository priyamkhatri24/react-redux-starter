import { conversationsConstants } from '../../constants';

function setSocket(payload) {
  return { type: conversationsConstants.SET_SOCKET, payload };
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

function setPost(payload) {
  return { type: conversationsConstants.SET_POST, payload };
}

function setPosts(payload) {
  return { type: conversationsConstants.SET_POSTS, payload };
}

function setReplies(payload) {
  return { type: conversationsConstants.SET_REPLIES, payload };
}

export const conversationsActions = {
  setSocket,
  setConversations,
  setConversation,
  setMessages,
  setPost,
  setPosts,
  setReplies,
  //   setUserIdToStore,
  //   setCLientUserIdToStore,
  //   setUserUserIdToStore,
  //   setRoleArrayToStore,
  //   setClientIdToStore,
  //   clearClientIdDetails,
};
