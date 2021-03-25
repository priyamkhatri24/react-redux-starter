import React, { useState, useRef, useEffect } from 'react';
import { createMatchSelector } from 'connected-react-router';
import PropTypes from 'prop-types';
import { Form, Button, Image, Media, Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { conversationsActions } from '../../../redux/actions/conversations.action';
import { getConversation, getPost } from '../../../redux/reducers/conversations.reducer';
import { getClientUserId } from '../../../redux/reducers/clientUserId.reducer';
import Conversation from '../Conversation';
import ConversationsHeader from '../ConversationsHeader';
import { get, apiValidation, uploadImage } from '../../../Utilities';
import './Post.scss';
import '../Message/Message.scss';

const Post = function ({
  clientUserId,
  conversation,
  match,
  setPost,
  post = { message: { content: {} }, sent_by: {} },
}) {
  const history = useHistory();

  useEffect(() => {
    fetchPosts();
  }, []);

  function fetchPosts() {
    get(null, `/getPostDetails?chat_id=${match.params.id}`).then((res) => {
      const data = apiValidation(res);
      console.log(data);
      setPost({
        id: data.chat_id,
        message: {
          type: 'post',
          content: {
            title: data.title,
            desc: data.text,
            cover: data.attachments_array.length === 0 ? '' : data.attachments_array[0].file_url,
          },
        },
        thumbnail: data.sent_by.display_picture || 'https://i.pravatar.cc/40',
        userIsAuthor: data.sent_by.client_user_id === clientUserId,
        timestamp: data.sent_time,
        username: `${data.sent_by.first_name} ${data.sent_by.last_name}`,
      });
    });
  }

  const postMarkup = () => (
    <div className='post-message'>
      <div className='post-header p-3'>
        <h5 className='post-title'>{post.message.content.title}</h5>
        <p className='post-desc'>{post.message.content.desc}</p>
      </div>
      <Image className='image-message' src={post.message.content.cover} />
      <div className='post-footer d-flex flex-row align-items-center justify-content-between mt-1 pl-3 pr-3'>
        <span className='p-1'>
          <i className='material-icons favorite'>favorite</i> 25
        </span>
        <span className='p-1'>
          <i className='material-icons chat-bubble'>chat_bubble_outline</i> 25
        </span>
        <span className='p-1'>
          <i className='material-icons share'>share</i>
        </span>
      </div>
    </div>
  );

  return (
    <div>
      <ConversationsHeader title='' />
      <>
        <Media as='div' className='p-1 mt-2'>
          <Image src={post.thumbnail} width={30} className='align-self-start' roundedCircle />
          <Media.Body>
            <div className='message-content pt-1 pb-1 pl-2 pr-2'>
              <p className='username'>{post.username}</p>
            </div>
          </Media.Body>
        </Media>
        {postMarkup()}
      </>
    </div>
  );
};

const mapStateToProps = (state) => {
  const matchSelector = createMatchSelector('/posts/:id');

  return {
    conversation: getConversation(state),
    clientUserId: getClientUserId(state),
    post: getPost(state),
    match: matchSelector(state),
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setPost: (post) => {
      dispatch(conversationsActions.setPost(post));
    },
  };
};

Post.propTypes = {
  clientUserId: PropTypes.number.isRequired,
  setPost: PropTypes.func.isRequired,
  post: PropTypes.objectOf({
    id: PropTypes.number.isRequired,
    username: PropTypes.string.isRequired,
    thumbnail: PropTypes.string.isRequired,
    message: PropTypes.objectOf({
      type: PropTypes.string.isRequired,
      content: PropTypes.oneOf([
        PropTypes.string.isRequired,
        PropTypes.objectOf({
          title: PropTypes.string.isRequired,
          desc: PropTypes.string.isRequired,
          cover: PropTypes.string.isRequired,
        }).isRequired,
      ]),
    }).isRequired,
    userIsAuthor: PropTypes.bool,
    timestamp: PropTypes.string.isRequired,
  }).isRequired,
  conversation: PropTypes.objectOf(Conversation).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }),
  }).isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Post);
