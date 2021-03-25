import React, { useEffect, useState, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Webcam from 'react-webcam';
import {
  Row,
  Col,
  FormControl,
  Button,
  DropdownButton,
  Dropdown,
  ButtonGroup,
  Modal,
} from 'react-bootstrap';
import MicRecorder from 'mic-recorder-to-mp3';
import { get, apiValidation, uploadImage, post } from '../../Utilities';
import { conversationsActions } from '../../redux/actions/conversations.action';
import { getConversation, getSocket, getPosts } from '../../redux/reducers/conversations.reducer';
import { getClientUserId } from '../../redux/reducers/clientUserId.reducer';
import ConversationHeader from './ConversationHeader';
import Messages from './Messages/Messages';
import Message from './Message/Message';
import './Conversation.scss';

const ConversationInput = function ({ sendMessage, onFileUpload }) {
  const [message, setMessage] = useState('');
  const [recordingState, setRecordingState] = useState({
    isRecording: false,
    blobURL: '',
    isBlocked: false,
  });
  const [recorder, setRecorder] = useState(null);
  const [fileType, setFileType] = useState('');
  const fileSelector = useRef();
  const cameraSelector = useRef();
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const send = function () {
    sendMessage(message);
    setMessage('');
  };

  const openFilePicker = function (type) {
    let accept = '*';
    setFileType(type);

    if (type === 'image') {
      accept = 'image/png,image/jpeg,image/jpg';
    } else if (type === 'audio') {
      accept = 'audio/mp3';
    } else if (type === 'video') {
      accept = 'video/mp4';
    }

    fileSelector.current.accept = accept;
    fileSelector.current.click();
  };

  const startRecording = function () {
    const newRecorder = new MicRecorder({ bitRate: 128 });
    navigator.getUserMedia(
      { audio: true },
      () => {
        console.log('Permission Granted');
        newRecorder
          .start()
          .then(() => {
            setRecordingState({ ...recordingState, isRecording: true, isBlocked: false });
          })
          .catch((e) => console.error(e));
      },
      () => {
        console.log('Permission Denied');
        setRecordingState({ ...recordingState, isBlocked: true });
      },
    );

    setRecorder(newRecorder);
  };

  const stopRecording = () => {
    recorder
      .stop()
      .getMp3()
      .then(([buffer, blob]) => {
        const file = new File(buffer, 'recording.mp3', {
          type: blob.type,
          lastModified: Date.now(),
        });
        const blobURL = URL.createObjectURL(file);
        setRecordingState({ ...recordingState, blobURL, isRecording: false });
        onFileUpload(file, 'audio');
      })
      .catch((e) => console.log(e));
  };

  const captureImage = function () {
    function urltoFile(url, filename, mimeType) {
      return fetch(url)
        .then(function (res) {
          return res.arrayBuffer();
        })
        .then(function (buf) {
          return onFileUpload(new File([buf], 'image.png'), 'image');
        });
    }

    urltoFile(cameraSelector.current.getScreenshot());
  };

  return (
    <>
      <Row className='fixed-bottom pb-2' style={{ backgroundColor: '#fff', zIndex: 2 }}>
        <Col xs={12}>
          <div className='d-flex flex-row align-items-center justify-content-between'>
            <div className='d-flex flex-row input-container align-items-center'>
              <DropdownButton
                onSelect={(e) => openFilePicker(e)}
                as={ButtonGroup}
                key='up'
                id='dropdown-button-drop-up'
                drop='up'
                variant='primary'
                title={<i className='material-icons'>attachment</i>}
              >
                <Dropdown.Item eventKey='image'>Image</Dropdown.Item>
                <Dropdown.Item eventKey='video'>Video</Dropdown.Item>
                <Dropdown.Item eventKey='doc'>Document</Dropdown.Item>
                <Dropdown.Item eventKey='audio'>Audio</Dropdown.Item>
              </DropdownButton>
              <input
                type='file'
                ref={fileSelector}
                style={{ display: 'none' }}
                onChange={(e) => onFileUpload(fileSelector.current.files[0], fileType)}
              />
              <FormControl
                placeholder='Type a message'
                as='input'
                id='chat-input'
                aria-label='Input field for your message'
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <span className='upload-actions'>
                <i className='material-icons pr-2'>insert_emoticon</i>
                <Button variant='link' size='sm' className='camera-btn' onClick={handleShow}>
                  <i className='material-icons'>photo_camera</i>
                </Button>
              </span>
            </div>
            {!!message && (
              <Button className='rounded-btn mr-2' onClick={() => send()}>
                <i className='material-icons'>send</i>
              </Button>
            )}
            {!message && !recordingState.isRecording && (
              <Button className='rounded-btn mr-2' onClick={() => startRecording()}>
                <i className='material-icons'>mic_none</i>
              </Button>
            )}
            {!message && recordingState.isRecording && (
              <Button className='rounded-btn mr-2' onClick={() => stopRecording()}>
                <i className='material-icons'>close</i>
              </Button>
            )}
          </div>
        </Col>
      </Row>

      <Modal show={show} onHide={handleClose} centered size='xl' style={{ height: '100%' }}>
        <Webcam ref={cameraSelector} />
        <Button onClick={() => captureImage()}>Capture</Button>
      </Modal>
    </>
  );
};

ConversationInput.propTypes = {
  sendMessage: PropTypes.func.isRequired,
  onFileUpload: PropTypes.func.isRequired,
};

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
      }));

      setPosts(messages);
    });
  }

  const uploadFile = function (file, fileType) {
    uploadImage(file).then((res) => {
      console.log(res.filename);
      const { filename } = res;
      socket.emit('sendMessage', {
        sender_id: clientUserId,
        conversation_id: conversation.id,
        text: null,
        type: 'message',
        attachments_array: [{ url: filename, type: fileType, name: file.name }],
      });

      addMessage({
        message: {
          type: fileType,
          content: filename,
        },
        userIsAuthor: true,
        thumbnail: '',
        timestamp: Date.now().toString(),
      });
    });
  };

  const sendMessage = function (message) {
    if (socket)
      socket.emit('sendMessage', {
        sender_id: clientUserId,
        conversation_id: conversation.id,
        text: message,
        type: 'message',
        attachments_array: [],
      });

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
            />
            <ConversationInput
              sendMessage={(message) => sendMessage(message)}
              onFileUpload={(file, type) => uploadFile(file, type)}
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
