import React, { useState, useEffect } from 'react';
import { createMatchSelector } from 'connected-react-router';
import io from 'socket.io-client';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap/Modal';
import Image from 'react-bootstrap/Image';
import Media from 'react-bootstrap/Media';
import Alert from 'react-bootstrap/Alert';
import Carousel from 'react-bootstrap/Carousel';
import { connect } from 'react-redux';
import ChatBubbleOutline from '@material-ui/icons/ChatBubbleOutline';
import GetAppIcon from '@material-ui/icons/GetApp';
import Favorite from '@material-ui/icons/Favorite';
import ReactPlayer from 'react-player';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';
import Share from '@material-ui/icons/Share';
import { conversationsActions } from '../../../redux/actions/conversations.action';
import {
  getConversation,
  getPost,
  getRepliesForComments,
  getSocket,
} from '../../../redux/reducers/conversations.reducer';
import { getClientUserId } from '../../../redux/reducers/clientUserId.reducer';
import { getCurrentBranding } from '../../../redux/reducers/branding.reducer';
import Conversation from '../Conversation';
import ConversationsHeader from '../ConversationsHeader';
import FileIcon from '../../../assets/images/file.svg';
import Comments from './Comments';
import { formatPost, formatReplies } from '../formatter';
import { server, get, shareThis, apiValidation, post as postNetworkCall } from '../../../Utilities';
import './Post.scss';
import '../Message/Message.scss';

