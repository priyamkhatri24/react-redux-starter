import React from 'react';
import {
  Container,
  Row,
  Col,
  FormControl,
  Button,
  DropdownButton,
  Dropdown,
  ButtonGroup,
} from 'react-bootstrap';
import Messages from '../Messages';
import './FocusedConversation.scss';

const ConversationInput = function () {
  return (
    <Row>
      <Col xs={12}>
        <div className='d-flex flex-row input-container align-items-center mb-1'>
          <DropdownButton
            as={ButtonGroup}
            key='up'
            id='dropdown-button-drop-up'
            drop='up'
            variant='primary'
            title={<i className='material-icons'>attachment</i>}
          >
            <Dropdown.Item eventKey='1'>Action</Dropdown.Item>
            <Dropdown.Item eventKey='2'>Another action</Dropdown.Item>
            <Dropdown.Item eventKey='3'>Something else here</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item eventKey='4'>Separated link</Dropdown.Item>
          </DropdownButton>
          <FormControl as='textarea' aria-label='With textarea' />
          <Button className='rounded-btn'>
            <i className='material-icons'>send</i>
          </Button>
        </div>
      </Col>
    </Row>
  );
};

const FocusedConversation = function () {
  return (
    <Container className='d-flex flex-column justify-content-between conversations-container'>
      <Messages />
      <ConversationInput />
    </Container>
  );
};

export default FocusedConversation;
