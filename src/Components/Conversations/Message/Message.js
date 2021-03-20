import React from 'react';
import { Row, Col, Media, Image } from 'react-bootstrap';
import PropTypes from 'prop-types';
import './Message.scss';

const Message = function ({ username, thumbnail, message, userIsAuthor, timestamp }) {
  return (
    <div className='mb-2 message'>
      {userIsAuthor && (
        <div className='d-flex flex-column align-items-end'>
          <p className='text-right p-2 message-by-author'>{message.content}</p>
          {/* <p className='timestamp'>{timestamp}</p> */}
        </div>
      )}

      {!userIsAuthor && (
        <Media as='div' className='p-2'>
          <Image src={thumbnail} width={30} className='align-self-start mr-3 mt-2' roundedCircle />
          <Media.Body>
            <Row>
              <Col>
                <div
                  className='message-content pt-2 pb-0 pl-2 pr-4'
                  style={{
                    display: 'inline-block',
                    boxShadow: '0px 5px 5px 0px rgba(50, 50, 50, 0.2)',
                    borderRadius: '5px',
                  }}
                >
                  <small>
                    <b>{username}</b>
                  </small>
                  <p className='message-by-user'>{message.content}</p>
                  {/* <p className='timestamp'>{timestamp}</p> */}
                </div>
              </Col>
            </Row>
          </Media.Body>
        </Media>
      )}
    </div>
  );
};

Message.propTypes = {
  username: PropTypes.string.isRequired,
  thumbnail: PropTypes.string.isRequired,
  message: PropTypes.objectOf({
    type: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
  }).isRequired,
  userIsAuthor: PropTypes.bool,
  timestamp: PropTypes.string.isRequired,
};

Message.defaultProps = {
  userIsAuthor: false,
};

export default Message;
