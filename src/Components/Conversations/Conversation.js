import React, { useEffect, useState, useRef } from 'react';
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
          <Button className='rounded-btn mr-2' onClick={() => send()}>
            <i className='material-icons'>send</i>
          </Button>
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
  useEffect(() => {
    fetchMessages();
  }, []);

  const getMessageByType = function (data) {
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
    get(null, `/getChtOfConversation?conversation_id=${conversation.id}`).then((res) => {
      const apiData = apiValidation(res);
      const { message_array: messageArray, participants_count: participantsCount } = apiData;
      const messages = messageArray
        .map((data) => ({
          id: data.chat_id,
          message: getMessageByType(data),
          thumbnail: data.sent_by.display_picture || 'https://i.pravatar.cc/40',
          userIsAuthor: data.sent_by.client_user_id === clientUserId,
          timestamp: data.sent_time,
          username: `${data.sent_by.first_name} ${data.sent_by.last_name}`,
        }))
        .reverse();

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
        chat_text: null,
        type: 'message',
        attachments_array: [{ url: filename, type: fileType, name: file.name }],
      });

      const { messages } = conversation;

      messages.push({
        message: {
          type: fileType,
          content: filename,
        },
        userIsAuthor: true,
        thumbnail: '',
        timestamp: Date.now(),
      });

      setConversation({
        ...conversation,
        messages,
      });
    });
  };

  const sendMessage = function (message) {
    socket.emit('sendMessage', {
      sender_id: clientUserId,
      conversation_id: conversation.id,
      chat_text: message,
      type: 'message',
      attachments_array: [],
    });

    const { messages } = conversation;

    messages.push({
      message: {
        type: 'text',
        content: message,
      },
      userIsAuthor: true,
      thumbnail: '',
      timestamp: Date.now(),
    });

    setConversation({
      ...conversation,
      messages,
    });
  };

  return (
    <>
      <div className='fixed-top' style={{ zIndex: 2, backgroundColor: '#fff' }}>
        <ConversationHeader
          thumbnail={conversation.thumbnail}
          name={conversation.name}
          participantsCount={conversation.participantsCount}
        />
      </div>
      <Row>
        <Col md={12}>
          <Messages list={conversation.messages} />
          <ConversationInput
            sendMessage={(message) => sendMessage(message)}
            onFileUpload={(file, type) => uploadFile(file, type)}
          />
        </Col>
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
