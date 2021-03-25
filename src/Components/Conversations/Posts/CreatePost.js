import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Form, Button, Image, Spinner } from 'react-bootstrap';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { conversationsActions } from '../../../redux/actions/conversations.action';
import { getConversation } from '../../../redux/reducers/conversations.reducer';
import { getClientUserId } from '../../../redux/reducers/clientUserId.reducer';
import Conversation from '../Conversation';
import ConversationsHeader from '../ConversationsHeader';
import { post, uploadFiles } from '../../../Utilities';
import './CreatePost.scss';

function useOutsideAlerter(ref, cb) {
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        cb();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref]);
}

const CreatePost = function ({ clientUserId, conversation }) {
  const history = useHistory();
  const wrapperRef = useRef(null);
  const fileSelectorRef = useRef(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({});
  const [fileType, setFileType] = useState('');
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  useOutsideAlerter(wrapperRef, () => {
    setShowBottomSheet(false);
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formDataObj = {};
    formDataObj.client_user_id = clientUserId;
    formDataObj.type = 'post';
    formDataObj.conversation_id = conversation.id;
    formDataObj.title_text = form.title;
    formDataObj.text = form.description;

    if (selectedFiles.length > 0) {
      const formatAttachments = (array) => array.map((a) => a);

      uploadFiles(selectedFiles).then((resp) => {
        const attachments = JSON.stringify(formatAttachments(resp.attachments_array));
        formDataObj.attachments_array = attachments;
        post(formDataObj, '/createPost').then((res) => {
          history.push('/conversation');
        });
        setIsLoading(false);
        // console.log(formDataObj);
      });
    } else {
      post(formDataObj, '/createPost').then((res) => {
        history.push('/conversation');
      });
      setIsLoading(false);
    }
  };

  const openFilePicker = (type) => {
    let accept = '*';
    setFileType(type);

    if (type === 'image') {
      accept = 'image/png,image/jpeg,image/jpg';
    } else if (type === 'audio') {
      accept = 'audio/mp3';
    } else if (type === 'video') {
      accept = 'video/mp4';
    }

    fileSelectorRef.current.accept = accept;
    fileSelectorRef.current.click();
    setShowBottomSheet(false);
  };

  const saveUploadedFiles = () => {
    const files = [...selectedFiles];
    console.log(fileSelectorRef.current.files[0]);
    files.push({
      file: fileSelectorRef.current.files[0],
      type: fileType,
      path: URL.createObjectURL(fileSelectorRef.current.files[0]),
    });
    setSelectedFiles(files);
  };

  const removeFile = (index) => {
    const files = [...selectedFiles];
    files.splice(index, 1);
    setSelectedFiles(files);
  };

  const ImageFile = (url, index) => (
    <div className='image-preview mt-2 mb-2'>
      <Button size='sm' variant='link' onClick={(e) => removeFile(index)} className='remove-btn'>
        <span className='material-icons'>highlight_off</span>
      </Button>
      <Image src={url} width='100%' rounded />
    </div>
  );

  const DocFile = (name, index) => (
    <div className='doc-preview mt-2 mb-2'>
      <span className='doc-name p-3'>{name}</span>
      <Button size='sm' variant='link' onClick={(e) => removeFile(index)} className='remove-btn'>
        <span className='material-icons'>highlight_off</span>
      </Button>
    </div>
  );

  return (
    <div ref={wrapperRef}>
      <ConversationsHeader title='New Post' />
      <div className='create-post-container container-fluid'>
        <Form
          className='mt-3 d-flex flex-column justify-content-between align-items-stretch'
          onSubmit={onSubmit}
        >
          <div>
            <label className='has-float-label mt-3'>
              <input
                className='form-control'
                name='title'
                type='text'
                placeholder='Enter Title'
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
              <span>Title (required)</span>
            </label>
            <label className='has-float-label mt-3'>
              <input
                className='form-control'
                name='description'
                type='text'
                placeholder='Description'
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
              <span>Description</span>
            </label>
            <div className='mt-4'>
              <p className='mb-0'>Attachments and more</p>
              <Button
                variant='link'
                size='sm'
                className='add-cta'
                onClick={() => setShowBottomSheet(true)}
              >
                + Add
              </Button>
              <div className='file-preview'>
                {selectedFiles.map((sf, index) =>
                  sf.type === 'image' ? ImageFile(sf.path, index) : DocFile(sf.file.name, index),
                )}
              </div>
            </div>
          </div>
          <div
            className={`p-2 fixed-bottom transition ${!showBottomSheet ? 'd-block' : 'd-none'}`}
            style={{ backgroundColor: '#fff' }}
          >
            <Button
              variant='primary'
              type='submit'
              block
              disabled={isLoading || form.title === '' || form.title === undefined}
              className='d-flex flex-row align-items-center justify-content-center'
            >
              Submit {isLoading && <Spinner className='ml-2' animation='border' size='sm' />}
            </Button>
          </div>

          <div
            className={`p-2 fixed-bottom bottom-sheet transition ${
              showBottomSheet ? 'd-block' : 'd-none'
            }`}
          >
            <p className='text-center pt-2 pb-2 title'>Add new </p>

            <div className='d-flex flex-row justify-content-center align-items-center'>
              <input
                type='file'
                className='d-none'
                ref={fileSelectorRef}
                onChange={(e) => saveUploadedFiles()}
              />
              <div className='text-center' style={{ width: '80px' }}>
                <Button
                  variant='link'
                  className='p-0 action-btn'
                  onClick={() => openFilePicker('image')}
                >
                  <i className='material-icons'>collections</i>
                  <p className='icon-action'>From Gallery</p>
                </Button>
              </div>
              <div className='text-center ml-3 mr-3' style={{ width: '80px' }}>
                <Button
                  variant='link'
                  className='p-0 action-btn'
                  onClick={() => openFilePicker('file')}
                >
                  <i className='material-icons'>attach_file</i>
                  <p className='icon-action'>From Files</p>
                </Button>
              </div>
              <div className='text-center' style={{ width: '80px' }}>
                <Button
                  variant='link'
                  className='p-0 action-btn'
                  onClick={() => openFilePicker('camera')}
                >
                  <i className='material-icons'>photo_camera</i>
                  <p className='icon-action'>Camera</p>
                </Button>
              </div>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  conversation: getConversation(state),
  clientUserId: getClientUserId(state),
});

const mapDispatchToProps = (dispatch) => {
  return {
    setConversation: (conversation) => {
      dispatch(conversationsActions.setConversation(conversation));
    },
  };
};

CreatePost.propTypes = {
  clientUserId: PropTypes.number.isRequired,
  conversation: PropTypes.objectOf(Conversation).isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(CreatePost);
