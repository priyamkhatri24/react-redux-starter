import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Row, Col, Media, Image, Spinner } from 'react-bootstrap';
import ReactPlayer from 'react-player';
import ReactAudioPlayer from 'react-audio-player';
import Draggable from 'react-draggable';

import './Message.scss';

class Message extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      wasDragged: false,
      showTime: false,
    };

    this.TYPE_COMPONENT_MAPPING = {
      image: () => this.ImageMessage(),
      text: () => this.TextMessage(),
      video: () => this.VideoMessage(),
      audio: () => this.AudioMessage(),
      doc: () => this.DocumentMessage(),
      post: () => this.PostMessage(),
    };
  }

  onStop(e, data) {
    console.log(data);
    if (data.lastX !== 0) {
      const { wasDragged } = this.state;
      const { id, message, userIsAuthor, username, onSlide } = this.props;
      if (wasDragged) {
        onSlide({ id, message, userIsAuthor, username });
        this.setState({ wasDragged: false });
      }
    } else {
      this.onStart(e, data);
    }
  }

  onStart(e, data) {
    console.log('starting');
    console.log(data);
    const { showTime } = this.state;
    const { id, message, history } = this.props;
    console.log(showTime);
    console.log(!showTime);
    this.setState({ showTime: !showTime });
    if (message.type === 'post') {
      history.push(`/posts/${id}`);
    }
  }

  MessageFooter() {
    const { timestamp, isLoading } = this.props;
    const { showTime } = this.state;

    const d = new Date(0);
    d.setUTCSeconds(timestamp);

    return (
      <div className='message-footer'>
        {showTime && <span className='text-right mr-2'>{d.toLocaleString()}</span>}
        {isLoading && <Spinner animation='border' variant='primary' size='sm' />}
      </div>
    );
  }

  ImageMessage() {
    const { message, userIsAuthor } = this.props;
    return (
      <div className={`drag-handler ${userIsAuthor ? 'p-2 image-by-author' : 'p-1 image-by-user'}`}>
        <a href={message.content}>
          <Image className='image-message' src={message.content} />
        </a>
        <div className='mt-1'>{this.MessageFooter()}</div>
      </div>
    );
  }

  TextMessage() {
    const { message, userIsAuthor } = this.props;
    return userIsAuthor ? (
      <div className='drag-handler message-by-author p-2 mb-1'>
        <p className='mb-0'>{message.content}</p>
        {this.MessageFooter()}
      </div>
    ) : (
      <div className='drag-handler message-by-user mb-1'>
        <p className='mb-0'>{message.content}</p>
        {this.MessageFooter()}
      </div>
    );
  }

  VideoMessage() {
    const { message, userIsAuthor } = this.props;
    return (
      <div className={`drag-handler ${userIsAuthor ? 'p-2 video-by-author' : 'p-1 video-by-user'}`}>
        <ReactPlayer
          className='video-message'
          controls
          url={[{ src: message.content, type: 'video/mp4' }]}
          width='auto'
          height='150px'
        />
        <div className='mt-1'>{this.MessageFooter()}</div>
      </div>
    );
  }

  AudioMessage() {
    const { message, userIsAuthor } = this.props;
    return (
      <div className={`drag-handler ${userIsAuthor ? 'p-2 audio-by-author' : 'p-1 audio-by-user'}`}>
        <ReactAudioPlayer className='audio-message' controls src={message.content} />
        {this.MessageFooter()}
      </div>
    );
  }

  DocumentMessage() {
    const { message, userIsAuthor } = this.props;
    return (
      <div className={`drag-handler ${userIsAuthor ? 'doc-by-author' : 'doc-by-user'}`}>
        <div className='p-2 d-flex flex-row align-items-center'>
          <i className='material-icons'>insert_drive_file</i>
          <p className='ml-2' style={{ marginBottom: '0px' }}>
            {message.name}
          </p>
          <a
            href={message.content}
            style={{ color: '#000' }}
            className='ml-3 d-flex align-items-center'
          >
            <i className='material-icons'>download</i>
          </a>
        </div>
        <div className='pt-2 pr-2 pb-2'>{this.MessageFooter()}</div>
      </div>
    );
  }

  PostMessage() {
    const {
      id,
      message,
      userIsAuthor,
      userHasReacted,
      comments,
      reactions,
      onReactionToMessage,
    } = this.props;
    return (
      <>
        <div className={`drag-handler ${userIsAuthor ? 'p-3 ' : 'p-2 '} post-message `}>
          <h5 className='post-title'>{message.content.title}</h5>
          <p className='post-desc'>{message.content.desc}</p>
          <div className='d-flex justify-content-center'>
            <Image className='image-message' src={message.content.cover} />
          </div>
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
              <i className='material-icons chat-bubble'>chat_bubble_outline</i> {comments.length}
            </span>
            <span className='p-1'>
              <i className='material-icons share'>share</i>
            </span>
          </div>
          <div className='mt-3'>{this.MessageFooter()}</div>
        </div>
      </>
    );
  }

  render() {
    const { id, message, userIsAuthor, thumbnail, username } = this.props;

    const messageComponent = this.TYPE_COMPONENT_MAPPING[message.type]();

    return (
      <div className='mb-3'>
        <Draggable
          axis='x'
          handle='.drag-handler'
          defaultPosition={{ x: 0, y: 0 }}
          position={{ x: 0, y: 0 }}
          grid={[25, 25]}
          scale={1}
          onStop={(e, data) => this.onStop(e, data)}
          onDrag={() => this.setState({ wasDragged: true })}
        >
          <div className='message handle' key={id}>
            {userIsAuthor && (
              <div className='d-flex flex-column align-items-end'>{messageComponent}</div>
            )}
            {!userIsAuthor && (
              <Media as='div'>
                <Image
                  src={thumbnail}
                  width={30}
                  className='align-self-start mr-3 mt-2'
                  roundedCircle
                />
                <Media.Body>
                  <Row>
                    <Col>
                      <div className='message-content pt-1 pb-1 pl-2 pr-2'>
                        <p className='username'>{username}</p>
                        {messageComponent}
                      </div>
                    </Col>
                  </Row>
                </Media.Body>
              </Media>
            )}
          </div>
        </Draggable>
      </div>
    );
  }
}

const reactions = PropTypes.shape({
  count: PropTypes.number.isRequired,
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
});

const comments = PropTypes.shape({
  text: PropTypes.string.isRequired,
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
  comments: PropTypes.arrayOf(comments),
  isLoading: PropTypes.bool,
  onSlide: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

Message.defaultProps = {
  userIsAuthor: false,
  reactions: [],
  comments: [],
  isLoading: false,
};

export default withRouter(Message);
