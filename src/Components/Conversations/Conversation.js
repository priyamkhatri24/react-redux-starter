import React, { useEffect, useState, useRef } from 'react';
import { useHistory } from 'react-router-dom';
// import { connect } from 'react-redux';
import { useDispatch, useSelector, connect } from 'react-redux';

// import PropTypes from 'prop-types';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { v4 as uuidv4 } from 'uuid';
import io from 'socket.io-client';
import Add from '@material-ui/icons/Add';
import { get, apiValidation, uploadFiles, post } from '../../Utilities';
import MobileConversationCard from './mobile/MobileConversationCard';
import { conversationsActions } from '../../redux/actions/conversations.action';
import {
  getConversation,
  getSocket,
  getPosts,
  getConversations,
} from '../../redux/reducers/conversations.reducer';
import {
  getClientUserId,
  getRoleArray,
  getClientId,
} from '../../redux/reducers/clientUserId.reducer';
import ConversationHeader from './ConversationHeader';
import ConversationsHeader from './ConversationsHeader';
import ConversationInput from './ConversationInput';
import { formatMessages, formatMessage } from './formatter';
import Messages from './Messages/Messages';
import './Conversation.scss';

const CONVERSATION_TYPES = {
  CHAT: 'chats',
  POST: 'discussions',
};

