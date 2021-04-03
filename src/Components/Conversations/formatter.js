export const formatMessageContent = (message) => {
  if (message.type === 'post') {
    console.log(message);

    return {
      type: 'post',
      content: {
        title: message.title,
        desc: message.text,
        cover: message.attachments_array.length === 0 ? '' : message.attachments_array[0].file_url,
      },
    };
  }

  if (message.attachments_array.length > 0) {
    return {
      type: message.attachments_array[0].file_type,
      name: message.attachments_array[0].file_name,
      content: message.attachments_array[0].file_url,
    };
  }

  return {
    type: 'text',
    content: message.text,
  };
};

export const formatMessages = (list, clientUserId) =>
  list.map((data) => ({
    id: data.chat_id,
    message: formatMessageContent(data),
    thumbnail: data.sent_by.display_picture || 'https://i.pravatar.cc/40',
    userIsAuthor: data.sent_by.client_user_id === clientUserId,
    timestamp: data.sent_time,
    username: `${data.sent_by.first_name} ${data.sent_by.last_name}`,
    reactions: data.reactions.map((r) => ({
      count: r.no_of_reactions,
      id: r.reaction_id,
      name: r.reaction_name,
      url: r.reaction_url,
    })),
    userHasReacted: data.hasUserReacted,
  }));

export const formatMessage = (data, userIsAuthor) => ({
  id: data.chat_id,
  message: formatMessageContent(data),
  thumbnail: data.sent_by.display_picture || 'https://i.pravatar.cc/40',
  userIsAuthor,
  timestamp: data.sent_time,
  username: `${data.sent_by.first_name} ${data.sent_by.last_name}`,
  reactions: data.reactions.map((r) => ({
    count: r.no_of_reactions,
    id: r.reaction_id,
    name: r.reaction_name,
    url: r.reaction_url,
  })),
  userHasReacted: data.hasUserReacted,
});

export const formatConversation = (responseFromServer) => {};

export const formatConversations = (list) =>
  list.map((conversation) => ({
    id: conversation.conversation_id,
    name: conversation.name,
    thumbnail: conversation.display_picture || 'https://i.pravatar.cc/40',
    subTitle: conversation.last_message || '',
    unreadCount: conversation.unread_message_count || 0,
    messages: [],
    page: 1,
  }));
