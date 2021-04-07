import React, { useState, useRef } from 'react';
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

const ConversationInput = function ({ sendMessage, onFileUpload, reply, onRemoveReply }) {
  const [message, setMessage] = useState('');
  const [recordingState, setRecordingState] = useState({
    isRecording: false,
    blobURL: '',
    isBlocked: false,
  });
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
    const newRecorder = new MicRecorder({ bitRate: 128 });
    navigator.getUserMedia(
      { audio: true },
      () => {
        console.log('Permission Granted');
        newRecorder
          .start()
          .then(() => {
            setRecordingState({ ...recordingState, isRecording: true, isBlocked: false });
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

  const stopRecording = () => {
    recorder
      .stop()
      .getMp3()
      .then(([buffer, blob]) => {
        const file = new File(buffer, 'recording.mp3', {
          type: blob.type,
          lastModified: Date.now(),
        });
        const blobURL = URL.createObjectURL(file);
        setRecordingState({ ...recordingState, blobURL, isRecording: false });
        onFileUpload(file, 'audio');
      })
      .catch((e) => console.log(e));
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

  return (
    <>
      <Row className='fixed-bottom pb-2' style={{ backgroundColor: '#fff', zIndex: 2 }}>
        {reply && (
          <Col xs={12}>
            <div className='d-flex align-items-center p-2 justify-content-between reply'>
              <div className='container'>
                <div>
                  <p className='mb-0' style={{ color: '#2699fb', fontWeight: 'bold' }}>
                    {reply.userIsAuthor ? 'You' : reply.username}
                  </p>
                  {reply.message.type === 'text' && <p className='mb-0'>{reply.message.content}</p>}
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
                <i className='material-icons'>close</i>
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
                title={<i className='material-icons'>attachment</i>}
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
                <i className='material-icons pr-2'>insert_emoticon</i>
                <Button variant='link' size='sm' className='camera-btn' onClick={handleShow}>
                  <i className='material-icons'>photo_camera</i>
                </Button>
              </span>
            </div>
            {!!message && (
              <Button className='rounded-btn mr-2' onClick={() => send()}>
                <i className='material-icons'>send</i>
              </Button>
            )}
            {!message && !recordingState.isRecording && (
              <Button className='rounded-btn mr-2' onClick={() => startRecording()}>
                <i className='material-icons'>mic_none</i>
              </Button>
            )}
            {!message && recordingState.isRecording && (
              <Button className='rounded-btn mr-2' onClick={() => stopRecording()}>
                <i className='material-icons'>close</i>
              </Button>
            )}
          </div>
        </Col>
      </Row>

      <Modal show={show} onHide={handleClose} centered size='xl' style={{ height: '100%' }}>
        <Webcam ref={cameraSelector} />
        <Button onClick={() => captureImage()}>Capture</Button>
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
