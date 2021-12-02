import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import { PageHeader } from '../PageHeader/PageHeader';
import { get, post } from '../../../Utilities/Remote';
import { apiValidation } from '../../../Utilities';
import './AddYoutube.scss';
import { getStudyBinFolderIDArray } from '../../../redux/reducers/studybin.reducer';
import { getClientUserId } from '../../../redux/reducers/clientUserId.reducer';

const AddYoutube = (props) => {
  const { studyBinFolderIdArray, clientUserId } = props;
  const [videoId, setVideoId] = useState('');
  const [videoDuration, setVideoDuration] = useState(0);
  const [key, setKey] = useState('');
  const [youtubeVideo, setYoutubeVideo] = useState({});
  const [isValid, setValid] = useState(false);

  useEffect(() => {
    get(null, '/getGCPCredentials').then((res) => {
      const result = apiValidation(res);
      setKey(result.key);
    });
  }, []);

  const getIdFromUrl = (url) => {
    let vidId = url.split('v=')[1];
    const ampersandPosition = vidId.indexOf('&');
    if (ampersandPosition != -1) {
      vidId = vidId.substring(0, ampersandPosition);
    }
    return vidId;
  };

  const YTDurationToSeconds = (duration) => {
    let match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    match = match.slice(1).map((x) => {
      if (x != null) {
        return x.replace(/\D/, '');
      }
      return x;
    });

    console.log(match);
    /* eslint-disable */
    const hours = parseInt(match[0]) || 0;
    const minutes = parseInt(match[1]) || 0;
    const seconds = parseInt(match[2]) || 0;

    return hours * 3600 + minutes * 60 + seconds;
  };

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
          fetch(
            `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=contentDetails&key=${key}`,
          )
            .then((resp) => resp.json())
            .then((data) => {
              console.log(data);
              const { duration } = data.items[0].contentDetails;
              const inSeconds = YTDurationToSeconds(duration);
              setVideoDuration(inSeconds);
            })
            .catch((err) => console.log(err));
        } else setValid(true);
        console.log(res.data.items[0]);
      });
  };

  const addYoutubeLinkToStudyBin = () => {
    const payload = {
      client_user_id: clientUserId,
      folder_id: studyBinFolderIdArray[studyBinFolderIdArray.length - 1],
      file_name: youtubeVideo.snippet.title,
      file_link: videoId,
      file_type: 'youtube',
    };
    post(payload, '/addFile')
      .then((res) => {
        console.log(res);
      })
      .catch((e) => console.log(e));
  };

  const sendYoutubeData = () => {
    if (!props.history.location.state) {
      addYoutubeLinkToStudyBin();
    }
    const route =
      props.history.location.state && props.history.location.state.goTo === 'addContent'
        ? '/courses/createcourse/addcontent'
        : '/studybin';

    props.history.push({
      pathname: route,
      state: { videoId, title: youtubeVideo.snippet.title, duration: videoDuration },
    });
  };

  const extractVideoId = (e) => {
    if (e.target.value.startsWith('https://www')) {
      setVideoId(getIdFromUrl(e.target.value));
    } else {
      let vid = e.target.value;
      const ampersandPosition = vid.indexOf('&');
      if (ampersandPosition != -1) {
        vid = vid.substring(0, ampersandPosition);
      }
      setVideoId(vid);
    }
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
                  onChange={extractVideoId}
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

const mapStateToProps = (state) => ({
  clientUserId: getClientUserId(state),
  studyBinFolderIdArray: getStudyBinFolderIDArray(state),
});

export default connect(mapStateToProps)(AddYoutube);

AddYoutube.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
    location: PropTypes.shape({
      state: PropTypes.shape({
        goTo: PropTypes.string.isRequired,
      }),
    }),
  }).isRequired,
  clientUserId: PropTypes.number.isRequired,
  studyBinFolderIdArray: PropTypes.instanceOf(Array).isRequired,
};
