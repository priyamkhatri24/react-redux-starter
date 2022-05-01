import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Media from 'react-bootstrap/Media';
import Alert from 'react-bootstrap/Alert';
import Image from 'react-bootstrap/Image';
import Spinner from 'react-bootstrap/Spinner';
import GetAppIcon from '@material-ui/icons/GetApp';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import ReactPlayer from 'react-player';
import AudioPlayer from 'react-h5-audio-player';

// stop
// play_arrow
// downlaod
// chat_bubble_outline
import Stop from '@material-ui/icons/Stop';
import Share from '@material-ui/icons/Share';
import PlayArrow from '@material-ui/icons/PlayArrow';
// import { FontDownloadOutlined as Download } from '@material-ui/icons/FontDownloadOutlined';
import ChatBubbleOutline from '@material-ui/icons/ChatBubbleOutline';
import DeleteIcon from '@material-ui/icons/Delete';
import ReplyIcon from '@material-ui/icons/Reply';
import CancelIcon from '@material-ui/icons/Cancel';
import ContentCopyIcon from '@material-ui/icons/FileCopy';
import Modal from 'react-bootstrap/Modal';
import Favorite from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';
import { shareThis } from '../../../Utilities/utilities';
import FileIcon from '../../../assets/images/file.svg';
import 'react-h5-audio-player/lib/styles.css';
import { getCurrentBranding } from '../../../redux/reducers/branding.reducer';
import './Message.scss';

const SLIDE_WIDTH = 50;
const SLIDE_THRESHOLD = 20;
const formatTypeArray = ['.png', '.jpg', '.jpeg'];

class Message extends Component {
  /* eslint-disable */
  state = {
    wasDragged: false,
    showTime: false,
    duration: 0,
    isAudioPlaying: false,
    seekValue: 0,
    xDiff: 0,
    yDiff: 0,
    timePoller: null,
    openImageModal: false,
    message: {},
    showMessageDropdown: false,
  };

  defaultOptions = {
    shouldPreventDefault: true,
    delay: 500,
  };

  audio = null;

  // timePoller = null;

  audioContext = null;

  myRef = React.createRef();

  slider = React.createRef();

  container = React.createRef();

  TYPE_COMPONENT_MAPPING = {
    image: () => this.ImageMessage(),
    gallery: () => this.ImageMessage(),
    text: () => this.TextMessage(),
    video: () => this.VideoMessage(),
    audio: () => this.AudioMessage(),
    doc: () => this.DocumentMessage(),
    file: () => this.DocumentMessage(),
    document: () => this.DocumentMessage(),
    post: () => this.PostMessage(),
    begining: () => this.TextMessage(),
  };

  componentDidMount() {
    const { message } = this.props;
    if (!message.type) return;
    this.audio = new Audio(message.content);
    this.audio.addEventListener('loadedmetadata', this.audioMetadatalistener);
    this.audioContext = new AudioContext();
    this.unmounted = false;
    document.addEventListener('touchmove', this.onDrag);
    document.addEventListener('touchend', this.stopDrag);
    this.containerWidth = this.container.current.clientWidth - SLIDE_WIDTH;
    window.addEventListener('hashchange', () => {
      console.log(window.location.hash);
      if (window.location.hash !== '#modal') {
        this.setState({ openImageModal: false });
      }
    });
  }

  componentWillUnmount() {
    if (!this.audio) return;
    this.audio.removeEventListener('loadedmetadata', this.audioMetadatalistener);
    this.audio.addEventListener('onended', this.onAudioEnd);
    document.removeEventListener('touchmove', this.onDrag);
    document.removeEventListener('touchend', this.stopDrag);
    this.unmounted = true;
  }

