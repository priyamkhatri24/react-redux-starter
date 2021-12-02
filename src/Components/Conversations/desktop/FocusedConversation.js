import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Attachment from '@material-ui/icons/Attachment';
import Send from '@material-ui/icons/Send';

const FocusedConversation = function (props) {
  return (
    <Container className='d-flex flex-column justify-content-between p-3'>
      <Row>
        <Col>
          <h3>Focused Conversation</h3>
        </Col>
      </Row>
      <Row>
        {/* <Col xs={1}>
          <DropdownButton
            as={ButtonGroup}
            style={{ left: '-16px' }}
            key='up'
            id='dropdown-button-drop-up'
            drop='up'
            variant='primary'
            title={<Attachment />}
          >
            <Dropdown.Item eventKey='1'>Action</Dropdown.Item>
            <Dropdown.Item eventKey='2'>Another action</Dropdown.Item>
            <Dropdown.Item eventKey='3'>Something else here</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item eventKey='4'>Separated link</Dropdown.Item>
          </DropdownButton>
        </Col>
        <Col>
          <FormControl as='text' aria-label='With text' />
        </Col>
        <Col xs={1}>
          <Button style={{ left: '-18px', position: 'relative' }}>
            <Send />
          </Button>
        </Col> */}
      </Row>
    </Container>
  );
};

export default FocusedConversation;
