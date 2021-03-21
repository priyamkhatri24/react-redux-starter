import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';

const ConversationsHeader = function () {
  const history = useHistory();

  return (
    <Row noGutters>
      <Col xs={12}>
        <div
          className='p-2 d-flex align-items-center justify-content-between'
          style={{ boxShadow: '0px 2px 2px 0px #00000029' }}
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

export default ConversationsHeader;
