import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import FilterAccordion from '../Common/FilterAccordion/FilterAccordion';
import { get, apiValidation } from '../../Utilities';
import {
  getClientUserId,
  getRoleArray,
  getClientId,
} from '../../redux/reducers/clientUserId.reducer';
import { PageHeader } from '../Common/PageHeader/PageHeader';
import './Videos.css';
import AddButton from '../Common/AddButton/AddButton';

const Videos = (props) => {
  const { clientUserId, history, clientId, roleArray, onlyUseButton, triggerButton } = props;
  const [videos, setVideos] = useState([]);
  const [storedVideos, setStoredVideos] = useState([]);
  const [searchString, setSearchString] = useState('');
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState('');
  const [bottomCss, setBottom] = useState(0);
  const [storedBatches, setStoredBatches] = useState([]);

  useEffect(() => {
    if (!roleArray.includes(3) || !roleArray.includes(4)) return;

    get({ client_id: clientId }, '/getBatchesUsingFilter').then((res) => {
      const result = apiValidation(res);
      setBatches(result);
      setStoredBatches(result);
      console.log(result);
    });
  }, []);

  useEffect(() => {
    const payload = {
      client_user_id: clientUserId,
      client_id: clientId,
      is_admin: roleArray.includes(4),
    };

    get(payload, '/getVideosUsingFilter/').then((res) => {
      const data = apiValidation(res);
      console.log(data);
      setVideos(data);
      setStoredVideos(data);
      console.log(videos);
    });
    console.log(payload, 'payload');
  }, [clientUserId, roleArray]);

  useEffect(() => {
    let timer;
    if (searchString) {
      timer = setTimeout(() => {
        const payload = {
          client_user_id: clientUserId,
          client_id: clientId,
          is_admin: roleArray.includes(4),
        };
        get(payload, `/getVideosUsingFilter/`).then((res) => {
          const result = apiValidation(res);
          const data = result.filter((ele) => {
            return ele.video_name.toLowerCase().includes(searchString);
          });
          setVideos(data);
        });
      }, 500);
    } else {
      const payload = {
        client_user_id: clientUserId,
        client_id: clientId,
        is_admin: roleArray.includes(4),
      };
      get(payload, `/getVideosUsingFilter/`).then((res) => {
        const data = apiValidation(res);
        setVideos(data);
      });
    }
    return () => {
      clearTimeout(timer);
    };
  }, [searchString]);

  const searchVid = (search) => {
    setSearchString(search);
  };

  const goToDashboard = () => {
    history.push('/');
  };

  const goToVideoPlayer = (elem, type) => {
    if (type === 'youtube')
      history.push({
        pathname: `/videoplayer/${elem.video_link}`,
        state: { videoId: elem.video_link },
      });
    else if (type === 'video')
      history.push({
        pathname: `/videoplayer`,
        state: { videoLink: elem.video_link, videoId: elem.video_link },
      });
  };

  const addYoutubeLink = () => {
    history.push({ pathname: '/addyoutubevideo', state: { addVideo: true } });
  };

  const triggerFilter = () => {
    if (!roleArray.includes(3) || !roleArray.includes(4)) return;
    if (bottomCss === 0) {
      setBottom(0 - 100);
    } else {
      setBottom(0);
    }
  };

  const filterVideoBasedOnBatch = (ele) => {
    const newVideos = videos.filter((vid) => {
      return vid.batch_array.includes(ele.batch_name);
    });

    setVideos(newVideos);
  };

  const selectBatch = (ele) => {
    setSelectedBatch(ele);
    setBatches([ele]);
    filterVideoBasedOnBatch(ele);
  };

  const removeSelected = () => {
    setSelectedBatch('');
    setBatches(storedBatches);
    setVideos(storedVideos);
  };

  return (
    <div style={{}}>
      <PageHeader
        title='Videos'
        search
        filter
        triggerFilters={triggerFilter}
        searchFilter={searchVid}
        customBack
        transparent
        handleBack={goToDashboard}
      />
      <div
        style={{
          backgroundColor: 'rgba(241, 249, 255, 1)',
          paddingTop: '4rem',
          paddingBottom: '50vh',
          position: 'relative',
        }}
      >
        {/* <button type='button'>haha</button> */}
        {/* <FilterAccordion
          filters={filters}
          isToggle={isToggle}
          currentTab={tab}
          addFilter={addFilter}
          removeFilter={removeFilter}
          addBatchFilter={addBatchFilter}
          removeBatchFilter={removeBatchFilter}
        /> */}
        {bottomCss !== 0 && (
          <div className='w-93 mt-2'>
            <p className='p-0 batchesText'>Batch</p>
            <div style={{ overflowX: 'scroll' }} className='d-flex scroller'>
              {batches.length > 0 &&
                batches.map((ele) => {
                  return (
                    <button
                      onClick={() => selectBatch(ele)}
                      className={`${selectedBatch ? 'selectedBtns' : 'filterBtns'}`}
                      type='button'
                    >
                      {ele.batch_name}
                    </button>
                  );
                })}
              {selectedBatch ? (
                <button className='filterBtns' type='button' onClick={removeSelected}>
                  X
                </button>
              ) : null}
            </div>
            <hr className='h_line1' />
          </div>
        )}
        <div style={{ bottom: bottomCss }} className='overlay'>
          <hr className='horizontalLineVID' />

          <Row
            lg={3}
            className='g-4 mx-0'
            style={
              {
                // overflow: 'scroll',
              }
            }
          >
            {videos.map((ele) => {
              return (
                <div
                  style={{
                    width: '93%',
                    display: 'flex',
                    flexDirection: 'row',
                    flex: '33% 33% 33%',
                    flexWrap: 'wrap',
                  }}
                  className='my-2 mx-auto'
                  onClick={() => goToVideoPlayer(ele, 'youtube')}
                  onKeyDown={() => goToVideoPlayer(ele, 'youtube')}
                  role='button'
                  tabIndex='-1'
                >
                  <Card lg={4} className='g-4 Card videosCard'>
                    <img
                      src={ele.video_thumbnail}
                      className='card-img-top justify-content-lg-center thumbnailImage border-blue-2rem hh'
                      alt='fff'
                    />
                    <h6 className='card-text text-start ppp card-body paddingForText text-lg-start'>
                      {ele.video_name}
                    </h6>
                  </Card>
                </div>
              );
            })}
          </Row>
        </div>
      </div>

      {(roleArray.includes(3) || roleArray.includes(4)) && (
        <AddButton onlyUseButton triggerButton={addYoutubeLink} />
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  clientId: getClientId(state),
  roleArray: getRoleArray(state),
  clientUserId: getClientUserId(state),
});

export default connect(mapStateToProps, null)(Videos);

Videos.propTypes = {
  clientUserId: PropTypes.number.isRequired,
  clientId: PropTypes.number.isRequired,
  history: PropTypes.instanceOf(Object).isRequired,
  roleArray: PropTypes.instanceOf(Array).isRequired,
  onlyUseButton: PropTypes.bool,
  triggerButton: PropTypes.func,
};

Videos.defaultProps = {
  onlyUseButton: false,
  triggerButton: () => {},
};
