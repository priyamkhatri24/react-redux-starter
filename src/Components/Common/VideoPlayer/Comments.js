import React, { useEffect, useState, useRef, useCallback } from 'react';
import format from 'date-fns/format';
import fromUnixTime from 'date-fns/fromUnixTime';
import { connect } from 'react-redux';
import Button from 'react-bootstrap/Button';
import CheckIcon from '@material-ui/icons/Check';
import PropTypes from 'prop-types';
import { apiValidation, get, post, getNoPushToError } from '../../../Utilities';
import { getClientUserId } from '../../../redux/reducers/clientUserId.reducer';

const Comments = (props) => {
  const { clientUserId, videoId } = props;
  const [comments, setComments] = useState([]);
  const [currentInput, setCurrentInput] = useState('');

  const end = useRef(null);
  const commentLength = useRef(0);

  const scrollToBottom = () => {
    end.current.scrollIntoView({ behavior: 'smooth' });
  };

  const getComments = useCallback(() => {
    let result = [];
    if (videoId) {
      getNoPushToError({ video_id: videoId }, '/getCommentsOfVideo').then((res) => {
        result = apiValidation(res);
        if (result) {
          setComments(result);
        }
        if (commentLength.current !== result.length) {
          // scrollToBottom();
          commentLength.current = result.length;
        }

        console.log(result, 'commnetsss');
      });
    }
  }, [videoId, apiValidation, commentLength]);

  useEffect(() => {
    const clear = setInterval(() => {
      getComments();
    }, 3000);

    return () => clearInterval(clear);
  }, [getComments]);

  const addComment = () => {
    const payload = {
      client_user_id: clientUserId,
      video_id: videoId,
      chat_text: currentInput,
    };

    post(payload, '/addComment').then((res) => {
      console.log(res);
      setCurrentInput('');
    });
  };

  return (
    <div
      className='d-flex m-2'
      id='messages'
      style={{ flexDirection: 'column', height: '58vh', overflow: 'scroll' }}
    >
      {comments.length > 0 ? (
        comments.map((e) => {
          return (
            <div
              key={e.video_chat_id}
              className={
                e.client_user_id === clientUserId ? 'd-flex m-2 flex-row-reverse' : 'd-flex m-2'
              }
            >
              <img
                src={e.profile_image}
                alt='profile'
                width='40'
                height='40'
                style={{ borderRadius: '40px' }}
                className='my-auto'
              />
              <div className='d-flex mx-2' style={{ flexDirection: 'column' }}>
                <span style={{ fontFamily: 'Montserrat-Regular', fontSize: '10px' }}>
                  {`${e.first_name} ${e.last_name}`}
                </span>
                <span
                  style={{
                    backgroundColor:
                      e.client_user_id === clientUserId
                        ? 'var(--primary-blue)'
                        : 'rgba(236, 236, 236, 1)',
                    borderRadius: '5px',
                    padding: '10px',
                    textAlign: 'center',
                    fontSize: '12px',
                    fontFamily: 'Montserrat-Regular',
                    textTransform: 'capitalize',
                    color: e.client_user_id === clientUserId ? '#fff' : 'rgba(0, 0, 0, 0.87)',
                  }}
                >
                  {e.chat_text}
                </span>
                <span style={{ fontFamily: 'Montserrat-Regular', fontSize: '10px' }}>
                  {format(fromUnixTime(e.created_at), 'kk:m MMM dd, yyyy')}
                </span>
              </div>
            </div>
          );
        })
      ) : (
        <p style={{ fontFamily: 'Montserrat-SemiBold' }}>No comments to show</p>
      )}
      <div ref={end} />
      <footer style={{ position: 'fixed', bottom: '20px', width: '100%' }}>
        <div className='d-flex justify-content-between mx-2'>
          <label className='has-float-label my-auto w-75'>
            <input
              className='form-control'
              name='Comments'
              type='text'
              placeholder='Comments'
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
            />
            <span>Comments</span>
          </label>
          <Button variant='customPrimarySmol' className='mr-2' onClick={() => addComment()}>
            <CheckIcon />
          </Button>
        </div>
      </footer>
    </div>
  );
};

const mapStateToProps = (state) => ({
  clientUserId: getClientUserId(state),
});

export default connect(mapStateToProps)(Comments);

Comments.propTypes = {
  clientUserId: PropTypes.number.isRequired,
  videoId: PropTypes.number.isRequired,
};
