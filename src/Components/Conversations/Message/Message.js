import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Row, Col, Media, Image, Spinner, Button, Form } from 'react-bootstrap';
import ReactPlayer from 'react-player';
import './Message.scss';

const SLIDE_WIDTH = 50;
const SLIDE_THRESHOLD = 20;

class Message extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      wasDragged: false,
      showTime: false,
      duration: 0,
      isAudioPlaying: false,
      seekValue: 0,
      xDiff: 0,
      yDiff: 0,
    };

    this.TYPE_COMPONENT_MAPPING = {
      image: () => this.ImageMessage(),
      text: () => this.TextMessage(),
      video: () => this.VideoMessage(),
      audio: () => this.AudioMessage(),
      doc: () => this.DocumentMessage(),
      post: () => this.PostMessage(),
    };

    this.audio = null;
    this.timePoller = null;
    this.audioContext = null;
    this.myRef = React.createRef();
    this.slider = React.createRef();
    this.container = React.createRef();
  }

  componentDidMount() {
    const { message } = this.props;
    this.audio = new Audio(message.content);
    this.audio.addEventListener('loadedmetadata', this.audioMetadatalistener);
    this.audioContext = new AudioContext();
    this.unmounted = false;
    document.addEventListener('touchmove', this.onDrag);
    document.addEventListener('touchend', this.stopDrag);
    this.containerWidth = this.container.current.clientWidth - SLIDE_WIDTH;
  }

  componentWillUnmount() {
    this.audio.removeEventListener('loadedmetadata', this.audioMetadatalistener);
    this.audio.addEventListener('onended', this.onAudioEnd);
    this.unmounted = true;
  }

  onAudioEnd = () => {
    this.setState({ isAudioPlaying: false, seekValue: 0 });
    clearInterval(this.timePoller);
    this.audio.currentTime = 0;
  };

  onStop(e, data) {
    const { wasDragged, showTime, prevCoords, xDiff, yDiff } = this.state;
    const { id, message, userIsAuthor, username, onSlide, updateScroll } = this.props;
    console.log(xDiff > yDiff);
    console.log(xDiff, yDiff);
    e.preventDefault();

    if (wasDragged && xDiff > yDiff) {
      onSlide({ id, message, userIsAuthor, username });
      this.setState({ wasDragged: false, showTime: false });
    } else {
      this.setState({ showTime: !showTime });
    }
  }

  reset = () => {
    if (this.unmounted) return;
    this.setState({ unlocked: false }, () => {
      this.sliderLeft = 0;
      this.updateSliderStyle();
    });
  };

  onSuccess = () => {
    this.container.current.style.width = `${this.container.current.clientWidth}px`;
    this.setState({
      unlocked: true,
    });
  };

  stopDrag = () => {
    const { unlocked, showTime } = this.state;
    const { id, message, userIsAuthor, username, onSlide, updateScroll } = this.props;
    console.log('on stop drag', this.unmounted, unlocked);
    if (this.unmounted || unlocked) return;
    if (this.isDragging) {
      this.isDragging = false;
      if (this.sliderLeft > this.containerWidth * 0.15) {
        this.sliderLeft = this.containerWidth;

        this.sliderLeft = 0;
        onSlide({ id, message, userIsAuthor, username });
        this.setState({ wasDragged: false, showTime: false });
      } else {
        this.sliderLeft = 0;

        this.setState({ showTime: !showTime });
        console.log('Failure');
      }
      this.updateSliderStyle();
    }
  };

  updateSliderStyle = () => {
    const { unlocked } = this.state;
    if (this.unmounted || unlocked) return;
    this.slider.current.style.left = `${this.sliderLeft}px`;
  };

  onDrag = (e) => {
    const { unlocked, showTime } = this.state;
    if (this.unmounted || unlocked) return;
    if (this.isDragging) {
      this.sliderLeft = Math.min(
        Math.max(0, e.touches[0].clientX - this.startX),
        this.containerWidth,
      );

      console.log('Is dragging', this.sliderLeft);

      if (this.sliderLeft > SLIDE_THRESHOLD) {
        this.updateSliderStyle();
      }
    }
  };

  startDrag = (e) => {
    const { unlocked } = this.state;
    if (this.unmounted || unlocked) return;
    this.isDragging = true;
    console.log(e, 'onstartdrag');
    this.startX = e.touches[0].clientX;
  };

  audioMetadatalistener = (e) => {
    this.setState({ duration: Math.floor(e.target.duration) });
    console.log(e.target.duration);
  };

  startPollingForTime = () => {
    this.timePoller = setInterval(() => {
      console.log('polling');
      const { currentTime, duration } = this.audio;
      if (currentTime >= duration) {
        this.onAudioEnd();
      } else {
        this.setState({ seekValue: currentTime });
        console.log(currentTime);
      }
    }, 500);
  };

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
    const { seekValue, isAudioPlaying, duration } = this.state;

    return (
      <div
        className={`drag-handler d-flex audio-message ${
          userIsAuthor ? 'p-2 audio-by-author' : 'p-1 audio-by-user'
        }`}
      >
        {isAudioPlaying && (
          <Button
            className='p-0 link-btn'
            variant='link'
            onClick={(e) => {
              e.stopPropagation();
              console.log('rap');
            }}
            onTouchStart={(e) => {
              e.stopPropagation();
              console.log('rap');
              this.setState({ isAudioPlaying: false, seekValue: 0 });
              clearInterval(this.timePoller);
              this.audio.pause();
              this.audio.currentTime = 0;
            }}
          >
            <i className='material-icons' style={{ fontSize: '30px' }}>
              stop
            </i>
          </Button>
        )}

        {!isAudioPlaying && (
          <Button
            className='p-0 link-btn'
            variant='link'
            onClick={(e) => {
              e.stopPropagation();
              console.log('rap');
            }}
            onTouchStart={(e) => {
              e.stopPropagation();
              console.log('rap');
              this.audioContext.resume().then(() => {
                console.log('Playback resumed successfully');
                this.audio.play();
                this.startPollingForTime();
                this.setState({ isAudioPlaying: true });
              });
            }}
          >
            <i className='material-icons' style={{ fontSize: '30px' }}>
              play_arrow
            </i>
          </Button>
        )}
        <div className='d-flex flex-column align-items-start justify-content-center mt-3'>
          <input
            className='input-range'
            type='range'
            onChange={(e) => {
              console.log('e', e);
              e.stopPropagation();
              console.log('on range change triggered');

              this.setState({ seekValue: e.target.value });
              this.audio.currentTime = e.target.value;
            }}
            onMouseDown={(e) => {
              e.stopPropagation();
              console.log('onmousedown');
            }}
            onTouchStart={(e) => {
              console.log(e.target.value);
            }}
            onTouchStartCapture={(e) => {
              e.stopPropagation();
              console.log('captured touch start ', e);
            }}
            onTouchEndCapture={(e) => console.log('captured touch end ', e)}
            value={seekValue}
            max={duration}
            min={0}
          />
          <span
            className='mt-2'
            style={{ color: '#0000008A', fontSize: '10px', fontFamily: 'Montserrat-Regular' }}
          >
            {(duration / 60).toFixed(2)}
          </span>
        </div>
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
      commentsInfo,
      reactions,
      onReactionToMessage,
      history,
    } = this.props;
    return (
      <>
        <div className={`drag-handler ${userIsAuthor ? 'p-3 ' : 'p-2 '} post-message `}>
          <div
            role='button'
            tabIndex={0}
            onClick={(e) => {
              history.push(`/posts/${id}`);
            }}
            onKeyPress={(e) => e.key === 13 && onReactionToMessage(id, userHasReacted)}
          >
            <h5 className='post-title'>{message.content.title}</h5>
            <p className='post-desc'>{message.content.desc}</p>

            <div className='d-flex justify-content-center'>
              <Image className='image-message' src={message.content.cover} />
            </div>
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
              <i className='material-icons chat-bubble'>chat_bubble_outline</i>{' '}
              {commentsInfo.commentsCount}
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
    const { id, message, userIsAuthor, thumbnail, username, replyTo } = this.props;

    const messageComponent = this.TYPE_COMPONENT_MAPPING[message.type]();

    return (
      <div className='mb-3' id={id}>
        <div className='message handle' key={id} ref={this.container}>
          {userIsAuthor && (
            <div className='d-flex flex-column align-items-end'>
              <div className='dragger' ref={this.slider} onTouchStart={this.startDrag}>
                {replyTo && replyTo.id && (
                  <div className='reply pl-2 pr-2 pt-1 pb-1'>{replyTo.message.content}</div>
                )}
                {messageComponent}
              </div>
            </div>
          )}
          {!userIsAuthor && (
            <Media
              as='div'
              className='dragger-media'
              ref={this.slider}
              onTouchStart={this.startDrag}
            >
              <Image
                src={thumbnail}
                width={30}
                className='align-self-start mr-3 mt-2'
                roundedCircle
              />
              <Media.Body>
                <Row>
                  <Col>
                    {replyTo.id && (
                      <a href={`/conversation#${replyTo.id}`}>
                        <div className='reply pl-2 pr-2 pt-1 pb-1'>{replyTo.message.content}</div>
                      </a>
                    )}
                  </Col>
                </Row>
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

const commentsInfo = PropTypes.shape({
  featuredComment: PropTypes.string.isRequired,
  commentsCount: PropTypes.number.isRequired,
});

Message.propTypes = {
  id: PropTypes.number.isRequired,
  onReactionToMessage: PropTypes.func.isRequired,
  username: PropTypes.string,
  thumbnail: PropTypes.string.isRequired,
  message: PropTypes.shape({
    name: PropTypes.string,
    type: PropTypes.string.isRequired,
    content: PropTypes.oneOf([
      PropTypes.string.isRequired,
      PropTypes.shape({
        title: PropTypes.string.isRequired,
        desc: PropTypes.string.isRequired,
        cover: PropTypes.string.isRequired,
      }).isRequired,
    ]),
  }).isRequired,
  replyTo: PropTypes.shape({
    id: PropTypes.number,
    username: PropTypes.string,
    message: PropTypes.shape({
      type: PropTypes.string,
      content: PropTypes.oneOf([
        PropTypes.string,
        PropTypes.shape({
          title: PropTypes.string,
          desc: PropTypes.string,
          cover: PropTypes.string,
        }),
      ]),
    }),
  }),
  userIsAuthor: PropTypes.bool,
  userHasReacted: PropTypes.bool,
  timestamp: PropTypes.string.isRequired,
  reactions: PropTypes.arrayOf(reactions),
  commentsInfo: PropTypes.shape(commentsInfo),
  isLoading: PropTypes.bool,
  onSlide: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  updateScroll: PropTypes.func.isRequired,
};

Message.defaultProps = {
  username: '',
  userHasReacted: false,
  userIsAuthor: false,
  reactions: [],
  commentsInfo: {},
  isLoading: false,
  replyTo: {},
};

export default withRouter(Message);
