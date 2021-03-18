import React from 'react';
import { Container, Row, Col, Media, Image } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import './Message.scss';

const Message = function () {
  const history = useHistory();

  return (
    <Row className='mb-2'>
      <Col>
        <Media as='div' className='p-2'>
          <Image
            src='https://i.pravatar.cc/30'
            width={30}
            className='align-self-center mr-3'
            roundedCircle
          />
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
                  <b>Jane Doe</b>
                  <p className='card-subtitle'>Hello</p>
                </div>
              </Col>
            </Row>
          </Media.Body>
        </Media>
      </Col>
    </Row>
  );
};

export default Message;
