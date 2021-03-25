import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Media, Image, Button } from 'react-bootstrap';
import ReactPlayer from 'react-player';
import ReactAudioPlayer from 'react-audio-player';
import './Message.scss';

const Message = function ({
  id,
  username,
  thumbnail,
  message,
  userIsAuthor,
  timestamp,
  onReactionToMessage,
  reactions,
  userHasReacted,
}) {
  const MessageFooter = () => {
    const d = new Date(0);
    d.setUTCSeconds(timestamp);

    return (
      <div className='message-footer'>
        <span className='text-right'>{d.toLocaleString()}</span>
      </div>
    );
  };

  const ImageMessage = () => (
    <div className={`${userIsAuthor ? 'p-2 image-by-author' : 'p-1 image-by-user'}`}>
      <a href={message.content}>
        <Image className='image-message' src={message.content} />
      </a>
      <div className='mt-1'>
        <MessageFooter />
      </div>
    </div>
  );

  const TextMessage = function () {
    return userIsAuthor ? (
      <>
        <p className='message-by-author p-2 mb-1'>{message.content}</p>
        <MessageFooter />
      </>
    ) : (
      <>
        <p className='message-by-user mb-1'>{message.content}</p>
        <MessageFooter />
      </>
    );
  };

  const VideoMessage = function () {
    return (
      <div className={`${userIsAuthor ? 'p-2 video-by-author' : 'p-1 video-by-user'}`}>
        <ReactPlayer
          className='video-message'
          controls
          url={[{ src: message.content, type: 'video/mp4' }]}
          width='100%'
          height='100%'
        />
        <div className='mt-1'>
          <MessageFooter />
        </div>
      </div>
    );
  };

  const AudioMessage = function () {
    return (
      <div className={`${userIsAuthor ? 'p-2 audio-by-author' : 'p-1 audio-by-user'}`}>
        <ReactAudioPlayer className='audio-message' controls src={message.content} />
        <MessageFooter />
      </div>
    );
  };

  const DocumentMessage = function () {
    return (
      <div className={`${userIsAuthor ? 'doc-by-author' : 'doc-by-user'}`}>
        <div className='p-2 d-flex flex-row align-items-center'>
          <i className='material-icons'>insert_drive_file</i>
          <p className='ml-2' style={{ marginBottom: '0px' }}>
            {message.content.split('/').slice(-1)[0]}
          </p>
          <a
            href={message.content}
            style={{ color: '#000' }}
            className='ml-3 d-flex align-items-center'
          >
            <i className='material-icons'>download</i>
          </a>
        </div>
        <div className='pt-2 pr-2 pb-2'>
          <MessageFooter />
        </div>
      </div>
    );
  };

  const PostMessage = function () {
    return (
      <>
        <div
          className={`post-message ${userIsAuthor ? 'p-3 image-by-author' : 'p-2 image-by-user'}`}
        >
          <a href={`/posts/${id}`}>
            <h5 className='post-title'>{message.content.title}</h5>
            <p className='post-desc'>{message.content.desc}</p>
            <Image className='image-message' src={message.content.cover} />
          </a>
          <div className='post-footer d-flex flex-row align-items-center justify-content-between mt-1'>
            <span className='p-1'>
              <i
                className={`material-icons ${userHasReacted ? 'red' : 'grey'}`}
                role='button'
                tabIndex={0}
                onKeyPress={(e) => e.key === 13 && onReactionToMessage(id, userHasReacted)}
                onClick={() => onReactionToMessage(id, userHasReacted)}
              >
                {userHasReacted ? 'favorite' : 'favorite_border'}
              </i>{' '}
              {userHasReacted && reactions[0].count}
              {!userHasReacted && 0}
            </span>
            <span className='p-1'>
              <i className='material-icons chat-bubble'>chat_bubble_outline</i> 25
            </span>
            <span className='p-1'>
              <i className='material-icons share'>share</i>
            </span>
          </div>
          <div className='mt-3'>
            <MessageFooter />
          </div>
        </div>
      </>
    );
  };

  const TYPE_COMPONENT_MAPPING = {
    image: ImageMessage,
    text: TextMessage,
    video: VideoMessage,
    audio: AudioMessage,
    doc: DocumentMessage,
    post: PostMessage,
  };

  const messageComponent = TYPE_COMPONENT_MAPPING[message.type];

  return (
    <div className='mb-3 message' key={id}>
      {userIsAuthor && (
        <div className='d-flex flex-column align-items-end'>{messageComponent()}</div>
      )}

      {!userIsAuthor && (
        <Media as='div'>
          <Image src={thumbnail} width={30} className='align-self-start mr-3 mt-2' roundedCircle />
          <Media.Body>
            <Row>
              <Col>
                <div className='message-content pt-1 pb-1 pl-2 pr-2'>
                  <p className='username'>{username}</p>
                  {messageComponent()}
                </div>
              </Col>
            </Row>
          </Media.Body>
        </Media>
      )}
    </div>
  );
};

const reactions = PropTypes.shape({
  count: PropTypes.number.isRequired,
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
});

Message.propTypes = {
  id: PropTypes.number.isRequired,
  onReactionToMessage: PropTypes.func.isRequired,
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
  userHasReacted: PropTypes.bool.isRequired,
  timestamp: PropTypes.string.isRequired,
  reactions: PropTypes.arrayOf(reactions),
};

Message.defaultProps = {
  userIsAuthor: false,
  reactions: [],
};

export default Message;