const Post = function ({
  clientUserId,
  conversation,
  match,
  setPost,
  setReplies,
  repliesForComments,
  post = {
    message: { content: {} },
    sent_by: {},
    attachments: [],
    reactions: [],
    comments: [],
  },
  socket,
  setSocket,
  currentbranding,
}) {
  const [openImageModal, setOpenImageModal] = useState(false);
  const [modalImage, setModalImage] = useState({});
  const [sliderIndex, setIndex] = useState(0);
  const [postData, setPostData] = useState({});
  const [showCopiedAlert, setShowCopiedAlert] = useState(false);
  const [timestamp, setTimestamp] = useState(null);
  useEffect(() => {
    fetchPost();
    window.addEventListener('hashchange', () => {
      if (window.location.hash !== '#modal') {
        setOpenImageModal(false);
      }
    });
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket?.emit('user-connected', { client_user_id: clientUserId });
    socket?.on('socket-connected', () => {
      socket.emit('user-connected', { client_user_id: clientUserId });
    });
    socket?.on('connect', () => console.log('connected'));
    // socket?.on('disconnect', connectAgain);

    /* eslint-disable */
  }, [socket]);

  useEffect(() => {
    if (post.reactions.length) {
      console.log(post);
      socket?.on('postReactions', addSocketReactionToPost);
      socket?.on('postComments', (dataa) => console.log(dataa, 'someone commented'));
    }
    socket?.emit('joinPost', { chat_id: post.id }, (data, err) => {
      if (data) console.log(data, 'post joined');
      if (err) console.log(err, 'post joined error');
    });

    return () => {
      socket?.off('postComments', (dataa) => console.log(dataa, 'someone commented'));
      socket?.emit('leavePost', { chat_id: post.id });
      socket?.off('postReactions', (dataa) => console.log(dataa, 'someone reacted'));
    };
  }, [post.reactions]);

  const connectAgain = () => {
    // console.log(socket.id, 'disconnected');
    const sockett = io(server, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
    });
    setSocket({ sockett });
  };

  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  };

  const addSocketReactionToPost = (data) => {
    const message = post;
    const { reactions } = message;

    if (reactions.length > 0) {
      reactions[0].count = data.no_of_reactions;
    } else {
      reactions.push({
        count: data.no_of_reactions,
        id: 1,
        name: 'like',
        url: 'abc.com',
      });
    }

    post.reactions = reactions;
    setPost(message);
  };

  const reactToMessage = function (messageId, userHasReacted) {
    postNetworkCall(
      {
        reaction_id: 1,
        client_user_id: clientUserId,
        chat_id: messageId,
        conversation_id: conversation.id,
      },
      '/addReactionToChat',
    )
      .then((res) => {
        console.log(res);
        const message = post;
        const { reactions } = message;

        if (!userHasReacted) {
          message.userHasReacted = true;
        } else {
          message.userHasReacted = false;
        }

        post.reactions = reactions;
        setPost(message);
      })
      .catch((e) => {
        console.error(e);
      });
  };

  function fetchPost() {
    get(null, `/getPostDetails?chat_id=${match.params.id}&client_user_id=${clientUserId}`).then(
      (res) => {
        const data = apiValidation(res);
        console.log(data, 'postDetailss');
        setPost(formatPost(data, clientUserId));
        setPostData(data);
        const d = new Date(+data.created_at * 1000);

        setTimestamp(`${d.toString().split(' ').slice(1, 5).join(' ')}`);
      },
    );
  }

  const findOrReplaceRepliesForComment = (commentId, data) => {
    const repliesCopy = repliesForComments;
    const index = repliesCopy.findIndex((repliesObj) => repliesObj.commentId === commentId);
    console.log(index, 'index');
    if (index < 0) {
      repliesCopy.push(data);
    } else {
      repliesCopy.splice(index, 1, data);
    }

    setReplies(repliesCopy);
  };

  function fetchReplies(commentId) {
    get(
      null,
      `/getRepliesOfComment?post_comments_id=${commentId}&client_user_id=${clientUserId}`,
    ).then((res) => {
      const data = apiValidation(res);
      console.log(data);
      findOrReplaceRepliesForComment(commentId, {
        list: formatReplies(data, clientUserId),
        commentId,
      });
    });
  }

  const onReaction = (reactionComment, index, type) => {
    const { reactions } = reactionComment;

    if (!reactionComment.hasUserReacted) {
      if (reactions.length > 0) {
        reactions[0].no_of_reactions += 1;
      } else {
        reactions.push({
          no_of_reactions: 1,
          id: 1,
          name: 'like',
          url: 'abc.com',
        });
      }
      reactionComment.hasUserReacted = true;
    } else {
      reactionComment.hasUserReacted = false;
      reactions[0].no_of_reactions -= 1;
    }

    if (type === 'comment') {
      reactionComment.reactions = reactions;
      const { comments } = post;
      console.log(comments);
      comments.splice(index, 1, reactionComment);
      setPost(post);
    } else {
      const repliesIndex = repliesForComments.findIndex(
        (repliesObj) => repliesObj.commentId === reactionComment.post_comments_post_comments_id,
      );
      const replies = repliesForComments[repliesIndex];
      replies.list.splice(index, 1, reactionComment);
      repliesForComments.splice(repliesIndex, 1, replies);
      setReplies(repliesForComments);
    }
  };

  const onAddReply = (data) => {
    const repliesCopy = repliesForComments;
    const repliesIndex = repliesCopy.findIndex(
      (repliesObj) => repliesObj.commentId === data.post_comments_post_comments_id,
    );
    if (repliesIndex >= 0) {
      const replies = repliesCopy[repliesIndex];
      replies.list.push(data);
    } else {
      repliesCopy.push({ list: [data], commentId: data.post_comments_post_comments_id });
    }
    // const replies = repliesForComments[data.post_comments_id];
    // if (!replies) {
    //   repliesForComments[data.post_comments_id] = [data];
    // } else {
    //   replies.push(data);
    // }

    // repliesForComments[data.post_comments_id] = replies;

    setReplies(repliesCopy);
  };

  const FilePreview = (attachment) => {
    return (
      <div
        className='d-flex align-items-center justify-content-center'
        style={{
          height: '200px',
          border: '1px solid #efefef',
          borderRadius: '5px',
          backgroundColor: 'rgba(239,239,239,1)',
        }}
      >
        <Image src={FileIcon} height='24px' />
        <a href={attachment.file_url}>
          <p className='mb-0 post-title' style={{ fontSize: '16px' }}>
            {attachment.file_name.split('|')[0]}
          </p>
        </a>
      </div>
    );
  };

  const postMarkup = () => {
    const { attachments } = post;
    const reversedAttachments = [];
    for (const i of attachments) {
      reversedAttachments.unshift(i);
    }
    return (
      <div className='post-message'>
        <div className='post-header p-3'>
          <h5 className='post-title'>{post.message.content.title}</h5>
          <p className='post-desc'>{post.message.content.desc}</p>
        </div>
        <p className='sliderCount'>
          {sliderIndex + 1}/{reversedAttachments.length}
        </p>
        <Carousel nextIcon={null} prevIcon={null} activeIndex={sliderIndex} onSelect={handleSelect}>
          {attachments.map((a) => (
            <Carousel.Item className='text-center'>
              {a.file_type === 'image' ? (
                <Image
                  onClick={() => {
                    setModalImage(a);
                    setOpenImageModal(true);
                    window.location.hash = 'modal';
                  }}
                  className='image-message'
                  src={a.file_url}
                />
              ) : a.file_type === 'file' &&
                post.message.content.cover.slice(
                  post.message.content.cover.length - 4,
                  post.message.content.cover.length,
                ) === '.mp4' /* eslint-disable */ ? (
                <ReactPlayer
                  className='video-message'
                  controls
                  url={[{ src: post.message.content.cover, type: 'video/mp4' }]}
                  width='100%'
                  height='280px'
                />
              ) : (
                FilePreview(a)
              )}
            </Carousel.Item>
          ))}
        </Carousel>

        <div
          className={`post-footer d-flex flex-row align-items-center ${
            post.message.reactionsEnabled === 'true' || post.message.commentsEnabled === 'true'
              ? 'justify-content-between'
              : 'justify-content-center'
          } mt-1 pl-3 pr-3`}
        >
          {post.message.reactionsEnabled === 'true' ? (
            <span className='p-1'>
              <i
                role='button'
                tabIndex={0}
                onKeyPress={(e) => e.key === 13 && reactToMessage(post.id, post.userHasReacted)}
                onClick={() => reactToMessage(post.id, post.userHasReacted)}
              >
                {post.userHasReacted ? (
                  <Favorite className='material-icons red' />
                ) : (
                  <FavoriteBorder className='material-icons grey' />
                )}
              </i>
              {post.reactions.length > 0 && post.reactions[0].count}
              {post.reactions.length === 0 && 0}
            </span>
          ) : null}
          {post.message.commentsEnabled === 'true' ? (
            <span className='p-1'>
              <>
                {' '}
                <ChatBubbleOutline className='material-icons chat-bubble' /> {post.comments.length}
              </>
            </span>
          ) : null}

          <span style={{ cursor: 'pointer' }} onClick={sharePost} className='p-1'>
            <Share className='material-icons share' />
          </span>
        </div>
      </div>
    );
  };

  const a = (list) =>
    setPost({
      ...post,
      comments: list,
    });

  const sharePost = () => {
    console.log(currentbranding);
    const url = `${window.location.origin}/posts/${postData.chat_id}`;
    const username = `${postData.sent_by.first_name} ${postData.sent_by.last_name}`;
    const title = `${username} has shared a post on \n${currentbranding.branding.client_name}`;
    const text = `${postData.title} \n${postData.text} \n\nTo view more details of the discussion visit: \n${url}`;
    // eslint-disable-next-line
    const hasShared = shareThis(url, text, title);
    console.log(title, text);
    if (hasShared === 'clipboard') {
      setShowCopiedAlert(true);
      console.log('copied');
    }
    setTimeout(() => {
      setShowCopiedAlert(false);
    }, 3000);
  };

  return (
    <div>
      <Alert
        className='alert'
        style={showCopiedAlert ? { top: '10px' } : {}}
        key={1}
        variant='secondary'
        onClose={() => setShowCopiedAlert(false)}
        dismissible
      >
        Link has been copied to clipboard
      </Alert>
      <ConversationsHeader title='' />
      <>
        <div style={{ width: '95%' }} className='d-flex justify-content-between align-items-center'>
          <Media as='div' className='p-1 pl-3 mt-2'>
            <Image
              src={post.thumbnail}
              width={40}
              height={40}
              className='align-self-start'
              roundedCircle
            />
            <Media.Body>
              <div className='message-content pt-1 pb-1 pl-2 pr-2'>
                <p className='username'>{post.username}</p>
              </div>
            </Media.Body>
          </Media>
          <p style={{ fontSize: '12px', marginBottom: '0px' }}>{timestamp}</p>
        </div>
        {postMarkup()}
        {post.message.commentsEnabled === 'true' ? (
          <Comments
            clientUserId={clientUserId}
            postId={post.id}
            list={post.comments}
            onCommentUpdate={(list) => a(list)}
            thumbnail={post.thumbnail}
            username={post.username}
            onFetchReplies={fetchReplies}
            repliesForComments={repliesForComments}
            onReaction={onReaction}
            onAddReply={onAddReply}
          />
        ) : null}
      </>
      <Modal
        show={openImageModal}
        onHide={() => setOpenImageModal(false)}
        centered
        className='d-flex justify-content-center'
      >
        <img style={{ maxHeight: '80vh', maxWidth: '80vw' }} src={modalImage.file_url} />

        <Modal.Footer>
          <a href={modalImage.file_url}>
            <GetAppIcon />
          </a>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

const mapStateToProps = (state) => {
  const matchSelector = createMatchSelector('/posts/:id');

  return {
    conversation: getConversation(state),
    clientUserId: getClientUserId(state),
    currentbranding: getCurrentBranding(state),
    post: getPost(state),
    match: matchSelector(state),
    repliesForComments: getRepliesForComments(state),
    socket: getSocket(state),
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setPost: (post) => {
      dispatch(conversationsActions.setPost(post));
    },
    setReplies: (post) => {
      dispatch(conversationsActions.setReplies(post));
    },
    setSocket: (payload) => {
      dispatch(conversationsActions.setSocket(payload));
    },
  };
};

Post.propTypes = {
  clientUserId: PropTypes.number.isRequired,
  setPost: PropTypes.func.isRequired,
  currentbranding: PropTypes.instanceOf(Object).isRequired,
  setReplies: PropTypes.func.isRequired,
  repliesForComments: PropTypes.shape([]),
  post: PropTypes.shape({
    id: PropTypes.number.isRequired,
    username: PropTypes.string.isRequired,
    thumbnail: PropTypes.string.isRequired,
    message: PropTypes.shape({
      type: PropTypes.string.isRequired,
      content: PropTypes.shape([
        PropTypes.string.isRequired,
        PropTypes.shape({
          title: PropTypes.string.isRequired,
          desc: PropTypes.string.isRequired,
          cover: PropTypes.string.isRequired,
        }).isRequired,
      ]),
    }).isRequired,
    userIsAuthor: PropTypes.bool,
    timestamp: PropTypes.string.isRequired,
  }).isRequired,
  conversation: PropTypes.instanceOf(Object).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }),
  }).isRequired,
  socket: PropTypes.instanceOf(Object).isRequired,
  setSocket: PropTypes.func.isRequired,
};

Post.defaultProps = {
  repliesForComments: [],
};

export default connect(mapStateToProps, mapDispatchToProps)(Post);
