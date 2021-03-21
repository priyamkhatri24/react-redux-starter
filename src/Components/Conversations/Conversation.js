import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import io from 'socket.io-client';

import {
  Row,
  Col,
  FormControl,
  Button,
  DropdownButton,
  Dropdown,
  ButtonGroup,
} from 'react-bootstrap';
import { get, apiValidation } from '../../Utilities';
import { conversationsActions } from '../../redux/actions/conversations.action';
import { getConversation } from '../../redux/reducers/conversations.reducer';
import { getClientUserId } from '../../redux/reducers/clientUserId.reducer';
import ConversationHeader from './ConversationHeader';
import Messages from './Messages/Messages';
import Message from './Message/Message';
import './Conversation.scss';

const ConversationInput = function ({ sendMessage }) {
  const [message, setMessage] = useState('');

  const send = function () {
    sendMessage(message);
    setMessage('');
  };

  return (
    <Row className='fixed-bottom pb-2' style={{ backgroundColor: '#fff', zIndex: 2 }}>
      <Col xs={12}>
        <div className='d-flex flex-row input-container align-items-center'>
          <DropdownButton
            as={ButtonGroup}
            key='up'
            id='dropdown-button-drop-up'
            drop='up'
            variant='primary'
            title={<i className='material-icons'>attachment</i>}
          >
            <Dropdown.Item eventKey='1'>Image</Dropdown.Item>
            <Dropdown.Item eventKey='2'>Video</Dropdown.Item>
            <Dropdown.Item eventKey='3'>Document</Dropdown.Item>
            <Dropdown.Item eventKey='4'>Audio</Dropdown.Item>
          </DropdownButton>
          <FormControl
            placeholder='Type a message'
            as='input'
            id='chat-input'
            aria-label='Input field for your message'
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button className='rounded-btn' onClick={() => send()}>
            <i className='material-icons'>send</i>
          </Button>
        </div>
      </Col>
    </Row>
  );
};

ConversationInput.propTypes = {
  sendMessage: PropTypes.func.isRequired,
};

const SERVER = 'http://13.126.247.152:3000';

const Conversation = function ({ conversation, setConversation, clientUserId }) {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    fetchMessages();
    const socketInstance = io(SERVER, { transports: ['websocket'] });
    socketInstance.on('connect', () => {
      console.log(socketInstance.id, 'connect');
    });

    socketInstance.on('disconnect', () => {
      console.log(socketInstance.id, 'disconnected');
    });

    setSocket(socketInstance);
  }, []);

  const fetchMessages = function () {
    get(null, `/getChtOfConversation?conversation_id=${conversation.id}`).then((res) => {
      const apiData = apiValidation(res);
      const { message_array: messageArray, participants_count: participantsCount } = apiData;
      const messages = messageArray
        .map((data) => ({
          id: data.chat_id,
          message: {
            type: 'text',
            content: data.text,
          },
          thumbnail: data.sent_by.display_picture || 'https://i.pravatar.cc/40',
          userIsAuthor: data.sent_by.client_user_id === clientUserId,
          timestamp: data.sent_time,
          username: `${data.sent_by.first_name} ${data.sent_by.last_name}`,
        }))
        .reverse();

      messages.push({
        id: 123123,
        message: {
          type: 'post',
          content: {
            title: 'The favourite dog',
            desc: `Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut 
            labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea`,
            cover: 'https://s3.ap-south-1.amazonaws.com/ingenium-question-images/1616312003018.png',
          },
        },
        thumbnail: 'https://i.pravatar.cc/40',
        username: 'asd',
        timestamp: '',
        userIsAuthor: false,
      });

      setConversation({
        id: conversation.id,
        participantsCount,
        name: conversation.name,
        thumbnail: conversation.thumbnail,
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
          <ConversationInput sendMessage={(message) => sendMessage(message)} />
        </Col>
      </Row>
    </>
  );
};

const mapStateToProps = (state) => ({
  conversation: getConversation(state),
  clientUserId: getClientUserId(state),
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
  conversation: PropTypes.objectOf({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    thumbnail: PropTypes.string.isRequired,
    participantsCount: PropTypes.number,
    messages: PropTypes.arrayOf(PropTypes.objectOf(Message).isRequired).isRequired,
  }).isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Conversation);