const Conversation = (props) => {
  const [action, setAction] = useState('');
  const history = useHistory();
  const dispatch = useDispatch();
  // const [conversation, setConversation] = useState(useSelector((state) => getConversation(state)));

  const conversation = useSelector((state) => getConversation(state));
  const conversations = useSelector((state) => getConversations(state));
  const clientUserId = useSelector((state) => getClientUserId(state));
  const clientId = useSelector((state) => getClientId(state));
  const socket = useSelector((state) => getSocket(state));
  const posts = useSelector((state) => getPosts(state));
  const roleArray = useSelector((state) => getRoleArray(state));
  const [details, setDetails] = useState(null);
  const [activeTab, setActiveTab] = useState(CONVERSATION_TYPES.CHAT);
  const [reply, setReply] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState('');

  const setConversation = (data) => dispatch(conversationsActions.setConversation(data));
  const setConversations = (data) => dispatch(conversationsActions.setConversations(data));
  const setPosts = (data) => dispatch(conversationsActions.setPosts(data));
  const setSocket = (sockett) => dispatch(conversationsActions.setSocket(sockett));

  const messagesEnd = useRef();

  useEffect(() => {
    fetchMessages(conversation);

    if (!socket) return;
    socket?.emit('join', { conversation_id: conversation.id, clientUserId });
    socket?.emit('user-connected', { client_user_id: clientUserId });
    socket?.on('socket-connected', () => {
      socket.emit('user-connected', { client_user_id: clientUserId });
    });
    socket?.on('connect', () => console.log('connected'));
    socket?.on('disconnect', connectAgain);
    /* eslint-disable */
    return () => socket?.emit('leave', { conversation_id: conversation.id });
  }, [socket]);

  useEffect(() => {
    console.log('whattttt');
    socket?.on('receiveMessage', addMessageToConversation);
    socket?.on('conversationMessage', onReceiveMessage);
    socket?.on('deleteMessage', onDeleteMessage);
    return () => {
      socket?.off('conversationMessage', onReceiveMessage);
      socket?.off('receiveMessage', addMessageToConversation);
      socket?.off('deleteMessage', onDeleteMessage);
    };
  }, [conversation]);

  useEffect(() => {
    console.log('getting changed....');
    fetchDetails();
    socket?.on('conversationMessage', onReceiveMessage);
    socket?.on('deleteMessage', onDeleteMessage);
    socket?.emit('join', { conversation_id: conversation.id, clientUserId });
    socket?.emit('user-connected', { client_user_id: clientUserId });
    socket?.on('socket-connected', emitUserConnected);
    return () => {
      socket?.off('conversationMessage', onReceiveMessage);
      socket?.off('socket-connected', emitUserConnected);
      socket?.off('deleteMessage', onDeleteMessage);
      socket?.emit('leave', { conversation_id: conversation.id });
    };
  }, [conversation.id]);

  const emitUserConnected = () => {
    socket.emit('user-connected', { client_user_id: clientUserId });
  };

  const connectAgain = () => {
    // console.log(socket.id, 'disconnected');
    const sockett = io('https://portal.tca.ingeniumedu.com', {
      transports: ['websocket', 'polling'],
      autoConnect: true,
    });
    setSocket({ sockett });
  };

  const checkSocketAndReconnect = () => {
    console.log(socket);
    if (!socket) {
      console.log('reconnecting...');
      connectAgain();
      console.log('connectedAgain');
    }
  };

  const addMessageToConversation = function (data) {
    setAction('newconversation');
    console.log(data, 'receiveMessage emitted from Conversations');
    const conversationIndex = conversations.findIndex((c) => c.id === data.conversation_id);
    if (conversationIndex === -1) return;

    const newConversations = [...conversations];
    const conversationNew = newConversations[conversationIndex];
    conversationNew.subTitle = {
      text: data.text,
      type: data.type,
      file_type: data.attachments_array?.length ? data.attachments_array[0].type : '',
    };
    if (data.conversation_id !== conversation.id) {
      conversationNew.unreadCount++;
    }
    newConversations.splice(conversationIndex, 1);
    newConversations.unshift(conversationNew);
    setConversations(newConversations);
    // onReceiveMessage(data);
  };

  useEffect(() => {
    if (roleArray.includes(1) || roleArray.includes(2)) {
      setRole('student');
    } else if (roleArray.includes(3) || roleArray.includes(4)) {
      setRole('admin');
    }
    console.log(role);
  }, [roleArray]);

  const addMessage = (message) => {
    const newConversation = { ...conversation };
    const { messages } = newConversation;
    console.log(messages);
    const newMessages = [...messages];
    newMessages.push(message);
    console.log(newMessages);
    newConversation.messages = newMessages;
    // setLocalConvo(newConversation);
    setConversation(newConversation);
  };

  const onDeleteMessage = (data) => {
    setAction('delete');
    const newConvo = { ...conversation };
    const { messages } = newConvo;
    const newMessages = [...messages];
    newMessages.forEach((ele) => {
      const { message } = ele;
      if (ele.id == data.chat_id) {
        if (message.type !== 'text') {
          message.type = 'text';
          ele.attachments_array = [];
        }
        ele.replyTo = {};
        message.content = 'This message was deleted';
        console.log(message, 'converted');
      }
      ele.message = message;
    });
    newConvo.messages = newMessages;
    console.log('deleted', data, conversation, newConvo);
    setConversation(newConvo);
  };

  const onReceiveMessage = (data) => {
    setAction('recieve');
    // socket.on("connect", 'connectedAgain')
    console.log(data, `receiveMessage emitted from  ${conversation.id}`);

    if (data.conversation_id !== conversation.id) return;
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

  const deleteMessage = (chatId) => {
    const payload = {
      conversation_id: conversation.id,
      client_user_id: clientUserId,
      chat_id: chatId,
    };
    post(payload, '/deleteChat').then((res) => {
      console.log(res);
    });
  };
  const fetchMessages = (conversation) => {
    get(
      {
        conversation_id: conversation.id,
        client_user_id: clientUserId,
      },
      `/getChtOfConversation`,
    ).then((res) => {
      const apiData = apiValidation(res);
      if (!res) return;
      const page = res.next?.page;
      console.log(apiData, 'apiiidattaaaa');
      const { message_array: messageArray, participants_count: participantsCount } = apiData;
      const messages = formatMessages(messageArray, clientUserId);
      const { id, name, thumbnail } = conversation;
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
    setAction('fetch');
    const { id } = conversation;
    if (!isLoading && page > 1) {
      setIsLoading(true);
      get(
        null,
        `/getChtOfConversation?conversation_id=${id}&client_user_id=${clientUserId}&page=${page}`,
      ).then((res) => {
        const apiData = apiValidation(res);
        const { next: { page: nextPage } = { page: null } } = res;
        console.log(apiData, 'apiData');
        console.log(nextPage, 'nextPage');
        const { message_array: messageArray } = apiData;
        const newMessages = formatMessages(messageArray, clientUserId);
        const { messages: prevMessages } = conversation;
        console.log(newMessages);
        if (!nextPage) {
          newMessages.unshift({
            message: { type: 'begining', content: 'Begining of conversation' },
          });
        }
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

  const fetchDetails = () => {
    get(null, `/conversations/${conversation.id}/details`).then((res) => {
      const apiData = apiValidation(res);
      console.log(apiData, 'detailss');
      setDetails(apiData);
    });
  };

  const fetchPosts = () => {
    setAction('fetchpost');
    get(
      {
        client_user_id: clientUserId,
        conversation_id: conversation.id,
      },
      `/getPostsOfConversation`,
    ).then((res) => {
      const apiData = apiValidation(res);
      const { next: { page: nextPage } = { page: null } } = res;
      const messages = formatMessages(apiData, clientUserId);
      setConversation({ ...conversation, page: nextPage });
      setPosts(messages);
      console.log(messages, '');
    });
  };

  const fetchMorePosts = (page) => {
    setAction('fetchmorepost');
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

  const reactToPost = (messageId, userHasReacted) => {
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
        const newPosts = [...posts];
        const index = newPosts.findIndex((message) => message.id === messageId);
        const newPost = newPosts[index];
        console.log(newPost);
        const { reactions } = newPost;

        console.log('index', index);
        if (!userHasReacted && reactions.length > 0) {
          const reaction = reactions.pop();
          console.log(reaction, 'hehe gotcha1');
          reaction.count += 1;
          message.userHasReacted = true;
          message.reactions = [reaction];
        } else if (!userHasReacted && reactions.length === 0) {
          reactions.push({
            count: 1,
            id: 1,
            name: 'like',
            url: 'abc.com',
          });
          message.userHasReacted = true;
          console.log(reactions, 'haha here you are');
        }

        if (userHasReacted) {
          const reaction = reactions.pop();
          console.log(reaction, 'hehe gotcha2');
          reaction.count -= 1;
          message.reactions = [reaction];
          message.userHasReacted = false;
        }

        newPost.reactions = reactions;
        newPosts[index] = newPost;
        console.log(newPost);
        setPosts(newPosts);
      })
      .catch((e) => {
        console.log('erroring out');
        console.log(e);
        console.error(e);
      });
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
        console.log(res, 'reacteddddddd');
        const newConversation = { ...conversation };
        const { messages } = newConversation;
        const index = messages.findIndex((message) => message.id === messageId);
        const message = messages[index];
        console.log(message);
        const { reactions } = message;

        console.log('index', index);
        if (!userHasReacted && reactions.length > 0) {
          const reaction = reactions.pop();
          console.log(reaction, 'hah gotvha2');

          reaction.count = res.no_of_reactions;
          message.userHasReacted = true;
          message.reactions.push(reaction);
        } else if (!userHasReacted && reactions.length === 0) {
          reactions.push({
            count: 1,
            id: 1,
            name: 'like',
            url: 'abcd.com',
          });
          message.userHasReacted = true;
        }

        if (userHasReacted) {
          const reaction = reactions.pop();
          console.log(reaction, 'hah gotvha1');
          reaction.count = res.no_of_reactions;
          message.reactions.push(reaction);
          message.userHasReacted = false;
        }

        // if (!userHasReacted) {
        //   if (reactions.length > 0) {
        //     reactions[0].count += 1;
        //   } else {
        //     reactions.push({
        //       count: 1,
        //       id: 1,
        //       name: 'like',
        //       url: 'abc.com',
        //     });
        //   }
        //   message.userHasReacted = true;
        // } else {
        //   message.userHasReacted = false;
        //   if (reactions[0].count - 1 > 0) {
        //     reactions[0].count -= 1;
        //   } else {
        //     reactions = [];
        //   }
        // }

        message.reactions = reactions;
        messages[index] = message;
        newConversation.messages = messages;
        console.log(message);
        setConversation(newConversation);
      })
      .catch((e) => {
        console.log('erroring out');
        console.log(e);
        console.error(e);
      });
  };

  const uploadFile = (file, fileType) => {
    checkSocketAndReconnect();
    // console.log(file, fileType, 'uploadddddddddddd');
    if (!file) return;
    const url = URL.createObjectURL(file);
    const tempId = uuidv4();
    console.log('url', url);
    const newMessage = {
      id: tempId,
      message: {
        type: fileType,
        content: url,
        name: file.name,
      },
      userIsAuthor: true,
      thumbnail: '',
      timestamp: Date.now().toString(),
      isLoading: true,
    };

    if (fileType === 'image') {
      addMessageToConversation({
        text: null,
        conversation_id: conversation.id,
        type: 'message',
        file_type: 'image',
        attachments_array: [{ type: 'image' }],
      });
      history.push({
        pathname: '/image-editor',
        state: { ...newMessage, file },
      });
      return;
    }

    const newConversation = { ...conversation };
    const { messages } = newConversation;
    const newMessages = [...messages];
    newMessages.push(newMessage);
    newConversation.messages = newMessages;
    setConversation(newConversation);

    uploadFiles([{ file, type: fileType }]).then((res) => {
      const { attachments_array: arr } = res;
      const { url: filename } = arr[0];
      const emitData = {
        sender_id: clientUserId,
        client_id: clientId,
        conversation_id: conversation.id,
        text: '',
        type: 'message',
        attachments_array: [{ url: filename, type: fileType, name: file.name }],
        primaryChat: reply,
      };
      socket?.emit('sendMessage', emitData, (error, data) => {
        setAction('add');
        addMessageToConversation(emitData);
        setReply(null);
        console.log('upload data recved');
        const indexOfMessage = newMessages.findIndex((message) => message.id === tempId);
        console.log('indexOfMessage is: ', indexOfMessage);
        if (indexOfMessage === -1) return;
        newMessages[indexOfMessage].id = data.chat_id;
        newMessages[indexOfMessage].isLoading = false;
        setIsLoading(false);
        newMessages[indexOfMessage].message = {
          type: fileType,
          name: file.name,
          content: filename,
        };
        console.log(newMessages);
        newConversation.messages = newMessages;
        // newConversation.messages = newFnlMsg;
        setConversation(newConversation);
        console.log(conversation);

        // messagesEnd.current !== null && messagesEnd.current.scrollIntoView();
      });
    });
  };

  const sendMessage = (message) => {
    checkSocketAndReconnect();
    const emitData = {
      sender_id: clientUserId,
      client_id: clientId,
      conversation_id: conversation.id,
      text: message,
      type: 'message',
      attachments_array: [],
      primaryChat: reply,
      primary_chat_id: reply?.id,
    };
    socket?.emit('sendMessage', emitData, (error, data) => {
      setAction('add');
      console.log('accccccccck', data);
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
      addMessageToConversation(emitData);
      setReply(null);
      // messagesEnd.current !== null && messagesEnd.current.scrollIntoView();
    });
  };

  const replyToMessage = (message) => {
    console.log(message);
    if (message.message.type !== 'post') {
      setReply(message);
    }
  };

  const onTabSelected = (tab) => {
    if (tab === CONVERSATION_TYPES.CHAT) {
      fetchMessages(conversation);
    } else {
      fetchPosts();
    }
    setActiveTab(tab);
  };

  const showConversationDetails = () => {
    console.log('Hello');
    history.push('/conversation/details');
  };

  const onConversationSelected = function (c) {
    fetchMessages(c);
    conversations.forEach((convo) => {
      if (convo.id === c.id) {
        convo.unreadCount = 0;
      }
    });
    // window.location.reload();
    // history.push('/conversation');
  };

  const sideShadowStyle = {
    borderRight: '1px solid #ccc',
    boxShadow: '7px 0px 15px -10px rgba(0,0,0,0.05)',
    position: 'fixed',
    backgroundColor: 'white',
    padding: '0px',
  };

  return (
    <div style={{ height: '100vh' }}>
      <Col className='hideOnMobile' style={sideShadowStyle} md={3}>
        <ConversationsHeader searchBar goToConversations title='Chats' />
        <div className='conversations-container overflow-auto mt-3'>
          {conversations.length > 0 && (
            <ul className='list-unstyled'>
              {conversations.map((data) => (
                <MobileConversationCard
                  key={data.id}
                  name={data.name}
                  subTitle={data.subTitle}
                  unreadCount={data.unreadCount}
                  thumbnail={data.thumbnail}
                  onClick={() => onConversationSelected(data)}
                />
              ))}
            </ul>
          )}
          {conversations.length === 0 && (
            <p className='text-center'>Seems like you dont have any chats</p>
          )}
        </div>
      </Col>
      <div className='desktopHeader' style={{ backgroundColor: '#fff' }}>
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
          <Col>
            <Messages
              ref={messagesEnd}
              list={conversation.messages}
              onReactionToMessage={(id, reacted) => reactToMessage(id, reacted)}
              onSlide={(message) => replyToMessage(message)}
              isLoading={isLoading}
              nextPage={conversation.page}
              loadMore={(page) => fetchMoreMessages(page)}
              ref={messagesEnd}
              deleteMessage={deleteMessage}
              role={role}
              action={action}
              conversations={conversations}
            />
            {role === 'admin' ? (
              <ConversationInput
                sendMessage={(message) => sendMessage(message)}
                onFileUpload={(file, type) => uploadFile(file, type)}
                reply={reply}
                onRemoveReply={() => setReply(null)}
              />
            ) : role === 'student' && details && details.can_student_message !== 'false' ? (
              <ConversationInput
                sendMessage={(message) => sendMessage(message)}
                onFileUpload={(file, type) => uploadFile(file, type)}
                reply={reply}
                onRemoveReply={() => setReply(null)}
              />
            ) : role === 'student' && details && details.can_student_message === 'false' ? (
              <p
                style={{ textAlign: 'center', backgroundColor: 'white' }}
                className='desktopInput mx-auto mb-0 py-2'
              >
                Students can't message in this group
              </p>
            ) : (
              <p
                style={{ textAlign: 'center', backgroundColor: 'white' }}
                className='desktopInput mx-auto mb-0 py-2'
              />
            )}
          </Col>
        )}
        {activeTab === CONVERSATION_TYPES.POST && (
          <Col md={12}>
            <div className='p-2 discussions-container'>
              <Messages
                onReactionToMessage={(id, reacted) => reactToPost(id, reacted)}
                list={posts || []}
                isLoading={isLoading}
                nextPage={conversation.page}
                loadMore={(page) => fetchMorePosts(page)}
                ref={messagesEnd}
                deleteMessage={deleteMessage}
                role={role}
                action={action}
              />
              {role === 'admin' ? (
                <div className='p-2 fixed-bottom' style={{ backgroundColor: '#fff' }}>
                  <Button
                    size='lg'
                    variant='primary'
                    block
                    className='add-post-btn desktopInput2'
                    onClick={() => history.push('/create-post')}
                  >
                    <Add /> Add new post
                  </Button>
                  {/* eslint-disable */}
                </div>
              ) : role === 'student' && details.can_student_post !== 'false' ? (
                <div className='p-2 fixed-bottom' style={{ backgroundColor: '#fff' }}>
                  <Button
                    size='lg'
                    variant='primary'
                    block
                    className='add-post-btn desktopInput2'
                    onClick={() => history.push('/create-post')}
                  >
                    <Add /> Add new post
                  </Button>
                </div>
              ) : null}
            </div>
          </Col>
        )}
      </Row>
    </div>
  );
};

export default Conversation;
