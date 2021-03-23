import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Form, Button } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import ConversationsHeader from '../ConversationsHeader';
import { post } from '../../../Utilities';
import './CreatePost.scss';

const CreatePost = function ({}) {
  const history = useHistory();
  const [form, setForm] = useState({});
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
    <>
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
              <Button variant='link' size='sm' className='add-cta'>
                + Add
              </Button>
            </div>
          </div>

          <div className='p-2 fixed-bottom '>
            <Button variant='primary' type='submit' block>
              Submit
            </Button>
          </div>
        </Form>
      </div>
    </>
  );
};

CreatePost.propTypes = {};

export default CreatePost;
