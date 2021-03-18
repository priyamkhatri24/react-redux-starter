import React from 'react';
import { Container, Row, Col, Media, Image } from 'react-bootstrap';
import PropTypes from 'prop-types';
import './Message.scss';

const Message = function ({ username, thumbnail, message, userIsAuthor }) {
  return (
    <div className='mb-2'>
      {userIsAuthor && (
        <div className='d-flex justify-content-end'>
          <p className='text-right p-3 message-by-user'>{message.content}</p>
        </div>
      )}

      {!userIsAuthor && (
        <Media as='div' className='p-2'>
          <Image src={thumbnail} width={30} className='align-self-center mr-3' roundedCircle />
          <Media.Body>
            <Row>
              <Col>
                <div
                  className='message-content pt-2 pb-2 pl-2 pr-4'
                  style={{
                    display: 'inline-block',
                    boxShadow: '0px 5px 5px 0px rgba(50, 50, 50, 0.2)',
                    borderRadius: '5px',
                  }}
                >
                  <b>{username}</b>
                  <p className='card-subtitle'>{message.content}</p>
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
};

Message.defaultProps = {
  userIsAuthor: false,
};

export default Message;
