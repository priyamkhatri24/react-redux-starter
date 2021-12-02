import React from 'react';
import PropTypes from 'prop-types';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import Media from 'react-bootstrap/Media';
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';
import VoiceIcon from '@material-ui/icons/SettingsVoice';
import VideoCamIcon from '@material-ui/icons/Videocam';
import DocumentIcon from '@material-ui/icons/Description';
import Container from 'react-bootstrap/Container';
import Message from '../Message/Message';
import '../Conversation.scss';

const MobileConversationCard = function ({ name, subTitle, thumbnail, unreadCount, onClick }) {
  return (
    <Row noGutters>
      <Col xs={12}>
        <div className='mt-1 mb-1 mx-2'>
          <Media as='li' className='conversation-container p-2' onClick={onClick}>
            <Image
              src={thumbnail}
              width={40}
              height={40}
              className='align-self-center mr-3'
              roundedCircle
            />
            <Media.Body>
              <Container fluid>
                <Row style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Col xs={10}>
                    <b>{name}</b>
                    {subTitle?.text && subTitle?.text !== 'null' ? (
                      <p className='smallOnDesktop card-subtitle'>
                        {subTitle.text.slice(0, 33)}
                        {subTitle.text.length > 33 ? '...' : null}
                      </p>
                    ) : null}
                    {/* eslint-disable */}
                    {subTitle?.file_type === 'image' ? (
                      <p className='smallOnDesktop card-subtitle'>
                        <PhotoCameraIcon style={{ fontSize: '14px', marginBottom: '3px' }} /> Photo
                      </p>
                    ) : subTitle?.file_type === 'video' ? (
                      <p className='smallOnDesktop card-subtitle'>
                        <VideoCamIcon style={{ fontSize: '14px', marginBottom: '3px' }} /> Video
                      </p>
                    ) : subTitle?.file_type === 'audio' ? (
                      <p className='smallOnDesktop card-subtitle'>
                        <VoiceIcon style={{ fontSize: '14px', marginBottom: '3px' }} /> Audio
                      </p>
                    ) : subTitle?.file_type === 'doc' ||
                      subTitle?.file_type === 'file' ||
                      subTitle?.file_type === 'document' ? (
                      <p className='smallOnDesktop card-subtitle'>
                        <DocumentIcon style={{ fontSize: '14px', marginBottom: '3px' }} /> Document
                      </p>
                    ) : null}
                  </Col>
                  {unreadCount > 0 && (
                    <div className='my-auto'>
                      <span className='text-center unreadCountBubble'>{unreadCount}</span>
                    </div>
                  )}
                </Row>
              </Container>
            </Media.Body>
          </Media>
        </div>
      </Col>
    </Row>
  );
};

MobileConversationCard.propTypes = {
  name: PropTypes.string.isRequired,
  thumbnail: PropTypes.string.isRequired,
  subTitle: PropTypes.objectOf(Message).isRequired,
  unreadCount: PropTypes.number.isRequired,
  onClick: PropTypes.func,
};

MobileConversationCard.defaultProps = {
  onClick: () => {},
};

export default MobileConversationCard;