  onAudioEnd = () => {
    clearInterval(this.state.timePoller);
    this.setState({ isAudioPlaying: false, seekValue: 0, timePoller: null });
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
      this.setState({ wasDragged: false });
    }
  }

  replyOnMessage = () => {
    const { id, message, userIsAuthor, username, onSlide } = this.props;
    onSlide({ id, message, userIsAuthor, username });
    this.setState({ showMessageDropdown: false });
  };

  deleteMessageHandler = () => {
    const { id, message, userIsAuthor, username, deleteMessage } = this.props;
    deleteMessage(id);
    this.setState({ showMessageDropdown: false });
  };

  getTimeFromStamp = (time) => {
    const date = new Date(+time);
    /* eslint-disable */
    const dateTime = `${date.getHours()}:${date.getMinutes()} ${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`;
    return dateTime;
  };

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

  onClick = () => {
    console.log('click is triggered');
  };

  stopDrag = () => {
    const { unlocked, showTime } = this.state;
    const { id, message, userIsAuthor, username, onSlide, updateScroll } = this.props;
    console.log('on stop drag', this.unmounted, unlocked);
    if (this.unmounted || unlocked) return;
    if (this.isDragging) {
      this.isDragging = false;
      if (this.sliderLeft > this.containerWidth * 0.35) {
        this.sliderLeft = this.containerWidth;
        this.sliderLeft = 0;
        onSlide({ id, message, userIsAuthor, username });
        this.setState({ wasDragged: false });
      } else {
        this.sliderLeft = 0;

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
    const timePoll = setInterval(() => {
      console.log('polling');
      const { currentTime, duration } = this.audio;
      if (currentTime >= duration) {
        this.onAudioEnd();
        clearInterval(this.state.timePoll);
        this.setState({ timePoller: null });
      } else {
        this.setState({ seekValue: currentTime });
        console.log(currentTime);
      }
    }, 500);
    this.setState({ timePoller: timePoll });
  };

  MessageFooter() {
    const { timestamp, isLoading } = this.props;
    const { showTime } = this.state;

    const d = new Date(0);
    d.setUTCSeconds(timestamp);

    return (
      <div className='message-footer'>
        {showTime && <span className='text-right mr-2'>{d.toLocaleString()}</span>}
        {/* {isLoading && <Spinner animation='border' variant='primary' size='sm' />} */}
      </div>
    );
  }

  openImageModal = (message) => {
    this.setState({ openImageModal: true, message });
    window.location.hash = 'modal';
  };

  ImageMessage() {
    const { message, userIsAuthor } = this.props;
    return (
      <div
        onClick={() => this.openImageModal(message)}
        className={`drag-handler ${userIsAuthor ? 'p-2 image-by-author' : 'p-1 image-by-user'}`}
        style={{ maxHeight: '240px', overflow: 'hidden' }}
      >
        <Image
          style={{ maxWidth: '240px', borderRadius: '10px' }}
          className='image-message'
          src={message.content}
        />
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
        {/* <ReactPlayer
          className='video-message'
          controls
          url={[{ src: message.content, type: 'video/mp4' }]}
          width='100%'
          height='280px'
        /> */}
        <video
          className='video-message'
          controls='controls'
          style={{ borderRadius: '5px', width: '100%', height: '280px' }}
          id='vidElement'
        >
          <source src={message.content} type='video/mp4' />
          <track src='' kind='subtitles' srcLang='en' label='English' />
        </video>
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
        {message?.content ? (
          <div>
            <AudioPlayer
              style={{ borderRadius: '20px', width: '200px', padding: '2px', boxShadow: 'none' }}
              showFilledVolume={false}
              layout='horizontal-reverse'
              showJumpControls={false}
              src={message.content}
              customAdditionalControls={[]}
              customVolumeControls={[]}
              // customIcons={{ play: <PlayArrow /> }}
            />
          </div>
        ) : null}
        {/* //   {isAudioPlaying && (
      //     <Button
      //       className='p-0 link-btn'
      //       variant='link'
      //       onClick={(e) => {
      //         e.stopPropagation();
      //         console.log('rap');
      //       }}
      //       onTouchStart={(e) => {
      //         e.stopPropagation();
      //         console.log('rap');
      //         clearInterval(this.state.timePoller);
      //         this.setState({ isAudioPlaying: false, seekValue: 0, timePoller: null });
      //         this.audio.pause();
      //         this.audio.currentTime = 0;
      //       }}
      //     >
      //       <Stop style={{ fontSize: '30px' }} />
      //     </Button>
      //   )}

      //   {!isAudioPlaying && (
      //     <Button
      //       className='p-0 link-btn'
      //       variant='link'
      //       onClick={(e) => {
      //         e.stopPropagation();
      //         console.log('rap');
      //       }}
      //       onTouchStart={(e) => {
      //         e.stopPropagation();
      //         console.log('rap');
      //         this.audioContext.resume().then(() => {
      //           console.log('Playback resumed successfully');
      //           this.audio.play();
      //           this.startPollingForTime();
      //           this.setState({ isAudioPlaying: true });
      //         });
      //       }}
      //     >
      //       <PlayArrow style={{ fontSize: '30px' }} />
      //     </Button>
      //   )}
      //   <div className='d-flex flex-column align-items-start justify-content-center mt-3'>
      //     <input
      //       className='input-range'
      //       type='range'
      //       onChange={(e) => {
      //         console.log('e', e);
      //         e.stopPropagation();
      //         console.log('on range change triggered');

      //         this.setState({ seekValue: e.target.value });
      //         this.audio.currentTime = e.target.value;
      //       }}
      //       onMouseDown={(e) => {
      //         e.stopPropagation();
      //         console.log('onmousedown');
      //       }}
      //       onTouchStart={(e) => {
      //         console.log(e.target.value);
      //       }}
      //       onTouchStartCapture={(e) => {
      //         e.stopPropagation();
      //         console.log('captured touch start ', e);
      //       }}
      //       onTouchEndCapture={(e) => console.log('captured touch end ', e)}
      //       value={seekValue}
      //       max={duration}
      //       min={0}
      //     />
      //     <span
      //       className='mt-2'
      //       style={{ color: '#0000008A', fontSize: '10px', fontFamily: 'Montserrat-Regular' }}
      //     >
      //       {(duration / 60).toFixed(2)}
      //     </span>
      //   </div> */}
        {this.MessageFooter()}
      </div>
    );
  }

  DocumentMessage() {
    const { message, userIsAuthor } = this.props;
    console.log(message);
    return (
      <div className={`drag-handler ${userIsAuthor ? 'doc-by-author' : 'doc-by-user'}`}>
        <div className='p-2 d-flex flex-row align-items-center'>
          {/* <i className='material-icons'>insert_drive_file</i> */}
          <a
            href={message.content}
            target={document.body.clientWidth < 600 ? '__blank' : ''}
            style={{ color: '#000' }}
            className='ml-3 d-flex align-items-center'
          >
            <Image src={FileIcon} height='24px' />
            <p className='ml-2' style={{ marginBottom: '0px' }}>
              {message.name}
            </p>
          </a>
        </div>
        <div className='pt-2 pr-2 pb-2'>{this.MessageFooter()}</div>
      </div>
    );
  }

  sharePost = () => {
    const { id, message, currentbranding, username } = this.props;
    console.log(currentbranding);
    const url = `${window.location.origin}/posts/${id}`;
    const title = `${username} has shared a post on \n${currentbranding.branding.client_name}`;
    const text = `${message.content.title} \n${message.content.desc} \n\nTo view more details of the discussion visit: \n${url}`;
    // eslint-disable-next-line
    const hasShared = shareThis(url, text, title);
    console.log(title, text);
    if (hasShared === 'clipboard') {
      console.log('copied');
    }
  };

  PostMessage() {
    const {
      id,
      message,
      userIsAuthor,
      userHasReacted,
      commentsInfo,
      reactions,
      onReactionToMessage,
      attachmentsArray,
      history,
    } = this.props;
    return (
      <>
        <div className={`drag-handler ${userIsAuthor ? 'p-3 ' : 'p-2 '} post-message `}>
          <div
            onClick={(e) => {
              history.push(`/posts/${id}`);
            }}
            role='button'
            tabIndex={0}
          >
            <h5 className='post-title'>{message.content.title}</h5>
            <p className='post-desc'>{message.content.desc}</p>

            {attachmentsArray && (
              <div className='d-flex justify-content-center'>
                {attachmentsArray[0]?.file_type === 'image' ? (
                  <Image className='image-message' src={message.content.cover} />
                ) : attachmentsArray[0]?.file_type === 'file' &&
                  message.content.cover.slice(
                    message.content.cover.length - 4,
                    message.content.cover.length,
                  ) === '.mp4' ? (
                  <ReactPlayer
                    className='video-message'
                    controls
                    url={[{ src: message.content.cover, type: 'video/mp4' }]}
                    width='100%'
                    height='280px'
                  />
                ) : (
                  <>
                    {attachmentsArray[0]?.file_name ? <Image src={FileIcon} height='24px' /> : null}
                    <p style={{ fontFamily: 'Montserrat-Bold' }}>
                      {attachmentsArray[0]?.file_name}
                    </p>
                  </>
                )}
              </div>
            )}
          </div>
          <div
            className={`post-footer d-flex flex-row align-items-center ${
              message.commentsEnabled === 'true' || message.reactionsEnabled === 'true'
                ? 'justify-content-between'
                : 'justify-content-center'
            } mt-1`}
          >
            {message.reactionsEnabled === 'true' ? (
              <span
                className='p-1'
                role='button'
                tabIndex={0}
                onClick={() => onReactionToMessage(id, userHasReacted)}
              >
                {userHasReacted ? (
                  <Favorite className='red' />
                ) : (
                  <FavoriteBorder className='grey' />
                )}
                {userHasReacted && reactions[0]?.count}
                {!userHasReacted && reactions[0]?.count}
                {/* <i className={`material-icons ${userHasReacted ? 'red' : 'grey'}`}>
                {userHasReacted ? 'favorite' : 'favorite_border'}
              </i>{' '} */}
                {/* {console.log(reactions)} */}
              </span>
            ) : null}
            {message.commentsEnabled === 'true' ? (
              <span
                onClick={(e) => {
                  history.push(`/posts/${id}`);
                }}
                className='p-1'
              >
                <ChatBubbleOutline className='chat-bubble' />
                {commentsInfo.commentsCount}
              </span>
            ) : null}
            <span onClick={this.sharePost} className='p-1'>
              <Share className='share' />
            </span>
          </div>
          {commentsInfo.commentsCount ? (
            <div className='post-comments pt-3 pb-3 pl-2 pr-2 mt-3'>
              <Media as='div' style={{ width: '100%' }}>
                <Image
                  src={
                    commentsInfo.sent_by.display_picture ||
                    'https://s3.ap-south-1.amazonaws.com/question-images-ingenium/1631183013255.png'
                  }
                  width={30}
                  height={30}
                  className='align-self-start mr-3'
                  roundedCircle
                />
                <Media.Body>
                  <Row>
                    <Col>
                      <div
                        className='message-content pt-1 pb-1 pl-2 pr-2'
                        style={{
                          width: '100%',
                          backgroundColor: 'transparent',
                          boxShadow: 'none',
                          display: 'block',
                        }}
                      >
                        <p className='username'>{`${commentsInfo.sent_by.first_name} ${commentsInfo.sent_by.last_name}`}</p>
                        {commentsInfo.featuredComment}
                      </div>
                    </Col>
                  </Row>
                </Media.Body>
              </Media>
            </div>
          ) : null}
          <div className='mt-3'>{this.MessageFooter()}</div>
        </div>
      </>
    );
  }

  render() {
    // const longPressEvent = useLongPress(this.onLongPress, this.onClick, this.defaultOptions);
    const {
      id,
      message,
      userIsAuthor,
      thumbnail,
      username,
      replyTo,
      timestamp,
      userColor,
    } = this.props;
    // console.log(message, '//////////////////////');
    if (!message.type) {
      return null;
    }
    const messageComponent = this.TYPE_COMPONENT_MAPPING[message.type]();

    return (
      <div
        onClick={() => this.setState({ showTime: !this.state.showTime })}
        className='mb-3'
        id={id}
      >
        <div className='message handle' key={id} ref={this.container}>
          {userIsAuthor && (
            <div className='d-flex flex-column align-items-end'>
              <div
                style={{ maxWidth: '70%' }}
                className={message.type === 'post' ? 'dragger-fullwidth' : 'dragger'}
                ref={this.slider}
                onTouchStart={this.startDrag}
              >
                <div>
                  {replyTo && replyTo.id && (
                    <div className='d-flex'>
                      {replyTo.message.type === 'post' && (
                        <div className='reply pl-2 pr-2 pt-1 pb-1'>
                          {replyTo.message.content.title}
                        </div>
                      )}
                      {replyTo.message.type !== 'post' && (
                        <>
                          <a href={`/conversation#${replyTo.id - 2}`}>
                            <div className='reply replayusername pl-2 pr-2 pt-1 pb-1'>
                              {replyTo.username}
                            </div>
                            {replyTo.message.type === 'image' ? (
                              <div className='reply d-flex align-items-center pl-2 pr-2 pt-1 pb-1'>
                                <p
                                  style={{
                                    fontFamily: 'Montserrat-Regular',
                                    marginBottom: '0px',
                                  }}
                                  className='d-flex w-100'
                                >
                                  Photo
                                </p>
                              </div>
                            ) : replyTo.message.type === 'audio' ? (
                              <div className='reply pl-2 pr-2 pt-1 pb-1'>
                                {replyTo.message.name}
                              </div>
                            ) : replyTo.message.type === 'video' ? (
                              <div className='reply d-flex px-2 py-1 justify-content-center align-items-center'>
                                <p
                                  style={{
                                    fontFamily: 'Montserrat-Regular',
                                    marginBottom: '0px',
                                  }}
                                  className='d-flex w-100'
                                >
                                  Video
                                </p>
                              </div>
                            ) : replyTo.message.type === 'doc' ||
                              replyTo.message.type === 'document' ||
                              replyTo.message.type === 'file' ? (
                              <div className='reply d-flex px-2 py-1 justify-content-center'>
                                <Image src={FileIcon} height='24px' />
                                <p className='ml-2' style={{ marginBottom: '0px' }}>
                                  {replyTo.message.name}
                                </p>
                              </div>
                            ) : (
                              <div className='reply pl-2 pr-2 pt-1 pb-1'>
                                {replyTo.message.content.length > 40
                                  ? `${replyTo.message.content.slice(0, 40)}...`
                                  : replyTo.message.content}
                              </div>
                            )}
                          </a>
                          {replyTo.message.type === 'image' ? (
                            <div
                              style={{
                                width: '61px',
                                height: '61px',
                                overflow: 'hidden',
                              }}
                            >
                              <img
                                style={{
                                  width: '61px',
                                  minHeight: '61px',
                                  borderRadius: '0px 10px 10px 0px',
                                }}
                                className='image-message'
                                src={replyTo.message.content}
                                alt='image'
                              />
                            </div>
                          ) : replyTo.message.type === 'video' ? (
                            <div
                              style={{
                                width: '61px',
                                height: '61px',
                                overflow: 'hidden',
                              }}
                            >
                              <video
                                style={{
                                  width: '61px',
                                  minHeight: '61px',
                                  borderRadius: '0px 10px 10px 0px',
                                }}
                                className='image-message'
                                preload='metadata'
                              >
                                <source src={replyTo.message.content + '#t=0.1'} />
                              </video>
                            </div>
                          ) : null}
                        </>
                      )}
                    </div>
                  )}
                  {messageComponent}
                </div>
                {message.type !== 'post' ? (
                  <KeyboardArrowDownIcon
                    style={{ cursor: 'pointer' }}
                    onClick={() => this.setState({ showMessageDropdown: true })}
                  />
                ) : null}
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
              {message.type !== 'begining' ? (
                <Image
                  src={thumbnail}
                  width={30}
                  height={30}
                  className='align-self-start mr-3 mt-2'
                  roundedCircle
                />
              ) : null}
              <Media.Body>
                <Row
                  style={
                    message.type === 'begining'
                      ? { justifyContent: 'center', marginTop: '10px' }
                      : {}
                  }
                >
                  <div style={{ maxWidth: '66%' }}>
                    <div
                      style={{
                        minWidth: message.type === 'post' ? 'fit-content' : 'fit-content',
                      }}
                      className='d-flex message-content pt-1 pb-1 pl-2 pr-2'
                    >
                      <div className=''>
                        <p style={{ color: userColor }} className='username'>
                          {username}
                        </p>
                        {replyTo.id && (
                          <div className='d-flex pt-1 pb-1'>
                            <a href={`/conversation#${replyTo.id - 2}`}>
                              <div className='reply replayusername pl-2 pr-2 pt-1 pb-1'>
                                {replyTo.username}
                              </div>
                              {replyTo.message.type === 'image' ? (
                                <div className='reply d-flex align-items-center px-2 py-1 justify-content-center'>
                                  <p
                                    style={{
                                      fontFamily: 'Montserrat-Regular',
                                      marginBottom: '0px',
                                    }}
                                    className='d-flex w-100'
                                  >
                                    Photo
                                  </p>
                                </div>
                              ) : replyTo.message.type === 'audio' ? (
                                <div className='reply pl-2 pr-2 pt-1 pb-1'>
                                  {replyTo.message.name}
                                </div>
                              ) : replyTo.message.type === 'video' ? (
                                <div className='reply d-flex px-2 py-1 justify-content-center align-items-center flex-cloumn'>
                                  <p
                                    style={{
                                      fontFamily: 'Montserrat-Regular',
                                      marginBottom: '0px',
                                    }}
                                    className='d-flex w-100'
                                  >
                                    Video
                                  </p>
                                </div>
                              ) : replyTo.message.type === 'doc' ||
                                replyTo.message.type === 'document' ||
                                replyTo.message.type === 'file' ? (
                                <div className='reply d-flex px-2 py-1 justify-content-center'>
                                  <Image src={FileIcon} height='24px' />
                                  <p className='ml-2' style={{ marginBottom: '0px' }}>
                                    {replyTo.message.name}
                                  </p>
                                </div>
                              ) : (
                                <div className='reply pl-2 pr-2 pt-1 pb-1'>
                                  {replyTo.message.content.length > 40
                                    ? `${replyTo.message.content.slice(0, 40)}...`
                                    : replyTo.message.content}
                                </div>
                              )}
                            </a>
                            {replyTo.message.type === 'image' ? (
                              <div
                                style={{
                                  width: '61px',
                                  height: '61px',
                                  overflow: 'hidden',
                                }}
                              >
                                <img
                                  style={{
                                    width: '61px',
                                    minHeight: '61px',
                                    borderRadius: '0px 10px 10px 0px',
                                  }}
                                  className='image-message'
                                  src={replyTo.message.content}
                                  alt='image'
                                />
                              </div>
                            ) : replyTo.message.type === 'video' ? (
                              <div
                                style={{
                                  width: '61px',
                                  height: '61px',
                                  overflow: 'hidden',
                                }}
                              >
                                <video
                                  style={{
                                    width: '61px',
                                    minHeight: '61px',
                                    borderRadius: '0px 10px 10px 0px',
                                  }}
                                  className='image-message'
                                  preload='metadata'
                                >
                                  <source src={replyTo.message.content + '#t=0.1'} />
                                </video>
                              </div>
                            ) : null}
                          </div>
                        )}

                        {messageComponent}
                      </div>
                      {message.type !== 'post' && message.type !== 'begining' ? (
                        <>
                          <KeyboardArrowDownIcon
                            style={{ cursor: 'pointer' }}
                            onClick={() => this.setState({ showMessageDropdown: true })}
                          />
                        </>
                      ) : null}

                      {/* <p
                        style={{
                          fontFamily: 'Montserrat-Regular',
                          fontSize: '10px',
                          marginBottom: '0px',
                        }}
                      >
                        {this.getTimeFromStamp(timestamp)}
                      </p> */}
                    </div>
                  </div>
                </Row>
              </Media.Body>
            </Media>
          )}
        </div>
        <Modal
          show={this.state.openImageModal}
          onHide={() => this.setState({ openImageModal: false })}
          centered
          className='d-flex justify-content-center'
        >
          <img className='modalImageChats' src={this.state.message.content} />

          <Modal.Footer>
            <a href={this.state.message.content}>
              <GetAppIcon />
            </a>
          </Modal.Footer>
        </Modal>
        <Modal
          show={this.state.showMessageDropdown}
          onHide={() => this.setState({ showMessageDropdown: false })}
          centered
          className='d-flex justify-content-center'
        >
          <ul className='chatOperations'>
            {this.props.role === 'admin' ? (
              <li onClick={this.deleteMessageHandler}>
                <DeleteIcon /> Delete message
              </li>
            ) : (
              userIsAuthor && (
                <li onClick={this.deleteMessageHandler}>
                  <DeleteIcon /> Delete message
                </li>
              )
            )}
            {message.type === 'text' ? (
              <li
                onClick={() => {
                  navigator.clipboard.writeText(message.content);
                  this.setState({ showMessageDropdown: false });
                }}
              >
                <ContentCopyIcon /> Copy text
              </li>
            ) : null}
            <li onClick={this.replyOnMessage}>
              <ReplyIcon /> Reply
            </li>
            <li onClick={() => this.setState({ showMessageDropdown: false })}>
              <CancelIcon /> Cancel
            </li>
          </ul>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    currentbranding: getCurrentBranding(state),
  };
};

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
  currentbranding: PropTypes.instanceOf(Object).isRequired,
  id: PropTypes.number.isRequired,
  onReactionToMessage: PropTypes.func.isRequired,
  username: PropTypes.string,
  thumbnail: PropTypes.string.isRequired,
  attachmentsArray: PropTypes.instanceOf(Array).isRequired,
  message: PropTypes.shape({
    name: PropTypes.string,
    type: PropTypes.string.isRequired,
    commentsEnabled: PropTypes.bool,
    reactionsEnabled: PropTypes.bool,
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
  deleteMessage: PropTypes.func.isRequired,
  role: PropTypes.string.isRequired,
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

export default connect(mapStateToProps)(withRouter(Message));
