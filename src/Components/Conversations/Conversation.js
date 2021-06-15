import React, { useEffect, useState, useRef } from 'react';
import { useHistory } from 'react-router-dom';
// import { connect } from 'react-redux';
import { useDispatch, useSelector } from 'react-redux';

// import PropTypes from 'prop-types';
import { Row, Col, Button } from 'react-bootstrap';
import { v4 as uuidv4 } from 'uuid';
import { get, apiValidation, uploadFiles, post } from '../../Utilities';
import { conversationsActions } from '../../redux/actions/conversations.action';
import { getConversation, getSocket, getPosts } from '../../redux/reducers/conversations.reducer';
import { getClientUserId } from '../../redux/reducers/clientUserId.reducer';
import ConversationHeader from './ConversationHeader';
import ConversationInput from './ConversationInput';
import { formatMessages, formatMessage } from './formatter';
import Messages from './Messages/Messages';
import './Conversation.scss';

const CONVERSATION_TYPES = {
  CHAT: 'chats',
  POST: 'discussions',
};

const Conversation = () => {
  const history = useHistory();

  const dispatch = useDispatch();

  const conversation = useSelector((state) => getConversation(state));
  const clientUserId = useSelector((state) => getClientUserId(state));
  const socket = useSelector((state) => getSocket(state));
  const posts = useSelector((state) => getPosts(state));

  const [activeTab, setActiveTab] = useState(CONVERSATION_TYPES.CHAT);
  const [reply, setReply] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const setConversation = (data) => dispatch(conversationsActions.setConversation(data));
  const setPosts = (data) => dispatch(conversationsActions.setPosts(data));

  const messagesEnd = useRef();

  useEffect(() => {
    fetchMessages();
    socket.emit('join', { conversation_id: conversation.id, clientUserId });
    socket.on('conversationMessage', onReceiveMessage);
    return () => socket.emit('leave', { conversation_id: conversation.id });
  }, []);

  useEffect(() => {
    socket.on('conversationMessage', onReceiveMessage);
  }, [conversation]);

  const addMessage = (message) => {
    const newConversation = { ...conversation };
    const { messages } = newConversation;
    console.log(messages);
    const newMessages = [...messages];
    newMessages.push(message);
    console.log(newMessages);
    newConversation.messages = newMessages;
    setConversation(newConversation);
  };

  const onReceiveMessage = (data) => {
    console.log(data, `receiveMessage emitted from  ${conversation.id}`);
    console.log(conversation);
    // {
    //   id: data.chat_id,
    //   message: formatMessageContent(data),
    //   thumbnail: data.sent_by.display_picture || 'https://i.pravatar.cc/40',
    //   userIsAuthor: false,
    //   timestamp: data.sent_time,
    //   username: `${data.sent_by.first_name} ${data.sent_by.last_name}`,
    // }
    addMessage(formatMessage(data, false));
  };

  const fetchMessages = () => {
    get(
      null,
      `/getChtOfConversation?conversation_id=${conversation.id}&client_user_id=${clientUserId}`,
    ).then((res) => {
      const apiData = apiValidation(res);
      const {
        next: { page },
      } = res;
      console.log(apiData, 'apiData');
      const { message_array: messageArray, participants_count: participantsCount } = apiData;
      const messages = formatMessages(messageArray, clientUserId);
      const { id, name, thumbnail } = conversation;
      console.log(page);
      setConversation({
        id,
        participantsCount,
        name,
        thumbnail,
        messages,
        page,
      });
    });
  };

  const fetchMoreMessages = (page) => {
    const { id } = conversation;
    console.log('fetching more messages');
    console.log('page', page);
    if (!isLoading && page > 1) {
      setIsLoading(true);
      get(
        null,
        `/getChtOfConversation?conversation_id=${id}&client_user_id=${clientUserId}&page=${page}`,
      ).then((res) => {
        console.log(
          `/getChtOfConversation?conversation_id=${id}&client_user_id=${clientUserId}&page=${page}`,
        );
        const apiData = apiValidation(res);
        const { next: { page: nextPage } = { page: null } } = res;
        console.log(apiData, 'apiData');
        console.log(nextPage, 'nextPage');
        const { message_array: messageArray } = apiData;
        const newMessages = formatMessages(messageArray, clientUserId);
        const { messages: prevMessages } = conversation;
        console.log(newMessages);
        console.log(newMessages.concat(prevMessages));
        setConversation({
          ...conversation,
          messages: newMessages.concat(prevMessages),
          page: nextPage,
        });
        setIsLoading(false);
      });
    }
  };

  const fetchPosts = () => {
    get(
      null,
      `/getPostsOfConversation?client_user_id=${clientUserId}&conversation_id=${conversation.id}`,
    ).then((res) => {
      const apiData = apiValidation(res);
      const { next: { page: nextPage } = { page: null } } = res;
      const messages = formatMessages(apiData, clientUserId);
      setConversation({ ...conversation, page: nextPage });
      setPosts(messages);
      console.log(messages);
    });
  };

  const fetchMorePosts = (page) => {
    const { id } = conversation;
    console.log('fetching more post');
    console.log('page', page);
    if (!isLoading && page > 1) {
      setIsLoading(true);
      get(
        null,
        `/getPostsOfConversation?conversation_id=${id}&client_user_id=${clientUserId}&page=${page}`,
      ).then((res) => {
        console.log(
          `/getPostsOfConversation?conversation_id=${id}&client_user_id=${clientUserId}&page=${page}`,
        );
        const apiData = apiValidation(res);
        const { next: { page: nextPage } = { page: null } } = res;
        console.log(apiData, 'apiData');
        console.log(nextPage, 'nextPage');
        const newMessages = formatMessages(apiData, clientUserId);
        console.log(newMessages);
        console.log(newMessages.concat(posts));
        setPosts(newMessages.concat(posts));
        setConversation({
          ...conversation,
          page: nextPage,
        });
        setIsLoading(false);
      });
    }
  };

  const reactToMessage = (messageId, userHasReacted) => {
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

  const uploadFile = (file, fileType) => {
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

    uploadFiles([{ file, type: 'image' }]).then((res) => {
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
          setReply(null);
          const index = newMessages.findIndex((message) => message.id === tempId);
          console.log(index);
          if (index === -1) return;
          newMessages[index].id = data.chat_id;
          newMessages[index].isLoading = false;
          conversation.messages = newMessages;
          setConversation(conversation);
          messagesEnd.current !== null && messagesEnd.current.scrollIntoView();
        },
      );
    });
  };

  const sendMessage = (message) => {
    socket.emit(
      'sendMessage',
      {
        sender_id: clientUserId,
        conversation_id: conversation.id,
        text: message,
        type: 'message',
        attachments_array: [],
        primary_chat_id: reply?.id,
      },
      (error, data) => {
        console.log('ack', data);

        addMessage({
          id: data.chat_id,
          message: {
            type: 'text',
            content: message,
          },
          userIsAuthor: true,
          thumbnail: '',
          timestamp: Date.now().toString(),
          replyTo: reply,
        });
        setReply(null);

        socket.emit(
          'sendMessage',
          {
            sender_id: 1801,
            conversation_id: conversation.id,
            text: message,
            type: 'message',
            attachments_array: [],
            primary_chat_id: reply?.id,
          },
          (err, ack) => {
            console.log('aaaaaa', ack);
          },
        );

        messagesEnd.current !== null && messagesEnd.current.scrollIntoView();
      },
    );
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

  const showConversationDetails = () => {
    console.log('Hello');
    history.push('/conversation/details');
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
          onClick={showConversationDetails}
        />
      </div>
      <Row>
        {activeTab === CONVERSATION_TYPES.CHAT && (
          <Col md={12}>
            <Messages
              ref={messagesEnd}
              list={conversation.messages}
              onReactionToMessage={(id, reacted) => reactToMessage(id, reacted)}
              onSlide={(message) => replyToMessage(message)}
              isLoading={isLoading}
              nextPage={conversation.page}
              loadMore={(page) => fetchMoreMessages(page)}
              ref={messagesEnd}
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
          <Col md={12}>
            <div className='p-2 discussions-container'>
              <Messages
                onReactionToMessage={(id, reacted) => {}}
                list={posts || []}
                isLoading={isLoading}
                nextPage={conversation.page}
                loadMore={(page) => fetchMorePosts(page)}
                ref={messagesEnd}
              />
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

export default Conversation;
