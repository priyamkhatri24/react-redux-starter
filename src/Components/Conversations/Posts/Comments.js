import React, { useState } from 'react';
import {
  Row,
  Col,
  FormControl,
  Button,
  Media,
  Image,
  DropdownButton,
  Dropdown,
  ButtonGroup,
  Modal,
} from 'react-bootstrap';
import PropTypes from 'prop-types';
import { get, apiValidation, post } from '../../../Utilities';
import './Comments.scss';

const Comments = function ({ clientUserId, postId, list, onCommentUpdate, username, thumbnail }) {
  const [comment, setComment] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);

  const reactToComment = function (commentId, userHasReacted) {
    post(
      {
        reaction_id: 1,
        client_user_id: clientUserId,
        post_comments_id: commentId,
      },
      '/addReactionToComment',
    )
      .then((res) => {
        console.log(res);
        // const newConversation = { ...conversation };
        // const { messages } = newConversation;
        // const index = messages.findIndex((message) => message.id === messageId);
        // const message = messages[index];
        // const { reactions } = message;

        // if (!userHasReacted) {
        //   if (reactions.length > 0) {
        //     reactions[0].count += 1;
        //   } else {
        //     reactions.push({
        //       count: 1,
        //       id: 1,
        //       name: 'like',
        //       url: 'abc.com',
        //     });
        //   }
        //   message.userHasReacted = true;
        // } else {
        //   message.userHasReacted = false;
        //   reactions[0].count -= 1;
        // }

        // message.reactions = reactions;
        // messages[index] = message;
        // setConversation(newConversation);
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const addComment = ({ post_comments_id: commentId }) => {
    post(
      {
        comment_text: comment,
        client_user_id: clientUserId,
        parent_comment_id: commentId,
        chat_id: postId,
      },
      '/addCommentToPost',
    ).then((res) => {
      setComment('');
      setReplyingTo(null);
      if (commentId) {
        console.log(commentId);
      } else {
        const newList = [...list];
        newList.push({
          comment_text: comment,
          client_user_id: clientUserId,
          parent_comment_id: null,
          chat_id: postId,
          sent_by: {},
        });
        onCommentUpdate(newList);
      }
    });
  };

  const commentsMarkup = () => (
    <div className='mt-3'>
      {list.map((c) => (
        <Media as='div' className='mb-2'>
          <Image src={thumbnail} width={30} className='align-self-start mr-1 mt-2' roundedCircle />
          <Media.Body>
            <div className='pt-1 pb-1 pl-2 pr-2' style={{ maxWidth: '90%' }}>
              <p className='author-username'>{username}</p>
              <div
                style={{
                  fontSize: '12px',
                  marginBottom: '0px',
                  whiteSpace: 'break-spaces',
                  fontFamily: 'Montserrat-Regular',
                }}
              >
                {c.comment_text}
              </div>
            </div>
            <div className='justify-content-end d-flex'>
              <Button
                variant='link p-0 m-0 mr-5'
                className='like-btn'
                onClick={() => reactToComment(c.post_comments_id, false)}
              >
                Like
              </Button>

              <Button variant='link p-0 m-0' className='like-btn' onClick={() => setReplyingTo(c)}>
                Reply
              </Button>
            </div>
          </Media.Body>
        </Media>
      ))}
      <div style={{ visibility: 'hidden', height: '100px' }} />
    </div>
  );

  const input = () => (
    <div
      className='fixed-bottom d-flex flex-column align-items-center'
      style={{ backgroundColor: '#fff' }}
    >
      {replyingTo && (
        <div className='replying-to p-2 d-flex align-items-center justify-content-between'>
          <span>{replyingTo.comment_text.slice(0, 30)}...</span>
          <Button
            variant='link'
            className='p-0 m-0 d-flex align-items-center'
            onClick={(e) => setReplyingTo(null)}
          >
            <i className='material-icons'>close</i>
          </Button>
        </div>
      )}
      <div className='p-2 d-flex align-items-center' style={{ width: '100%' }}>
        <FormControl
          placeholder='Type a comment'
          as='input'
          style={{ width: '90%' }}
          id='comment-input'
          aria-label='Input field for your comment'
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <Button className='rounded-btn ml-2' onClick={() => addComment(replyingTo)}>
          <i className='material-icons'>send</i>
        </Button>
      </div>
    </div>
  );

  return (
    <div className='container-fluid'>
      {input()}
      {commentsMarkup()}
    </div>
  );
};

Comments.propTypes = {
  list: PropTypes.arrayOf({}).isRequired,
  //   onReactionToMessage: PropTypes.func.isRequired,
  clientUserId: PropTypes.number.isRequired,
  postId: PropTypes.number.isRequired,
  thumbnail: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  onCommentUpdate: PropTypes.func.isRequired,
};

export default Comments;
