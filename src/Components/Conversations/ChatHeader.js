import React from 'react';
import PropTypes from 'prop-types';
import { Container, Row, Col, Card, Image, Media, Badge } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';

const ChatHeader = function () {
  const history = useHistory();

  return (
    <Row noGutters>
      <Col xs={12}>
        <div
          className='p-2 d-flex align-items-center justify-content-between'
          style={{ boxShadow: '0px 5px 5px 0px rgba(50, 50, 50, 0.2)' }}
        >
          <div className='d-flex align-items-center'>
            <i
              className='material-icons mr-3'
              role='button'
              tabIndex={0}
              onClick={() => history.goBack()}
              onKeyDown={() => history.goBack()}
            >
              arrow_back
            </i>
            <h5 className='heading pt-2'>Chats</h5>
          </div>
          <i className='material-icons justify-self-end'>more_vert</i>
        </div>
      </Col>
    </Row>
  );
};

export default ChatHeader;
