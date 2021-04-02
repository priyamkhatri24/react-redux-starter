import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Row, Col, Button } from 'react-bootstrap';
import { v4 as uuidv4 } from 'uuid';
import { get, apiValidation, uploadImage, post } from '../../Utilities';
import { conversationsActions } from '../../redux/actions/conversations.action';
import { getConversation, getSocket, getPosts } from '../../redux/reducers/conversations.reducer';
import { getClientUserId } from '../../redux/reducers/clientUserId.reducer';
import ConversationHeader from './ConversationHeader';
import ConversationInput from './ConversationInput';
import Messages from './Messages/Messages';
import Message from './Message/Message';
import './Conversation.scss';

const CONVERSATION_TYPES = {
  CHAT: 'chats',
  POST: 'discussions',
};

const Conversation = function ({
  conversation,
  setConversation,
  clientUserId,
  socket,
  setPosts,
  posts = [],
}) {
  const history = useHistory();
  const [activeTab, setActiveTab] = useState(CONVERSATION_TYPES.CHAT);
  const [reply, setReply] = useState(null);

  useEffect(() => {
    fetchMessages();
    socket.emit('join', { conversation_id: conversation.id });
    socket.on('conversationMessage', onReceiveMessage);
    return () => socket.emit('leave', { conversation_id: conversation.id });
  }, []);

  const addMessage = function (message) {
    const newConversation = { ...conversation };
    const { messages } = newConversation;
    console.log(messages);
    const newMessages = [...messages];
    newMessages.push(message);
    console.log(newMessages);
    newConversation.messages = newMessages;
    setConversation(newConversation);
  };

  const onReceiveMessage = function (data) {
    console.log(data, `receiveMessage emitted from  ${conversation.id}`);
    console.log(conversation);
    addMessage({
      id: data.chat_id,
      message: getMessageByType(data),
      thumbnail: data.sent_by.display_picture || 'https://i.pravatar.cc/40',
      userIsAuthor: false,
      timestamp: data.sent_time,
      username: `${data.sent_by.first_name} ${data.sent_by.last_name}`,
    });
  };

  const getMessageByType = function (data) {
    if (data.type === 'post') {
      console.log(data);

      return {
        type: 'post',
        content: {
          title: data.title,
          desc: data.text,
          cover: data.attachments_array.length === 0 ? '' : data.attachments_array[0].file_url,
        },
      };
    }

    if (data.attachments_array.length > 0) {
      return {
        type: data.attachments_array[0].file_type,
        name: data.attachments_array[0].file_name,
        content: data.attachments_array[0].file_url,
      };
    }

    return {
      type: 'text',
      content: data.text,
    };
  };

  const fetchMessages = function () {
    get(
      null,
      `/getChtOfConversation?conversation_id=${conversation.id}&client_user_id=${clientUserId}`,
    ).then((res) => {
      const apiData = apiValidation(res);
      console.log(apiData, 'apiData');
      const { message_array: messageArray, participants_count: participantsCount } = apiData;
      const messages = messageArray.map((data) => ({
        id: data.chat_id,
        message: getMessageByType(data),
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

      setConversation({
        id: conversation.id,
        participantsCount,
        name: conversation.name,
        thumbnail: conversation.thumbnail,
        messages,
      });
    });
  };

  const reactToMessage = function (messageId, userHasReacted) {
    post(
      {
        reaction_id: 1,
        client_user_id: clientUserId,
        chat_id: messageId,
        conversation_id: conversation.id,
      },
      '/addReactionToChat',
    )
      .then((res) => {
        const newConversation = { ...conversation };
        const { messages } = newConversation;
        const index = messages.findIndex((message) => message.id === messageId);
        const message = messages[index];
        const { reactions } = message;

        if (!userHasReacted) {
          if (reactions.length > 0) {
            reactions[0].count += 1;
          } else {
            reactions.push({
              count: 1,
              id: 1,
              name: 'like',
              url: 'abc.com',
            });
          }
          message.userHasReacted = true;
        } else {
          message.userHasReacted = false;
          reactions[0].count -= 1;
        }

        message.reactions = reactions;
        messages[index] = message;
        setConversation(newConversation);
      })
      .catch((e) => {
        console.error(e);
      });
  };

  function fetchPosts() {
    get(
      null,
      `/getPostsOfConversation?client_user_id=${clientUserId}&conversation_id=${conversation.id}`,
    ).then((res) => {
      const apiData = apiValidation(res);
      const messages = apiData.map((data) => ({
        id: data.chat_id,
        message: getMessageByType(data),
        thumbnail: data.sent_by.display_picture || 'https://i.pravatar.cc/40',
        userIsAuthor: data.sent_by.client_user_id === clientUserId,
        timestamp: data.sent_time,
        username: `${data.sent_by.first_name} ${data.sent_by.last_name}`,
        reactions: data.reactions.map((r) => ({
          count: r.no_of_reactions,
          id: r.reaction_id,
          name: r.reaction_name,
          url: r.reaction_url,
          userHasReacted: false,
        })),
        userHasReacted: data.hasUserReacted,
      }));

      setPosts(messages);
    });
  }

  const uploadFile = function (file, fileType) {
    if (!file) return;
    const url = URL.createObjectURL(file);
    const tempId = uuidv4();
    console.log('url', url);
    const newMessage = {
      id: tempId,
      message: {
        type: fileType,
        content: url,
      },
      userIsAuthor: true,
      thumbnail: '',
      timestamp: Date.now().toString(),
      isLoading: true,
    };

    const newConversation = { ...conversation };
    const { messages } = newConversation;
    console.log(messages);
    const newMessages = [...messages];
    newMessages.push(newMessage);
    console.log(newMessages);
    newConversation.messages = newMessages;
    setConversation(newConversation);

    uploadImage(file).then((res) => {
      console.log(res.filename);
      const { filename } = res;
      socket.emit(
        'sendMessage',
        {
          sender_id: clientUserId,
          conversation_id: conversation.id,
          text: null,
          type: 'message',
          attachments_array: [{ url: filename, type: fileType, name: file.name }],
        },
        (error, data) => {
          console.log('ack', data);
          const index = newMessages.findIndex((message) => message.id === tempId);
          console.log(index);
          if (index === -1) return;
          newMessages[index].id = data.chat_id;
          newMessages[index].isLoading = false;
          conversation.messages = newMessages;
          setConversation(conversation);
        },
      );
    });
  };

  const sendMessage = function (message) {
    if (socket)
      socket.emit(
        'sendMessage',
        {
          sender_id: clientUserId,
          conversation_id: conversation.id,
          text: message,
          type: 'message',
          attachments_array: [],
        },
        (data) => {
          console.log('ack', data);
        },
      );

    addMessage({
      message: {
        type: 'text',
        content: message,
      },
      userIsAuthor: true,
      thumbnail: '',
      timestamp: Date.now().toString(),
    });
  };

  const replyToMessage = (message) => {
    console.log(message);
    setReply(message);
  };

  const onTabSelected = (tab) => {
    if (tab === CONVERSATION_TYPES.CHAT) {
      fetchMessages();
    } else {
      fetchPosts();
    }
    setActiveTab(tab);
  };

  return (
    <>
      <div className='fixed-top' style={{ zIndex: 2, backgroundColor: '#fff' }}>
        <ConversationHeader
          thumbnail={conversation.thumbnail}
          name={conversation.name}
          participantsCount={conversation.participantsCount}
          activeTab={activeTab}
          onTabSelected={onTabSelected}
        />
      </div>
      <Row>
        {activeTab === CONVERSATION_TYPES.CHAT && (
          <Col md={12}>
            <Messages
              list={conversation.messages}
              onReactionToMessage={(id, reacted) => reactToMessage(id, reacted)}
              onSlide={(message) => replyToMessage(message)}
            />
            <ConversationInput
              sendMessage={(message) => sendMessage(message)}
              onFileUpload={(file, type) => uploadFile(file, type)}
              reply={reply}
              onRemoveReply={() => setReply(null)}
            />
          </Col>
        )}
        {activeTab === CONVERSATION_TYPES.POST && (
          <Col md={12} style={{ marginTop: '150px' }}>
            <div className='p-2 discussions-container'>
              {posts.length === 0 && (
                <p className='text-center' style={{ fontSize: '12px', width: '100%' }}>
                  You do not have any discussions yet!
                </p>
              )}
              {posts.length > 0 && <Messages list={posts} />}
              <div className='p-2 fixed-bottom' style={{ backgroundColor: '#fff' }}>
                <Button
                  size='lg'
                  variant='primary'
                  block
                  className='add-post-btn'
                  onClick={() => history.push('/create-post')}
                >
                  <i className='material-icons'>add</i> Add new post
                </Button>
              </div>
            </div>
          </Col>
        )}
      </Row>
    </>
  );
};

const mapStateToProps = (state) => ({
  conversation: getConversation(state),
  clientUserId: getClientUserId(state),
  socket: getSocket(state),
  posts: getPosts(state),
});

const mapDispatchToProps = (dispatch) => {
  return {
    setConversation: (conversation) => {
      dispatch(conversationsActions.setConversation(conversation));
    },
    setPosts: (posts) => {
      dispatch(conversationsActions.setPosts(posts));
    },
  };
};

Conversation.propTypes = {
  setConversation: PropTypes.func.isRequired,
  setPosts: PropTypes.func.isRequired,
  clientUserId: PropTypes.number.isRequired,
  socket: PropTypes.objectOf(PropTypes.any).isRequired,
  conversation: PropTypes.objectOf({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    thumbnail: PropTypes.string.isRequired,
    participantsCount: PropTypes.number,
    messages: PropTypes.arrayOf(PropTypes.objectOf(Message).isRequired).isRequired,
  }).isRequired,
  posts: PropTypes.arrayOf(PropTypes.objectOf(Message).isRequired).isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Conversation);
