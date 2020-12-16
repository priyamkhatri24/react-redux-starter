import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import ReactPlayer from 'react-player/youtube';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Dropdown from 'react-bootstrap/Dropdown';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import VolumeOffIcon from '@material-ui/icons/VolumeOff';
import VolumeUpIcon from '@material-ui/icons/VolumeUp';
import './VideoPlayer.scss';
import screenfull from 'screenfull';
import { PageHeader } from '../PageHeader/PageHeader';
import { getParams } from '../../../Utilities';

export class VideoPlayer extends Component {
  constructor(props) {
    super(props);
    let fullUrl = 'https://www.youtube.com/watch?v=qxmVVa-9xls';
    if (this.props.location.state) {
      fullUrl = `https://www.youtube.com/watch?v=${this.props.location.state.link}`;
    } else {
      const { id } = this.props.match.params;
      console.log(id);
      fullUrl = `https://www.youtube.com/watch?v=${id}`;
      // if (Object.keys(params).includes('videoId')) fullUrl = params.videoId;
    }

    const width =
      (window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth) - 5;
    const height = (width / 16) * 9;
    this.state = {
      url: fullUrl,
      pip: false,
      playing: true,
      controls: false,
      light: true,
      volume: 0.8,
      muted: false,
      played: 0,
      loaded: 0,
      duration: 0,
      playbackRate: 1.0,
      loop: false,
      width,
      height,
    };
  }

