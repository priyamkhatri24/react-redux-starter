import React, { useEffect, useState, useRef, useMemo } from 'react';
import PropTypes from 'prop-types';
import PlyrComponent from 'plyr-react';
import 'plyr-react/dist/plyr.css';
import { PageHeader } from '../PageHeader/PageHeader';
import Comments from './Comments';
import './VideoPlayer.scss';

const PlyrVideoPlayer = (props) => {
  const { match, history } = props;
  const options = {
    autoplay: true,
    youtube: { noCookie: false, rel: 0, showinfo: 0, iv_load_policy: 3, modestbranding: 1 },
  };
  const [quality, setQuality] = useState(480);
  const [expandedNote, setExpandedNote] = useState(false);
  const [linkArray, setLinkArray] = useState('');
  const [currentTime, setCurrentTime] = useState(0);
  const [source, setSource] = useState({
    type: 'video',
    sources: [
      {
        src: 'https://ingenium-userfiles.s3.ap-south-1.amazonaws.com/sample_960x540.m4v',
      },
    ],
  });
  const [videoId, setVideoId] = useState('');
  const playerRef = useRef(null);

  useEffect(() => {
    let timer;
    const arr = history.location.state?.videoLinkArray;
    if (!arr) return;
    if (playerRef && playerRef.current && arr) {
      console.log(playerRef.current.plyr);
      /* eslint-disable */
      playerRef.current.plyr.config.quality = {
        default: 'Normal',
        forced: true,
        selected: 'Normal',
        onChange: function (e) {
          this.selected = e;
          console.log(e);
          setQuality(e);
        },
        options: [360, 480, 240],
      };
    }
  }, [playerRef]);

  useEffect(() => {
    const arr = history.location.state?.videoLinkArray;
    let timer;
    if (!arr) return;
    if (quality === 360) {
      const newSource = JSON.parse(JSON.stringify(source));
      newSource.sources = [{ src: arr[1] || arr[0] }];
      setSource(newSource);
    } else if (quality === 240) {
      const newSource = JSON.parse(JSON.stringify(source));
      newSource.sources = [{ src: arr[2] || arr[0] }];
      setSource(newSource);
    } else {
      const newSource = JSON.parse(JSON.stringify(source));
      newSource.sources = [{ src: arr[0] }];
      setSource(newSource);
    }
    playerRef.current.plyr.once('play', () => {
      playerRef.current.plyr.currentTime = currentTime;
      timer = setInterval(() => {
        setCurrentTime(playerRef.current.plyr.currentTime);
      }, 1000);
    });

    return () => {
      clearInterval(timer);
    };
  }, [quality]);

  useEffect(() => {
    if (history.location.state && history.location.state.link) {
      const newSource = JSON.parse(JSON.stringify(source));
      newSource.sources = [{ src: history.location.state.link, provider: 'youtube' }];
      setSource(newSource);
    } else if (history.location.state && history.location.state.videoLink) {
      const newSource = JSON.parse(JSON.stringify(source));
      newSource.sources = [{ src: history.location.state.videoLink }];
      console.log(newSource);
      setSource(newSource);
      setLinkArray(history.location.state.videoLinkArray);
      console.log(history.location.state);
    } else {
      const { id } = match.params;
      console.log(id);
      const newSource = JSON.parse(JSON.stringify(source));
      newSource.sources = [{ src: id, provider: 'youtube' }];
      setSource(newSource);
    }
  }, [history, match]);

  useEffect(() => {
    if (history.location.state && history.location.state.videoId)
      setVideoId(history.location.state.videoId);
  }, [history]);

  useEffect(() => {
    document.addEventListener('keydown', function (e) {
      if (e.code === 'Tab') {
        console.log('tab');
        window.location.reload();
      }
    });
  });

  const renderVideoPlayer = useMemo(() => {
    return (
      <div className='mx-auto plyrComponent'>
        <PlyrComponent ref={playerRef} source={source} options={options} />
      </div>
    );
  }, [source, playerRef]);

  return (
    <>
      <PageHeader transparent />
      <div className='plyrComponent__overall'>
        {renderVideoPlayer}
        {expandedNote ? (
          <p
            onClick={() => setExpandedNote(false)}
            className='plyrComponent__noteBelowVideo mx-3 my-2'
          >
            <span className='boldNote'>NOTE :</span> If video does not appear, try to change the
            video quality to 360p or 240p while we convert the current video quality in a supported
            format, this process may take few minutes.
          </p>
        ) : (
          <p
            onClick={() => setExpandedNote(true)}
            className='plyrComponent__noteBelowVideo mx-3 my-2'
          >
            <span className='boldNote'>NOTE:</span> If video does not appear...
          </p>
        )}
        {videoId && <Comments videoId={videoId} />}
      </div>
    </>
  );
};

export default PlyrVideoPlayer;

PlyrVideoPlayer.propTypes = {
  match: PropTypes.instanceOf(Object).isRequired,
  history: PropTypes.instanceOf(Object).isRequired,
};
