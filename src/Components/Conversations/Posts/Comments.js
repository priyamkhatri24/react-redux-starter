import React, { useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import Media from 'react-bootstrap/Media';
import Image from 'react-bootstrap/Image';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import PropTypes from 'prop-types';
import Send from '@material-ui/icons/Send';
import Close from '@material-ui/icons/Close';
import Favorite from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';
import { getUserProfile } from '../../../redux/reducers/userProfile.reducer';
import { post } from '../../../Utilities';
import './Comments.scss';

/* eslint-disable */

const Comments = function ({
  clientUserId,
  postId,
  list,
  onCommentUpdate,
  username,
  thumbnail,
  onFetchReplies,
  repliesForComments,
  onReaction,
  onAddReply,
}) {
  const [comment, setComment] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [showReplies, setShowReplies] = useState({});
  const userProfile = useSelector((state) => getUserProfile(state));
  const commentInputRef = useRef(null);

  const getRepliesForComment = (commentId) =>
    repliesForComments.find((repliesObject) => repliesObject.commentId === commentId);

  const reactToComment = function (reactionComment, index, type) {
    post(
      {
        reaction_id: 1,
        client_user_id: clientUserId,
        post_comments_id: reactionComment.post_comments_id,
      },
      '/addReactionToComment',
    )
      .then((res) => {
        console.log(res);
        onReaction(reactionComment, index, type);
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const addComment = () => {
    // post_comments_post_comments_id - comment_id
    // post_comments_id - id

    const data = {
      chat_id: postId,
      comment_text: comment,
      client_user_id: clientUserId,
      parent_comment_id: null,
    };

    if (replyingTo && replyingTo.post_comments_id) {
      data.parent_comment_id = replyingTo.post_comments_id;
    }

    // if (replyingTo && replyingTo.post_comments_post_comments_id) {
    //   data.parent_comment_id = replyingTo.post_comments_post_comments_id;
    // } else if (replyingTo && replyingTo.post_comments_id) {
    //   data.parent_comment_id = replyingTo.post_comments_id;
    // }

    if (replyingTo) {
      setShowReplies({
        ...showReplies,
        [replyingTo.post_comments_id]: true || false,
      });
    } else {
      setShowReplies({
        ...showReplies,
      });
    }

    if (replyingTo && !showReplies[replyingTo.post_comments_id]) {
      onFetchReplies(data.parent_comment_id);
    }

    post(data, '/addCommentToPost').then((res) => {
      setComment('');
      console.log('replyingTo', replyingTo);
      if (replyingTo && data.parent_comment_id) {
        onAddReply({
          comment_text: comment,
          hasUserReacted: false,
          client_user_id: clientUserId,
          post_comments_id: res.post_comments_id,
          post_comments_post_comments_id: data.parent_comment_id,
          reactions: [],
          sent_by: {
            first_name: userProfile.firstName,
            last_name: userProfile.lastName,
            display_picture: userProfile.profileImage,
            client_user_id: clientUserId,
          },
        });
      } else {
        const newList = [...list];
        newList.unshift({
          comment_text: comment,
          hasUserReacted: false,
          client_user_id: clientUserId,
          post_comments_id: res.post_comments_id,
          chat_id: postId,
          reactions: [],
          sent_by: {
            first_name: userProfile.firstName,
            last_name: userProfile.lastName,
            display_picture: userProfile.profileImage,
            client_user_id: clientUserId,
          },
        });
        onCommentUpdate(newList);
      }
      setReplyingTo(null);
    });
  };

  const commentsMarkup = () => {
    console.log(list, 'commentssss');
    return (
      <div className='mt-3 pb-5'>
        {list.map((c, index) => (
          <Media as='div' className='mb-2 comment'>
            <Image
              src={
                c.sent_by.display_picture ||
                'https://s3.ap-south-1.amazonaws.com/question-images-ingenium/1631183013255.png'
              }
              width={30}
              height={30}
              className='align-self-start mr-1 mt-2'
              roundedCircle
            />

            <Media.Body>
              <div className='pt-1 pb-1 pl-2 pr-2' style={{ maxWidth: '90%' }}>
                <p className='author-username'>
                  {c.sent_by.first_name} {c.sent_by.last_name}
                </p>
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
              <div className='justify-content-end d-flex mb-2'>
                <span
                  className='p-1 mr-3 redgrayiconcontainer'
                  role='button'
                  tabIndex={0}
                  onKeyPress={(e) => e.key === 13 && reactToComment(c, index, 'comment')}
                  onClick={() => reactToComment(c, index, 'comment')}
                >
                  {c.hasUserReacted ? (
                    <Favorite className='material-icons red' />
                  ) : (
                    <FavoriteBorder className='material-icons grey' />
                  )}
                  {c.reactions.length > 0 && c.reactions[0].no_of_reactions}
                  {c.reactions.length === 0 && 0}
                </span>

                <Button
                  variant='link p-0 m-0'
                  className='like-btn'
                  onClick={() => {
                    setReplyingTo(c);
                    if (commentInputRef && commentInputRef.current) {
                      commentInputRef.current.focus();
                    }
                  }}
                >
                  Reply
                </Button>
              </div>

              {showReplies[c.post_comments_id] && (
                <div className='replies'>
                  {getRepliesForComment(c.post_comments_id) &&
                    getRepliesForComment(c.post_comments_id).list.map((reply, replyIndex) => (
                      <Media as='div' className='mb-2'>
                        <Col xs={1}>
                          <Image
                            src={
                              reply.sent_by.display_picture ||
                              'https://s3.ap-south-1.amazonaws.com/question-images-ingenium/1631183013255.png'
                            }
                            width={30}
                            height={30}
                            className='align-self-start mr-1 mt-2'
                            roundedCircle
                          />
                        </Col>
                        <Col xs={11}>
                          <Media.Body>
                            <div className='pt-1 pb-1 pl-2 pr-2' style={{ maxWidth: '90%' }}>
                              <p className='author-username'>
                                {reply.sent_by.first_name} {reply.sent_by.last_name}
                              </p>
                              <div
                                style={{
                                  fontSize: '12px',
                                  marginBottom: '0px',
                                  whiteSpace: 'break-spaces',
                                  fontFamily: 'Montserrat-Regular',
                                }}
                              >
                                {reply.comment_text}
                              </div>
                            </div>
                            <div className='justify-content-end d-flex'>
                              <span
                                className='p-1 mr-3'
                                role='button'
                                tabIndex={0}
                                onKeyPress={(e) =>
                                  e.key === 13 && reactToComment(reply, replyIndex, 'reply')
                                }
                                onClick={() => reactToComment(reply, replyIndex, 'reply')}
                              >
                                {reply.hasUserReacted ? (
                                  <Favorite className='material-icons red' />
                                ) : (
                                  <FavoriteBorder className='material-icons grey' />
                                )}
                                {reply.reactions.length > 0 && reply.reactions[0].no_of_reactions}
                                {reply.reactions.length === 0 && 0}
                              </span>

                              {/* <Button
                            variant='link p-0 m-0'
                            className='like-btn'
                            onClick={() => setReplyingTo(reply)}
                          >
                            Reply
                          </Button> */}
                            </div>
                          </Media.Body>
                        </Col>
                      </Media>
                    ))}
                </div>
              )}

              {c.no_of_replies > 0 && (
                <div className=''>
                  <Button
                    className='reply-btn'
                    variant='link p-0 m-0'
                    onClick={() => {
                      setShowReplies({
                        ...showReplies,
                        [c.post_comments_id]: !showReplies[c.post_comments_id] || false,
                      });
                      if (!showReplies[c.post_comments_id]) {
                        onFetchReplies(c.post_comments_id);
                      }
                    }}
                  >
                    {showReplies[c.post_comments_id] ? 'Hide' : 'Show'} Replies
                  </Button>
                </div>
              )}
              <div style={{ visibility: 'hidden', height: '20px' }} />
            </Media.Body>
          </Media>
        ))}
      </div>
    );
  };

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
            <Close className='material-icons' />
          </Button>
        </div>
      )}
      <Form
        onSubmit={(e) => {
          e.preventDefault();
          addComment();
        }}
        className='p-2 d-flex align-items-center'
        style={{ width: '100%' }}
      >
        <FormControl
          placeholder='Type a comment'
          as='input'
          style={{ width: '90%' }}
          id='comment-input'
          aria-label='Input field for your comment'
          value={comment}
          ref={commentInputRef}
          onChange={(e) => setComment(e.target.value)}
        />
        <Button disabled={!comment} className='rounded-btn ml-2' onClick={() => addComment()}>
          <Send className='material-icons' />
        </Button>
      </Form>
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
  onFetchReplies: PropTypes.func.isRequired,
  onReaction: PropTypes.func.isRequired,
  onAddReply: PropTypes.func.isRequired,
  repliesForComments: PropTypes.shape({}),
};

Comments.defaultProps = {
  repliesForComments: {},
};

export default Comments;
