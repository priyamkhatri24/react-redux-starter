import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import ArrowBack from '@material-ui/icons/ArrowBack';
import MoreVert from '@material-ui/icons/MoreVert';
import PropTypes from 'prop-types';

const ConversationsHeader = function ({ title }) {
  const history = useHistory();

  return (
    <Row noGutters>
      <Col xs={12}>
        <div
          className='p-2 d-flex align-items-center justify-content-between'
          style={{ boxShadow: '0px 2px 2px 0px #00000029' }}
        >
          <div className='d-flex align-items-center'>
            <ArrowBack
              className='mr-3'
              role='button'
              tabIndex={0}
              onClick={() => history.goBack()}
              onKeyDown={() => history.goBack()}
            />
            <h5 className='heading pt-2'>{title}</h5>
          </div>
          <MoreVert className='justify-self-end' />
        </div>
      </Col>
    </Row>
  );
};

ConversationsHeader.propTypes = {
  title: PropTypes.string,
};

ConversationsHeader.defaultProps = {
  title: 'Chats',
};

export default ConversationsHeader;
