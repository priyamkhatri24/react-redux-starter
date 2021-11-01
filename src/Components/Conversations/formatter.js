export const formatMessageContent = (message) => {
  if (message.type === 'post') {
    console.log(message);

    return {
      type: 'post',
      commentsEnabled: message.comments_enabled,
      reactionsEnabled: message.reactions_enabled,
      content: {
        title: message.title,
        desc: message.text,
        cover:
          message.attachments_array && message.attachments_array.length > 0
            ? message.attachments_array[0].file_url || message.attachments_array[0].url
            : '',
      },
    };
  }

  if (message.attachments_array && message.attachments_array.length > 0) {
    if (message.message_status === 'deleted') {
      return {
        type: 'text',
        content: 'This message was deleted',
      };
    }
    return {
      type: message.attachments_array[0].type || message.attachments_array[0].file_type,
      name: message.attachments_array[0].name || message.attachments_array[0].file_name,
      content: message.attachments_array[0].url || message.attachments_array[0].file_url,
    };
  }

  return {
    type: 'text',
    content: message.message_status === 'deleted' ? 'This message was deleted' : message.text,
  };
};

export const formatMessages = (list, clientUserId) =>
  list.map((data) => ({
    id: data.chat_id,
    message: formatMessageContent(data),
    thumbnail:
      data.sent_by.display_picture ||
      'https://s3.ap-south-1.amazonaws.com/ingenium-question-images/1631183013255.png',
    userIsAuthor: data.sent_by.client_user_id === clientUserId,
    timestamp: data.sent_time,
    username: `${data.sent_by.first_name} ${data.sent_by.last_name}`,
    reactions: data.reactions.map((r) => ({
      count: r.no_of_reactions,
      id: r.reaction_id,
      name: r.reaction_name,
      url: r.reaction_url,
    })),
    commentsInfo: {
      featuredComment: data.commentsInfo ? data.commentsInfo.comment : '',
      commentsCount: data.commentsInfo ? data.commentsInfo.count : 0,
      ...data.commentsInfo,
    },
    attachmentsArray: [...data.attachments_array],
    userHasReacted: data.hasUserReacted,
    userColor: data.user_color,
    replyTo:
      data.message_status !== 'deleted' && data.primaryChat && data.primaryChat.chat_id
        ? {
            id: data.primaryChat.chat_id,
            username: `${data.primaryChat.sent_by.first_name} ${data.primaryChat.sent_by.last_name}`,
            message: formatMessageContent(data.primaryChat),
          }
        : {},
  }));

export const formatMessage = (data, userIsAuthor) => ({
  id: data.chat_id,
  attachmentsArray: data.attachments_array.length
    ? [{ ...data.attachments_array[0], file_type: data.attachments_array[0].type }]
    : [],
  message: formatMessageContent(data),
  thumbnail:
    data.sent_by.display_picture ||
    'https://s3.ap-south-1.amazonaws.com/ingenium-question-images/1631183013255.png',
  userIsAuthor,
  timestamp: data.sent_time,
  userColor: data.user_color,
  username: `${data.sent_by.first_name} ${data.sent_by.last_name}`,
  reactions: (data.reactions || []).map((r) => ({
    count: r.no_of_reactions,
    id: r.reaction_id,
    name: r.reaction_name,
    url: r.reaction_url,
  })),
  userHasReacted: data.hasUserReacted,
  commentsInfo: {
    featuredComment: data.commentsInfo ? data.commentsInfo.comment : '',
    commentsCount: data.commentsInfo ? data.commentsInfo.count : 0,
  },
  replyTo: data.message_status !== 'deleted' && data.primaryChat ? data.primaryChat : {},
});

export const formatConversation = (responseFromServer) => {};

export const formatConversations = (list) =>
  list.map((conversation) => ({
    id: conversation.conversation_id,
    name: conversation.name,
    thumbnail:
      conversation.display_picture ||
      'https://s3.ap-south-1.amazonaws.com/ingenium-question-images/1631183013255.png',
    subTitle: conversation.last_message || '',
    unreadCount: conversation.unread_message_count || 0,
    messages: [],
    page: 1,
  }));

export const formatPost = (data, clientUserId) => ({
  id: data.chat_id,
  message: {
    type: 'post',
    content: {
      title: data.title,
      desc: data.text,
      cover:
        data.attachments_array.length === 0
          ? ''
          : data.attachments_array[0].file_url || data.attachments_array[0].url,
    },
    commentsEnabled: data.comments_enabled,
    reactionsEnabled: data.reactions_enabled,
  },
  comments: data.comments,
  attachments: data.attachments_array,
  thumbnail:
    data.sent_by.display_picture ||
    'https://s3.ap-south-1.amazonaws.com/ingenium-question-images/1631183013255.png',
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
});

// comment_text: "Ujjjj"
// created_at: "1618513991"
// hasUserReacted: false
// no_of_replies: 0
// post_comments_id: 50
// post_comments_post_comments_id: 28
// reactions: []
// sent_by: {first_name: "Baddam Admin", last_name: "", display_picture: null, client_user_id: 1801}
// success: 1

export const formatReplies = (data) => {
  console.log('formatting replies - ', data);
  return data;
};
