import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import Webcam from 'react-webcam';
import {
  Row,
  Col,
  FormControl,
  Button,
  DropdownButton,
  Dropdown,
  ButtonGroup,
  Modal,
  Image,
} from 'react-bootstrap';
import MicRecorder from 'mic-recorder-to-mp3';
import Close from '@material-ui/icons/Close';
import Attachment from '@material-ui/icons/Attachment';
import InsertEmoticon from '@material-ui/icons/InsertEmoticon';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import Send from '@material-ui/icons/Send';
import MicNone from '@material-ui/icons/MicNone';
import Refresh from '@material-ui/icons/Refresh';
import Stop from '@material-ui/icons/Stop';

const ConversationInput = function ({ sendMessage, onFileUpload, reply, onRemoveReply }) {
  const [message, setMessage] = useState('');
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

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const send = function () {
    sendMessage(message);
    setMessage('');
  };

  const openFilePicker = function (type) {
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
          className='fixed-bottom pb-2 pt-2'
          style={{ backgroundColor: '#fff', zIndex: 2, boxShadow: '0.5px 0.5px 10px #00000026' }}
        >
          {reply && (
            <Col xs={12}>
              <div className='d-flex align-items-center p-2 justify-content-between reply'>
                <div className='container'>
                  <div>
                    <p className='mb-0' style={{ color: '#2699fb', fontWeight: 'bold' }}>
                      {reply.userIsAuthor ? 'You' : reply.username}
                    </p>
                    {reply.message.type === 'text' && (
                      <p className='mb-0'>{reply.message.content}</p>
                    )}
                    {reply.message.type === 'image' && (
                      <div className='d-flex justify-content-between align-items-center'>
                        <p className='mb-0'>{reply.message.name.slice(0, 25)}...</p>
                        <Image src={reply.message.content} height={30} />
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
          <Col xs={12}>
            <div className='d-flex flex-row align-items-center justify-content-between'>
              <div className='d-flex flex-row input-container align-items-center'>
                <DropdownButton
                  onSelect={(e) => openFilePicker(e)}
                  as={ButtonGroup}
                  key='up'
                  id='dropdown-button-drop-up'
                  drop='up'
                  variant='primary'
                  title={<Attachment />}
                >
                  <Dropdown.Item eventKey='image'>Image</Dropdown.Item>
                  <Dropdown.Item eventKey='video'>Video</Dropdown.Item>
                  <Dropdown.Item eventKey='doc'>Document</Dropdown.Item>
                  <Dropdown.Item eventKey='audio'>Audio</Dropdown.Item>
                </DropdownButton>
                <input
                  type='file'
                  ref={fileSelector}
                  style={{ display: 'none' }}
                  onChange={(e) => onFileUpload(fileSelector.current.files[0], fileType)}
                />
                <FormControl
                  placeholder='Type a message'
                  as='input'
                  id='chat-input'
                  aria-label='Input field for your message'
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <span className='upload-actions'>
                  <InsertEmoticon className='pr-2' />
                  <Button variant='link' size='sm' className='camera-btn' onClick={handleShow}>
                    <PhotoCamera />
                  </Button>
                </span>
              </div>
              {!!message && (
                <Button className='rounded-btn mr-2' onClick={() => send()}>
                  <Send />
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
          className='fixed-bottom audio-input pt-3 pb-3'
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

      <Modal show={show} onHide={handleClose} centered size='xl' style={{ height: '100%' }}>
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
