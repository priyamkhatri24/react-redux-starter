import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Form, Button } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import ConversationsHeader from '../ConversationsHeader';
import { post } from '../../../Utilities';
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
  const [form, setForm] = useState({});
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  useOutsideAlerter(wrapperRef, () => {
    // alert('You clicked outside of me!');
    setShowBottomSheet(false);
  });

  const onSubmit = (e) => {
    e.preventDefault();
    const formDataObj = {};
    formDataObj.client_user_id = 1606;
    formDataObj.type = 'post';
    formDataObj.conversation_id = 2;
    formDataObj.title_text = form.title;
    formDataObj.text = form.description;

    post(formDataObj, '/createPost').then((resp) => {
      console.log('resp', resp);
      history.push('/conversation');
    });
    console.log(formDataObj);
  };

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
            </div>
          </div>

          <div className={`p-2 fixed-bottom ${!showBottomSheet ? 'd-block' : 'd-none'}`}>
            <Button variant='primary' type='submit' block>
              Submit
            </Button>
          </div>

          <div
            className={`p-2 fixed-bottom bottom-sheet ${showBottomSheet ? 'd-block' : 'd-none'}`}
          >
            <p className='text-center pt-2 pb-2 title'>Add new </p>

            <div className='d-flex flex-row justify-content-center align-items-center'>
              <div className='text-center' style={{ width: '80px' }}>
                <i className='material-icons'>collections</i>
                <p className='icon-action'>From Gallery</p>
              </div>
              <div className='text-center ml-3 mr-3' style={{ width: '80px' }}>
                <i className='material-icons'>attach_file</i>
                <p className='icon-action'>From Files</p>
              </div>
              <div className='text-center' style={{ width: '80px' }}>
                <i className='material-icons'>photo_camera</i>
                <p className='icon-action'>Camera</p>
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
