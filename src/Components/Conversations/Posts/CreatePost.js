import React, { useRef, useEffect, useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import { post, apiValidation, uploadImage } from '../../../Utilities';
import './CreatePost.scss';

const CreatePost = function ({}) {
  const history = useHistory();
  const onSubmit = (e) => {
    console.log('hello');
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(e.target);
    const formDataObj = Object.fromEntries(formData.entries());

    formDataObj.client_user_id = 1606;
    formDataObj.type = 'post';
    formDataObj.conversation_id = 2;
    formDataObj.title_text = formDataObj.title;
    formDataObj.text = formDataObj.description;

    post(formDataObj, '/sendMessageInChat').then((resp) => {
      console.log('resp', resp);
      history.push('/conversation');
    });
    console.log(formDataObj);
  };

  return (
    <div className='create-post-container container-fluid'>
      <Form className='mt-3' onSubmit={onSubmit}>
        <Form.Group controlId='formBasicTitle'>
          <Form.Label>Title</Form.Label>
          <Form.Control type='text' placeholder='Enter Title' name='title' />
          {/* <Form.Text className='text-muted'>
            Well never share your email with anyone else.
          </Form.Text> */}
        </Form.Group>

        <Form.Group controlId='formBasicDescription'>
          <Form.Label>Description</Form.Label>
          <Form.Control type='text' as='textarea' placeholder='Description' name='description' />
        </Form.Group>
        <Button variant='primary' type='submit'>
          Submit
        </Button>
      </Form>
    </div>
  );
};

CreatePost.propTypes = {};

export default CreatePost;
