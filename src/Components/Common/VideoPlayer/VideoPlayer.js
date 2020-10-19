import React, { useCallback, useEffect, useState, useRef } from 'react';
import ProgressBar from 'react-bootstrap/ProgressBar';
import './VideoPlayer.scss';

export const VideoPlayer = (props) => {
  const { link } = props;
  const [progress, setProgress] = useState(0);
  const player = useRef(null);
  const timeUpdateInterval = useRef(0);

  const formatTime = (time) => {
    time = Math.round(time);

    const minutes = Math.floor(time / 60);
    let seconds = time - minutes * 60;

    seconds = seconds < 10 ? `0${seconds}` : seconds;

    return `${minutes}:${seconds}`;
  };

  const updateTimerDisplay = () => {};
  const updateProgressBar = () => {
    setProgress((player.current.getCurrentTime() / player.current.getDuration()) * 100);
  };

  const initialize = useCallback(() => {
    // Update the controls on load
    updateTimerDisplay();
    updateProgressBar();

    // Clear any old interval.
    clearInterval(timeUpdateInterval.current);

    // Start interval to update elapsed time display and
    // the elapsed part of the progress bar every second.
    timeUpdateInterval.current = setInterval(() => {
      updateTimerDisplay();
      updateProgressBar();
    }, 1000);
  }, []);

  const loadVideo = useCallback(() => {
    // the Player object is created uniquely based on the id in props
    player.current = new window.YT.Player('video-placeholder', {
      width: '100%',
      height: '80%',
      videoId: link,
      playerVars: {
        color: 'white',
      },
      events: {
        onReady: initialize,
      },
    });
  }, [initialize, link]);

  useEffect(() => {
    if (!window.YT) {
      // If not, load the script asynchronously
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';

      // onYouTubeIframeAPIReady will load the video after the script is loaded
      window.onYouTubeIframeAPIReady = loadVideo;

      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    } else {
      // If script is already there, load the video directly
      loadVideo();
    }
  }, [loadVideo]);

  const changeProgress = (e) => {
    // Calculate the new time for the video.
    // new time in seconds = total duration in seconds * ( value of range input / 100 )
    const newTime = player.current.getDuration() * (e.target.value / 100);

    // Skip video to new time.
    player.current.seekTo(newTime);
    console.log(e.target.value);
    setProgress(e.target.value);
  };

  return (
    <>
      <div id='video-placeholder'>Loading...</div>
      <ProgressBar
        animated
        now={progress}
        variant='danger'
        label={progress}
        onMouseUp={(e) => changeProgress(e)}
        onTouchEnd={(e) => changeProgress(e)}
      />
    </>
  );
};
