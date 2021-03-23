import React, { useEffect, useState, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Row,
  Col,
  FormControl,
  Button,
  DropdownButton,
  Dropdown,
  ButtonGroup,
} from 'react-bootstrap';
import { get, apiValidation, uploadImage } from '../../Utilities';
import { conversationsActions } from '../../redux/actions/conversations.action';
import { getConversation, getSocket } from '../../redux/reducers/conversations.reducer';
import { getClientUserId } from '../../redux/reducers/clientUserId.reducer';
import ConversationHeader from './ConversationHeader';
import Messages from './Messages/Messages';
import Message from './Message/Message';
import './Conversation.scss';

const ConversationInput = function ({ sendMessage, onFileUpload }) {
  const [message, setMessage] = useState('');
  const [fileType, setFileType] = useState('');
  const fileSelector = useRef();

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

  const sendVoice = function () {};

  return (
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
              <i className='material-icons'>photo_camera</i>
            </span>
          </div>
          {!!message && (
            <Button className='rounded-btn mr-2' onClick={() => send()}>
              <i className='material-icons'>send</i>
            </Button>
          )}
          {!message && (
            <Button className='rounded-btn mr-2' onClick={() => sendVoice()}>
              <i className='material-icons'>mic_none</i>
            </Button>
          )}
        </div>
      </Col>
    </Row>
  );
};

ConversationInput.propTypes = {
  sendMessage: PropTypes.func.isRequired,
  onFileUpload: PropTypes.func.isRequired,
};

const Conversation = function ({ conversation, setConversation, clientUserId, socket }) {
  const history = useHistory();
  const [activeTab, setActiveTab] = useState('chats');

  useEffect(() => {
    fetchMessages();

    return () => (socket ? socket.off('receiveMessage', onReceiveMessage) : null);
  }, []);

  useEffect(() => {
    if (socket) socket.on('receiveMessage', onReceiveMessage);
  }, [conversation]);

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
    //     attachments_array: []
    // chat_text: "Mellow"
    // conversation_id: 2
    // sender_id: 1801
    // type: "message"

    addMessage({
      id: Math.random(),
      message: {
        type: 'text',
        content: data.text,
      },
      thumbnail: 'https://i.pravatar.cc/40',
      userIsAuthor: false,
      timestamp: '',
      username: `New User`,
    });
    // addMessage({
    //   id: data.chat_id,
    //   message: getMessageByType(data),
    //   thumbnail: data.sent_by.display_picture || 'https://i.pravatar.cc/40',
    //   userIsAuthor: data.sent_by.client_user_id === clientUserId,
    //   timestamp: data.sent_time,
    //   username: `${data.sent_by.first_name} ${data.sent_by.last_name}`,
    // });
  };

  const getMessageByType = function (data) {
    if (data.attachments_array.length > 0) {
      return {
        type: data.attachments_array[0].file_type,
        content: data.attachments_array[0].file_url,
      };
    }

    if (data.type === 'post') {
      return {
        type: 'post',
        content: {
          title: data.title,
          desc: data.text,
        },
      };
    }

    return {
      type: 'text',
      content: data.text,
    };
  };

  const fetchMessages = function () {
    get(null, `/getChtOfConversation?conversation_id=${conversation.id}`).then((res) => {
      const apiData = apiValidation(res);
      const { message_array: messageArray, participants_count: participantsCount } = apiData;
      const messages = messageArray.map((data) => ({
        id: data.chat_id,
        message: getMessageByType(data),
        thumbnail: data.sent_by.display_picture || 'https://i.pravatar.cc/40',
        userIsAuthor: data.sent_by.client_user_id === clientUserId,
        timestamp: data.sent_time,
        username: `${data.sent_by.first_name} ${data.sent_by.last_name}`,
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

  return (
    <>
      <div className='fixed-top' style={{ zIndex: 2, backgroundColor: '#fff' }}>
        <ConversationHeader
          thumbnail={conversation.thumbnail}
          name={conversation.name}
          participantsCount={conversation.participantsCount}
          activeTab={activeTab}
          onTabSelected={(tab) => setActiveTab(tab)}
        />
      </div>
      <Row>
        {activeTab === 'chats' && (
          <Col md={12}>
            <Messages list={conversation.messages} />
            <ConversationInput
              sendMessage={(message) => sendMessage(message)}
              onFileUpload={(file, type) => uploadFile(file, type)}
            />
          </Col>
        )}
        {activeTab === 'discussions' && (
          <Col md={12} style={{ marginTop: '150px' }}>
            <div className='p-2 discussions-container'>
              <p className='text-center' style={{ fontSize: '12px', width: '100%' }}>
                You do not have any discussions yet!
              </p>
              <div className='p-2 fixed-bottom'>
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
});

const mapDispatchToProps = (dispatch) => {
  return {
    setConversation: (conversation) => {
      dispatch(conversationsActions.setConversation(conversation));
    },
  };
};

Conversation.propTypes = {
  setConversation: PropTypes.func.isRequired,
  clientUserId: PropTypes.number.isRequired,
  socket: PropTypes.objectOf(PropTypes.any).isRequired,
  conversation: PropTypes.objectOf({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    thumbnail: PropTypes.string.isRequired,
    participantsCount: PropTypes.number,
    messages: PropTypes.arrayOf(PropTypes.objectOf(Message).isRequired).isRequired,
  }).isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Conversation);
