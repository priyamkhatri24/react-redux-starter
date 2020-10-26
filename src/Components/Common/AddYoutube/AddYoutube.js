import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import { PageHeader } from '../PageHeader/PageHeader';
import { get, apiValidation } from '../../../Utilities';
import './AddYoutube.scss';

export const AddYoutube = (props) => {
  const [videoId, setVideoId] = useState('');
  const [key, setKey] = useState('');
  const [youtubeVideo, setYoutubeVideo] = useState({});
  const [isValid, setValid] = useState(false);

  useEffect(() => {
    get(null, '/getGCPCredentials').then((res) => {
      const result = apiValidation(res);
      setKey(result.key);
    });
  }, []);

  const checkVideoExists = () => {
    axios
      .get('https://www.googleapis.com/youtube/v3/videos', {
        params: {
          key,
          part: 'snippet',
          id: videoId,
        },
      })
      .then((res) => {
        if (res.data.items.length) {
          setYoutubeVideo(res.data.items[0]);
          setValid(false);
        } else setValid(true);
        console.log(res.data.items[0]);
      });
  };

  const sendYoutubeData = () => {
    props.history.push({
      pathname: '/studybin',
      state: { videoId, title: youtubeVideo.snippet.title },
    });
  };

  return (
    <div className='AddYoutube'>
      <PageHeader title='Post Video' />
      <div style={{ marginTop: '5rem' }}>
        <h6 className='text-center mb-3 AddYoutube__heading'>Instructions for posting a video</h6>
        <p className='m-3 AddYoutube__instructions'>
          1.Get the link of any Youtube video you want to post as shown in point 2 below.
        </p>
        <p className='m-3 AddYoutube__instructions'>
          2.https://www.youtube.com/watch?v=<span>w9uWPBDHEKE</span>.
        </p>
        <p className='m-3 AddYoutube__instructions'>
          3.Now get the video id from that link as shown above - highlighted in yellow color -{' '}
          <span>w9uWPBDHEKE</span>.
        </p>
        <p className='m-3 AddYoutube__instructions'>4. Paste that video id in the box below.</p>
        <Card className='LiveClasses__Card mx-auto mt-5 p-3'>
          {!Object.keys(youtubeVideo).length && (
            <>
              <label className='has-float-label my-auto'>
                <input
                  className='form-control'
                  name='Video Id'
                  type='text'
                  placeholder='Video Id'
                  onChange={(e) => setVideoId(e.target.value)}
                />
                <span>Video Id</span>
              </label>
              {isValid && (
                <small className='text-danger d-block'>Please enter a valid Video ID</small>
              )}
              <Button
                variant='boldText'
                className='ml-auto mt-3'
                onClick={() => checkVideoExists()}
              >
                Check
              </Button>
            </>
          )}
          {Object.keys(youtubeVideo).length !== 0 && (
            <>
              <Row className='mb-3'>
                <Col>
                  <img src={youtubeVideo.snippet.thumbnails.default.url} alt='youtube thumbnail' />
                </Col>
                <Col>
                  <p className='ml-1 AddYoutube__title'>{youtubeVideo.snippet.title}</p>
                </Col>
              </Row>
              <small className='ml-auto my-auto AddYoutube__title mt-3'>
                Not the video you wanted?
                <Button variant='redBoldText' onClick={() => setYoutubeVideo({})}>
                  Remove
                </Button>
              </small>
            </>
          )}
        </Card>
        {Object.keys(youtubeVideo).length !== 0 && (
          <Row className='justify-content-center mt-3'>
            <Button variant='customPrimary' onClick={() => sendYoutubeData()}>
              Post!
            </Button>
          </Row>
        )}
      </div>
    </div>
  );
};
