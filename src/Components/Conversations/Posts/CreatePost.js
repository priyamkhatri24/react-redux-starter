import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Form, Button, Image } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import ConversationsHeader from '../ConversationsHeader';
import { post, uploadFiles } from '../../../Utilities';
import './CreatePost.scss';

function useOutsideAlerter(ref, cb) {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        cb();
        // alert("You clicked outside of me!");
      }
    }

    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref]);
}

const CreatePost = function ({}) {
  const history = useHistory();
  const wrapperRef = useRef(null);
  const fileSelectorRef = useRef(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [form, setForm] = useState({});
  const [fileType, setFileType] = useState('');
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  useOutsideAlerter(wrapperRef, () => {
    // alert('You clicked outside of me!');
    setShowBottomSheet(false);
  });

  const onSubmit = async (e) => {
    e.preventDefault();

    uploadFiles(selectedFiles.map((sf) => sf.file)).then((resp) => {
      console.log(resp);

      // const formDataObj = {};
      // formDataObj.client_user_id = 1606;
      // formDataObj.type = 'post';
      // formDataObj.conversation_id = 2;
      // formDataObj.title_text = form.title;
      // formDataObj.text = form.description;
      // formDataObj.attachments_array =

      // post(formDataObj, '/createPost').then((resp) => {
      //   console.log('resp', resp);
      //   history.push('/conversation');
      // });
      // console.log(formDataObj);
    });
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
    <div className='image-preview'>
      <Button size='sm' variant='link' onClick={(e) => removeFile(index)} className='remove-btn'>
        <span className='material-icons'>highlight_off</span>
      </Button>
      <Image src={url} height='50px' rounded />
    </div>
  );

  const DocFile = (name, index) => (
    <div className='doc-preview'>
      <span className='doc-name'>{name.slice(0, 10)}...</span>
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

          <div className={`p-2 fixed-bottom transition ${!showBottomSheet ? 'd-block' : 'd-none'}`}>
            <Button variant='primary' type='submit' block>
              Submit
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

CreatePost.propTypes = {};

export default CreatePost;
