import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import PlyrComponent from 'plyr-react';
import 'plyr-react/dist/plyr.css';
import { PageHeader } from '../PageHeader/PageHeader';

const PlyrVideoPlayer = (props) => {
  const { match, history } = props;
  const options = {
    autoplay: true,
    youtube: { noCookie: false, rel: 0, showinfo: 0, iv_load_policy: 3, modestbranding: 1 },
  };
  const [source, setSource] = useState({
    type: 'video',
    sources: [
      {
        src: 'PVt1MNXss-Y',
        provider: 'youtube',
      },
    ],
  });

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
    } else {
      const { id } = match.params;
      console.log(id);
      const newSource = JSON.parse(JSON.stringify(source));
      newSource.sources = [{ src: id, provider: 'youtube' }];
      setSource(newSource);
    }
  }, [history, match]);

  return (
    <div>
      <PageHeader transparent />
      <PlyrComponent source={source} options={options} />
    </div>
  );
};

export default PlyrVideoPlayer;

PlyrVideoPlayer.propTypes = {
  match: PropTypes.instanceOf(Object).isRequired,
  history: PropTypes.instanceOf(Object).isRequired,
};
