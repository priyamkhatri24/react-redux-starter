import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Media, Image } from 'react-bootstrap';
import ReactPlayer from 'react-player';
import ReactAudioPlayer from 'react-audio-player';
import './Message.scss';

const ImageMessage = function ({ content, userIsAuthor }) {
  return (
    <div className={`${userIsAuthor ? 'p-2 image-by-author' : 'p-1 image-by-user'}`}>
      <Image className='image-message' src={content} />
    </div>
  );
};

ImageMessage.propTypes = {
  content: PropTypes.string.isRequired,
  userIsAuthor: PropTypes.bool.isRequired,
};

const TextMessage = function ({ content, userIsAuthor }) {
  return userIsAuthor ? (
    <p className='message-by-author p-2'>{content}</p>
  ) : (
    <p className='message-by-user'>{content}</p>
  );
};

TextMessage.propTypes = {
  content: PropTypes.string.isRequired,
  userIsAuthor: PropTypes.bool.isRequired,
};

const VideoMessage = function ({ content, userIsAuthor }) {
  return (
    <div className={`${userIsAuthor ? 'p-2 video-by-author' : 'p-1 video-by-user'}`}>
      <ReactPlayer
        className='video-message'
        controls
        url={[{ src: content, type: 'video/mp4' }]}
        width='100%'
        height='100%'
      />
    </div>
  );
};

VideoMessage.propTypes = {
  content: PropTypes.string.isRequired,
  userIsAuthor: PropTypes.bool.isRequired,
};

const AudioMessage = function ({ content, userIsAuthor }) {
  return (
    <div className={`${userIsAuthor ? 'p-2 audio-by-author' : 'p-1 audio-by-user'}`}>
      <ReactAudioPlayer className='audio-message' controls src={content} />
    </div>
  );
};

AudioMessage.propTypes = {
  content: PropTypes.string.isRequired,
  userIsAuthor: PropTypes.bool.isRequired,
};

const DocumentMessage = function ({ content, userIsAuthor }) {};

DocumentMessage.propTypes = {
  content: PropTypes.string.isRequired,
  userIsAuthor: PropTypes.bool.isRequired,
};

const PostMessage = function ({ content, userIsAuthor }) {
  return (
    <>
      <div className={`post-message ${userIsAuthor ? 'p-3 image-by-author' : 'p-2 image-by-user'}`}>
        <h5 className='post-title'>{content.title}</h5>
        <p className='post-desc'>{content.desc}</p>
        <Image className='image-message' src={content.cover} />
        <div className='post-footer d-flex flex-row align-items-center justify-content-between mt-1'>
          <span className='p-1'>
            <i className='material-icons favorite'>favorite</i> 25
          </span>
          <span className='p-1'>
            <i className='material-icons chat-bubble'>chat_bubble_outline</i> 25
          </span>
          <span className='p-1'>
            <i className='material-icons share'>share</i>
          </span>
        </div>
      </div>
    </>
  );
};

PostMessage.propTypes = {
  content: PropTypes.string.isRequired,
  userIsAuthor: PropTypes.bool.isRequired,
};

const TYPE_COMPONENT_MAPPING = {
  image: ImageMessage,
  text: TextMessage,
  video: VideoMessage,
  audio: AudioMessage,
  doc: DocumentMessage,
  post: PostMessage,
};

const Message = function ({ id, username, thumbnail, message, userIsAuthor, timestamp }) {
  const messageComponent = TYPE_COMPONENT_MAPPING[message.type];

  return (
    <div className='mb-2 message' key={id}>
      {userIsAuthor && (
        <div className='d-flex flex-column align-items-end'>
          {messageComponent({ content: message.content, userIsAuthor })}
        </div>
      )}

      {!userIsAuthor && (
        <Media as='div'>
          <Image src={thumbnail} width={30} className='align-self-start mr-3 mt-2' roundedCircle />
          <Media.Body>
            <Row>
              <Col>
                <div className='message-content pt-1 pb-1 pl-2 pr-2'>
                  <p className='username'>{username}</p>
                  {messageComponent({ content: message.content, userIsAuthor })}
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
  id: PropTypes.number.isRequired,
  username: PropTypes.string.isRequired,
  thumbnail: PropTypes.string.isRequired,
  message: PropTypes.objectOf({
    type: PropTypes.string.isRequired,
    content: PropTypes.oneOf([
      PropTypes.string.isRequired,
      PropTypes.objectOf({
        title: PropTypes.string.isRequired,
        desc: PropTypes.string.isRequired,
        cover: PropTypes.string.isRequired,
      }).isRequired,
    ]),
  }).isRequired,
  userIsAuthor: PropTypes.bool,
  timestamp: PropTypes.string.isRequired,
};

Message.defaultProps = {
  userIsAuthor: false,
};

export default Message;
