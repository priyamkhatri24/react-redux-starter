import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import Webcam from 'react-webcam';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Modal from 'react-bootstrap/Modal';
import Image from 'react-bootstrap/Image';
import MicRecorder from 'mic-recorder-to-mp3';
import Close from '@material-ui/icons/Close';
import Attachment from '@material-ui/icons/Attachment';
import InsertEmoticon from '@material-ui/icons/InsertEmoticon';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import Send from '@material-ui/icons/Send';
import MicNone from '@material-ui/icons/MicNone';
import Refresh from '@material-ui/icons/Refresh';
import Stop from '@material-ui/icons/Stop';
import './Conversations.scss';

const ConversationInput = function ({ sendMessage, onFileUpload, reply, onRemoveReply }) {
  const [message, setMessage] = useState('');
  const [attachmentOpen, setAttachmentOpen] = useState(false);
  const [webcamOptions, setWebcamOptions] = useState({
    facingMode: 'user',
  });
  const [intervalFunc, setIntervalFuc] = useState(null);
  const [recordingState, setRecordingState] = useState({
    isRecording: false,
    blobURL: '',
    isBlocked: false,
    isVisible: false,
    file: null,
  });
  const [timeElapsed, setTimeElapsed] = useState('00:00');
  const [recorder, setRecorder] = useState(null);
  const [fileType, setFileType] = useState('');
  const fileSelector = useRef();
  const cameraSelector = useRef();
  const messageInputRef = useRef();

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const send = function () {
    if (messageInputRef) {
      messageInputRef.current.focus();
    }
    sendMessage(message);
    setMessage('');
  };

  useEffect(() => {
    if (messageInputRef && messageInputRef.current) {
      if (reply) {
        console.log('haha');
        setTimeout(() => {
          messageInputRef.current.blur();
          messageInputRef.current.focus();
        }, 200);
      }
    }
  });

  const focusMessageInput = () => {
    if (messageInputRef && messageInputRef.current) {
      messageInputRef.current.focus();
    }
  };

  const openFilePicker = function (type) {
    setAttachmentOpen(false);
    let accept = '*';
    setFileType(type);

    if (type === 'image') {
      accept = 'image/png,image/jpeg,image/jpg';
    } else if (type === 'audio') {
      accept = 'audio/mp3';
    } else if (type === 'video') {
      accept = 'video/mp4';
    }

    fileSelector.current.accept = accept;
    fileSelector.current.click();
  };

  const startRecording = function () {
    setTimeElapsed('00:00');
    const newRecorder = new MicRecorder({ bitRate: 128 });
    navigator.getUserMedia(
      { audio: true },
      () => {
        console.log('Permission Granted');
        newRecorder
          .start()
          .then(() => {
            a();
            b();
            // setRecordingState({
            //   ...recordingState,
            //   isRecording: true,
            //   isBlocked: false,
            //   isVisible: true,
            // });
          })
          .catch((e) => console.error(e));
      },
      () => {
        console.log('Permission Denied');
        setRecordingState({ ...recordingState, isBlocked: true });
      },
    );

    setRecorder(newRecorder);
  };

  const stopRecording = (isVisible = true) => {
    clearInterval(intervalFunc);
    recorder
      .stop()
      .getMp3()
      .then(([buffer, blob]) => {
        const file = new File(buffer, 'recording.mp3', {
          type: blob.type,
          lastModified: Date.now(),
        });
        const blobURL = URL.createObjectURL(file);
        setRecordingState({ ...recordingState, blobURL, file, isRecording: false, isVisible });
      })
      .catch((e) => {
        setRecordingState({
          ...recordingState,
          blobURL: '',
          file: null,
          isRecording: false,
          isVisible,
        });
      });
  };

  const sendRecording = () => {
    console.log('sending');
    console.log(recordingState.file);
    onFileUpload(recordingState.file, 'audio');
    setRecordingState({ ...recordingState, isVisible: false, file: null, blobURL: '' });
    setTimeElapsed('00:00');
  };

  const captureImage = function () {
    function urltoFile(url) {
      return fetch(url)
        .then(function (res) {
          return res.arrayBuffer();
        })
        .then(function (buf) {
          return onFileUpload(new File([buf], 'image.png'), 'image');
        });
    }
    urltoFile(cameraSelector.current.getScreenshot());
  };

  const a = () =>
    setRecordingState({
      ...recordingState,
      isRecording: true,
      isVisible: true,
      isBlocked: false,
    });

  const b = () => {
    const timeNow = Date.now();
    const l = setInterval(() => {
      console.log('interval set');
      console.log(timeNow);

      const totalSeconds = Math.round((Date.now() - timeNow) / 1000);
      const minutes = `${Math.floor(totalSeconds / 60)}`.padStart(2, '0');
      const seconds = `${totalSeconds % 60}`.padStart(2, '0');

      setTimeElapsed(`${minutes}:${seconds}`);
    }, 1000);
    setIntervalFuc(l);
  };

  const cleanUpAudio = () => {
    stopRecording(false);
    clearInterval(intervalFunc);
    setTimeElapsed('00:00');
  };

  const flipCamera = () => {
    if (webcamOptions.facingMode === 'user') {
      setWebcamOptions({ facingMode: { exact: 'environment' } });
    } else {
      setWebcamOptions({ facingMode: 'user' });
    }
  };

  return (
    <>
      {!recordingState.isVisible && (
        <Row
          className='desktopInput'
          style={{ backgroundColor: '#fff', zIndex: 2, boxShadow: '0.5px 0.5px 10px #00000026' }}
        >
          {reply && (
            <Col xs={12} className='py-1'>
              <div className='d-flex align-items-center p-2 justify-content-between reply'>
                <div className='container'>
                  <div>
                    <p className='mb-0' style={{ color: '#2699fb', fontWeight: 'bold' }}>
                      {reply.userIsAuthor ? 'You' : reply.username}
                    </p>
                    {reply.message.type === 'text' && (
                      <p className='mb-0'>
                        {reply.message.content.length > 40
                          ? `${reply.message.content.slice(0, 40)}...`
                          : reply.message.content}
                      </p>
                    )}
                    {reply.message.type === 'image' && (
                      <div className='d-flex justify-content-between align-items-center'>
                        <p className='mb-0'>Image</p>
                        {/* <Image src={reply.message.content} height={30} /> */}
                        {/* <p className='mb-0'>{reply.message.content}</p> */}
                      </div>
                    )}
                    {reply.message.type === 'video' && (
                      <div className='d-flex justify-content-between align-items-center'>
                        <p className='mb-0'>Video</p>
                        {/* <Image src={reply.message.content} height={30} /> */}
                        {/* <p className='mb-0'>{reply.message.content}</p> */}
                      </div>
                    )}
                  </div>
                </div>
                <Button variant='link' className='p-0 m-0 d-flex' onClick={() => onRemoveReply()}>
                  <Close />
                </Button>
              </div>
            </Col>
          )}
          <Col xs={12} className='py-1' style={{ padding: '10px auto' }}>
            <div className='d-flex flex-row align-items-center justify-content-between'>
              <div className='d-flex flex-row input-container align-items-center'>
                <button
                  id='dropdown-button-drop-up'
                  onClick={() => setAttachmentOpen(!attachmentOpen)}
                  type='button'
                >
                  <Attachment />
                </button>
                {attachmentOpen && (
                  <ul className='dropdownList' style={{ position: 'fixed', zIndex: '100' }}>
                    {/* eslint-disable */}
                    <li onClick={(e) => openFilePicker(e.target.textContent.toLowerCase())}>
                      Image
                    </li>
                    <li onClick={(e) => openFilePicker(e.target.textContent.toLowerCase())}>
                      Video
                    </li>
                    <li onClick={(e) => openFilePicker(e.target.textContent.toLowerCase())}>
                      Document
                    </li>
                  </ul>
                )}
                <input
                  type='file'
                  ref={fileSelector}
                  style={{ display: 'none' }}
                  onChange={(e) => onFileUpload(fileSelector.current.files[0], fileType)}
                />
                <FormControl
                  placeholder='Type a message'
                  as='input'
                  ref={messageInputRef}
                  id='chat-input'
                  aria-label='Input field for your message'
                  value={message}
                  // onBlur={(e) => e.target.focus()}
                  onClick={() => window.scrollTo(0, document.body.clientHeight)}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => (e.key === 'Enter' && !!message ? send() : null)}
                />
                <span className='upload-actions'>
                  <Button
                    variant='link'
                    size='sm'
                    className='camera-btn hideOnMob'
                    onClick={handleShow}
                  >
                    <PhotoCamera />
                  </Button>
                </span>
              </div>
              {!!message && (
                <Button className='rounded-btn mr-2' onClick={() => send()}>
                  <Send style={{ fontSize: '15px' }} />
                </Button>
              )}
              {!message && !recordingState.isRecording && (
                <Button className='rounded-btn mr-2' onClick={() => startRecording()}>
                  <MicNone />
                </Button>
              )}
              {/* {!message && recordingState.isRecording && (
                <Button className='rounded-btn mr-2' onClick={() => stopRecording()}>
                  <i className='material-icons'>close</i>
                </Button>
              )} */}
            </div>
          </Col>
        </Row>
      )}

      {recordingState.isVisible && (
        <div
          className='desktopInput py-1'
          style={{ boxShadow: '0px -4px 8px #1f00750f', background: '#fff', borderRadius: '10px' }}
        >
          <div className='text-center mb-3'>
            {recordingState.isRecording ? <h3>Recording</h3> : <h3>Done</h3>}
            <p>{timeElapsed}</p>
          </div>
          <div className='d-flex align-items-center justify-content-center'>
            <Button
              variant='link'
              onClick={(e) => {
                setRecordingState({
                  ...recordingState,
                  isVisible: false,
                  isRecording: false,
                  blobURL: '',
                });
                cleanUpAudio();
              }}
            >
              <Close style={{ color: '#FF0000DE', fontSize: '30px' }} />
            </Button>
            {recordingState.isRecording && (
              <Button
                variant='link'
                onClick={(e) => {
                  stopRecording();
                }}
              >
                <Stop style={{ color: '#2699FB', fontSize: '30px' }} />
              </Button>
            )}
            {!recordingState.isRecording && (
              <>
                <Button variant='link' onClick={(e) => startRecording()}>
                  <Refresh style={{ color: '#2699FB', fontSize: '30px' }} />
                </Button>
                <Button variant='link' onClick={() => sendRecording()}>
                  <Send style={{ color: '#000000', fontSize: '30px' }} />
                </Button>
              </>
            )}
          </div>
        </div>
      )}

      <Modal show={show} onHide={handleClose} centered size='lg' style={{ height: '100%' }}>
        <Webcam ref={cameraSelector} videoConstraints={webcamOptions} />
        <Button onClick={() => captureImage()}>Capture</Button>
        <Button onClick={() => flipCamera()}>Flip</Button>
      </Modal>
    </>
  );
};

ConversationInput.propTypes = {
  sendMessage: PropTypes.func.isRequired,
  onFileUpload: PropTypes.func.isRequired,
  onRemoveReply: PropTypes.func.isRequired,
  reply: PropTypes.shape({
    id: PropTypes.number.isRequired,
    username: PropTypes.string.isRequired,
    userIsAuthor: PropTypes.bool.isRequired,
    message: PropTypes.shape({
      type: PropTypes.string.isRequired,
      name: PropTypes.string,
      content: PropTypes.string.isRequired,
    }),
  }),
};

ConversationInput.defaultProps = {
  reply: {},
};

export default ConversationInput;
