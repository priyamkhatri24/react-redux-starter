import React, { useState } from 'react';
import { FormControl, Button, Media, Image } from 'react-bootstrap';
import PropTypes from 'prop-types';
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
    const data = {
      chat_id: postId,
      comment_text: comment,
      client_user_id: clientUserId,
    };

    if (replyingTo && replyingTo.post_comments_post_comments_id) {
      data.parent_comment_id = replyingTo.post_comments_post_comments_id;
    } else if (replyingTo && replyingTo.post_comments_id) {
      data.parent_comment_id = replyingTo.post_comments_id;
    }

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
      onFetchReplies(replyingTo.post_comments_id);
    }

    post(data, '/addCommentToPost').then((res) => {
      setComment('');
      console.log('replyingTo', replyingTo);
      if (replyingTo && replyingTo.post_comments_id) {
        onAddReply({
          comment_text: comment,
          hasUserReacted: false,
          client_user_id: clientUserId,
          post_comments_id: res.post_comments_id,
          post_comments_post_comments_id: replyingTo.post_comments_id,
          reactions: [],
          sent_by: {
            first_name: 'Baddam Admin',
            last_name: '',
            display_picture: null,
            client_user_id: 1801,
          },
        });
      } else {
        const newList = [...list];
        newList.push({
          comment_text: comment,
          hasUserReacted: false,
          client_user_id: clientUserId,
          post_comments_post_comments_id: res.post_comments_id,
          chat_id: postId,
          reactions: [],
          sent_by: {
            first_name: 'Baddam Admin',
            last_name: '',
            display_picture: null,
            client_user_id: 1801,
          },
        });
        onCommentUpdate(newList);
      }
      setReplyingTo(null);
    });
  };

  const commentsMarkup = () => (
    <div className='mt-3 pb-5'>
      {list.map((c, index) => (
        <Media as='div' className='mb-2 comment'>
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
            <div className='justify-content-end d-flex mb-2'>
              <span className='p-1 mr-3'>
                <i
                  className={`material-icons ${c.hasUserReacted ? 'red' : 'grey'}`}
                  role='button'
                  tabIndex={0}
                  onKeyPress={(e) => e.key === 13 && reactToComment(c, index, 'comment')}
                  onClick={() => reactToComment(c, index, 'comment')}
                >
                  {c.hasUserReacted ? 'favorite' : 'favorite_border'}
                </i>
                {c.reactions.length > 0 && c.reactions[0].no_of_reactions}
                {c.reactions.length === 0 && 0}
              </span>

              <Button variant='link p-0 m-0' className='like-btn' onClick={() => setReplyingTo(c)}>
                Reply
              </Button>
            </div>

            {showReplies[c.post_comments_id] && (
              <div className='replies'>
                {getRepliesForComment(c.post_comments_id) &&
                  getRepliesForComment(c.post_comments_id).list.map((reply, replyIndex) => (
                    <Media as='div' className='mb-2'>
                      <Image
                        src={thumbnail}
                        width={30}
                        className='align-self-start mr-1 mt-2'
                        roundedCircle
                      />
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
                            {reply.comment_text}
                          </div>
                        </div>
                        <div className='justify-content-end d-flex'>
                          <span className='p-1 mr-3'>
                            <i
                              className={`material-icons ${reply.hasUserReacted ? 'red' : 'grey'}`}
                              role='button'
                              tabIndex={0}
                              onKeyPress={(e) =>
                                e.key === 13 && reactToComment(reply, replyIndex, 'reply')
                              }
                              onClick={() => reactToComment(reply, replyIndex, 'reply')}
                            >
                              {reply.hasUserReacted ? 'favorite' : 'favorite_border'}
                            </i>
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
                    </Media>
                  ))}
              </div>
            )}
            {c.no_of_replies > 0 && (
              <div className='text-center'>
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
        <Button className='rounded-btn ml-2' onClick={() => addComment()}>
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
  onFetchReplies: PropTypes.func.isRequired,
  onReaction: PropTypes.func.isRequired,
  onAddReply: PropTypes.func.isRequired,
  repliesForComments: PropTypes.shape({}),
};

Comments.defaultProps = {
  repliesForComments: {},
};

export default Comments;