  componentDidMount() {
    window.addEventListener('beforeunload', this.onUnload);
    // if (!this.props.location.state) {
    //   this.props.history.push('/');
    // } else {
    // }
  }

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.onUnload);
  }

  onUnload = (e) => {
    // the method that will be used for both add and remove event
    e.preventDefault();
    e.returnValue = '';
  };

  load = (url) => {
    this.setState({
      url,
      played: 0,
      loaded: 0,
      pip: false,
    });
  };

  handlePlayPause = () => {
    this.setState({ playing: !this.state.playing });
  };

  // handleStop = () => {
  //   this.setState({ url: null, playing: false });
  // };

  handleToggleControls = () => {
    const { url } = this.state;
    this.setState(
      {
        controls: !this.state.controls,
        url: null,
      },
      () => this.load(url),
    );
  };

  handleToggleLight = () => {
    this.setState({ light: !this.state.light });
  };

  handleToggleLoop = () => {
    this.setState({ loop: !this.state.loop });
  };

  handleVolumeChange = (e) => {
    this.setState({ volume: parseFloat(e.target.value) });
  };

  handleToggleMuted = () => {
    this.setState({ muted: !this.state.muted });
  };

  handleSetPlaybackRate = (e) => {
    this.setState({ playbackRate: parseFloat(e.target.value) });
  };

  handleTogglePIP = () => {
    this.setState({ pip: !this.state.pip });
  };

  handlePlay = () => {
    console.log('onPlay');
    this.setState({ playing: true });
  };

  handleEnablePIP = () => {
    console.log('onEnablePIP');
    this.setState({ pip: true });
  };

  handleDisablePIP = () => {
    console.log('onDisablePIP');
    this.setState({ pip: false });
  };

  handlePause = () => {
    console.log('onPause');
    this.setState({ playing: false });
  };

  handleSeekMouseDown = (e) => {
    this.setState({ seeking: true });
  };

  handleSeekChange = (e) => {
    this.setState({ played: parseFloat(e.target.value) });
    this.player.seekTo(parseFloat(e.target.value));
  };

  handleSeekMouseUp = (e) => {
    this.setState({ seeking: false });
    this.player.seekTo(parseFloat(e.target.value));
  };

  handleProgress = (state) => {
    console.log('onProgress', state);
    const width =
      window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    console.log(width);
    // We only want to update time slider if we are not currently seeking
    if (!this.state.seeking) {
      this.setState(state);
    }
  };

  handleEnded = () => {
    console.log('onEnded');
    this.setState({ playing: this.state.loop });
  };

  handleDuration = (duration) => {
    console.log('onDuration', duration);
    this.setState({ duration });
  };

  handleClickFullscreen = () => {
    screenfull.request(findDOMNode(this.player));
  };

  renderLoadButton = (url, label) => {
    return <button onClick={() => this.load(url)}>{label}</button>;
  };

  ref = (player) => {
    this.player = player;
  };

  render() {
    const {
      url,
      playing,
      controls,
      light,
      volume,
      muted,
      loop,
      played,
      loaded,
      duration,
      playbackRate,
      pip,
      height,
      width,
    } = this.state;
    return (
      <>
        <PageHeader title='Video Player' />
        <div style={{ marginTop: '6rem' }}>
          <div className='VideoPlayer__wrapper'>
            <ReactPlayer
              ref={this.ref}
              className='react-player mx-auto'
              width={width}
              height={height}
              url={url}
              pip={pip}
              playing={playing}
              controls={false}
              light={false}
              loop={loop}
              playbackRate={playbackRate}
              volume={volume}
              muted={muted}
              onReady={() => console.log('onReady')}
              onStart={() => console.log('onStart')}
              onPlay={this.handlePlay}
              onEnablePIP={this.handleEnablePIP}
              onDisablePIP={this.handleDisablePIP}
              onPause={this.handlePause}
              onBuffer={() => console.log('onBuffer')}
              onSeek={(e) => console.log('onSeek', e)}
              onEnded={this.handleEnded}
              onError={(e) => console.log('onError', e)}
              onProgress={this.handleProgress}
              onDuration={this.handleDuration}
            />
          </div>
          <Row className='mt-5 ml-1'>
            <Col xs={2} className='p-0 text-center'>
              <Button variant='dashboardBlueOnWhite' onClick={this.handlePlayPause}>
                {playing ? (
                  <span>
                    <PauseIcon />
                  </span>
                ) : (
                  <PlayArrowIcon />
                )}
              </Button>
            </Col>
            <Col xs={7} className='my-auto text-center'>
              <div className='rangeStyle'>
                <input
                  type='range'
                  min={0}
                  max={0.999999}
                  step='any'
                  value={played}
                  onMouseDown={this.handleSeekMouseDown}
                  onChange={this.handleSeekChange}
                  onMouseUp={this.handleSeekMouseUp}
                  className='VideoPlayer__seek'
                />
              </div>
            </Col>
            <Col xs={2} className='p-0'>
              <Button onClick={this.handleClickFullscreen} variant='dashboardBlueOnWhite'>
                <span>
                  <FullscreenIcon />
                </span>
              </Button>
            </Col>
          </Row>

          <Row className='mt-3 mt-lg-5 ml-1'>
            <Col xs={2} className='p-0 text-center'>
              <Button variant='dashboardBlueOnWhite' onClick={this.handleToggleMuted}>
                {muted ? (
                  <span>
                    <VolumeOffIcon />
                  </span>
                ) : (
                  <VolumeUpIcon />
                )}
              </Button>
            </Col>
            <Col xs={5} className='my-auto text-center'>
              <div className='rangeStyle'>
                <input
                  type='range'
                  min={0}
                  max={1}
                  step='any'
                  value={volume}
                  onChange={this.handleVolumeChange}
                  className='VideoPlayer__seek'
                />
              </div>
            </Col>
            <Col xs={2} className='p-0 mr-2'>
              <Dropdown>
                <Dropdown.Toggle variant='dashboardBlueOnWhite' id='dropdown-basic'>
                  Speed
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item as='button' onClick={this.handleSetPlaybackRate} value={1}>
                    1x
                  </Dropdown.Item>
                  <Dropdown.Item as='button' onClick={this.handleSetPlaybackRate} value={1.25}>
                    1.25x
                  </Dropdown.Item>
                  <Dropdown.Item as='button' onClick={this.handleSetPlaybackRate} value={1.5}>
                    1.5x
                  </Dropdown.Item>
                  <Dropdown.Item as='button' onClick={this.handleSetPlaybackRate} value={2}>
                    2x
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Col>
          </Row>

          {/* <table>
            <tbody>
              <tr>
                <th>Controls</th>
                <td>
                  <button onClick={this.handlePlayPause}>{playing ? 'Pause' : 'Play'}</button>
                  <button onClick={this.handleClickFullscreen}>Fullscreen</button>
                  {light && <button onClick={() => this.player.showPreview()}>Show preview</button>}
                  {ReactPlayer.canEnablePIP(url) && (
                    <button onClick={this.handleTogglePIP}>
                      {pip ? 'Disable PiP' : 'Enable PiP'}
                    </button>
                  )}
                </td>
              </tr>
              <tr>
                <th>Speed</th>
                <td>
                  <button onClick={this.handleSetPlaybackRate} value={1}>
                    1x
                  </button>
                  <button onClick={this.handleSetPlaybackRate} value={1.5}>
                    1.5x
                  </button>
                  <button onClick={this.handleSetPlaybackRate} value={2}>
                    2x
                  </button>
                </td>
              </tr>
              <tr>
                <th>Seek</th>
                <td>
                  <input
                    type='range'
                    min={0}
                    max={0.999999}
                    step='any'
                    value={played}
                    onMouseDown={this.handleSeekMouseDown}
                    onChange={this.handleSeekChange}
                    onMouseUp={this.handleSeekMouseUp}
                  />
                </td>
              </tr>
              <tr>
                <th>Volume</th>
                <td>
                  <input
                    type='range'
                    min={0}
                    max={1}
                    step='any'
                    value={volume}
                    onChange={this.handleVolumeChange}
                  />
                </td>
              </tr>
              <tr>
                <th>
                  <label htmlFor='controls'>Controls</label>
                </th>
                <td>
                  <input
                    id='controls'
                    type='checkbox'
                    checked={controls}
                    onChange={this.handleToggleControls}
                  />
                  <em>&nbsp; Requires player reload</em>
                </td>
              </tr>
              <tr>
                <th>
                  <label htmlFor='muted'>Muted</label>
                </th>
                <td>
                  <input
                    id='muted'
                    type='checkbox'
                    checked={muted}
                    onChange={this.handleToggleMuted}
                  />
                </td>
              </tr>
              <tr>
                <th>
                  <label htmlFor='loop'>Loop</label>
                </th>
                <td>
                  <input
                    id='loop'
                    type='checkbox'
                    checked={loop}
                    onChange={this.handleToggleLoop}
                  />
                </td>
              </tr>
              <tr>
                <th>
                  <label htmlFor='light'>Light mode</label>
                </th>
                <td>
                  <input
                    id='light'
                    type='checkbox'
                    checked={light}
                    onChange={this.handleToggleLight}
                  />
                </td>
              </tr>
              <tr>
                <th>Played</th>
                <td>
                  <progress max={1} value={played} />
                </td>
              </tr>
              <tr>
                <th>Loaded</th>
                <td>
                  <progress max={1} value={loaded} />
                </td>
              </tr>
            </tbody>
          </table> */}
        </div>
      </>
    );
  }
}
