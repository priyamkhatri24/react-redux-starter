import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import Spinner from 'react-bootstrap/Spinner';

import { useParams, useHistory } from 'react-router-dom';
import InfiniteScrollComponent from 'react-infinite-scroll-component';
import InfiniteScroll from 'react-infinite-scroller';
import ReactPlayer from 'react-player';
import ArrowBack from '@material-ui/icons/ArrowBack';
import MoreVert from '@material-ui/icons/MoreVert';
import { getConversation } from '../../../redux/reducers/conversations.reducer';
import { get, apiValidation } from '../../../Utilities';
import './ConversationMedia.scss';
import '../Conversation.scss';

const ConversationMedia = ({}) => {
  const [files, setFiles] = useState({});
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [nextPage, setNextPage] = useState(2);
  const history = useHistory();
  const conversation = useSelector((state) => getConversation(state));
  const { id } = useParams();

  const loader = () => (
    <div style={{ height: '100px' }} className='d-flex align-items-center justify-content-center'>
      <Spinner animation='border' variant='primary' />
    </div>
  );

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = () => {
    console.log(id);
    get(null, `/conversations/${conversation.id}/media`).then((res) => {
      const apiData = apiValidation(res);
      console.log(apiData);
      setFiles(apiData);
      setLoading(false);
    });
  };

  const fetchMoreFiles = () => {
    console.log(id);
    get(null, `/conversations/${conversation.id}/media?page=${nextPage}`).then((res) => {
      const apiData = apiValidation(res);
      console.log(apiData, 'apiDataa');
      const newFiles = { ...files };
      for (const date of Object.keys(apiData)) {
        if (Object.keys(newFiles).includes(date)) {
          newFiles[date] = [...newFiles[date], ...apiData[date]];
        } else {
          newFiles[date] = [...apiData[date]];
        }
      }
      setFiles(newFiles);
      // if (!Object.keys(apiData).length) {
      //   setHasMore(false);
      // }
      console.log(files, 'filessss');
      setNextPage(nextPage + 1);
      setLoading(false);
    });
  };

  const getFileExt = (name) => {
    const splitByDot = name.split('.');
    const ext = splitByDot[splitByDot.length - 1];
    if (ext === 'mp4') return 'video';
    return 'image';
  };

  return (
    <>
      <div style={{ boxShadow: '0px 2px 2px 0px #00000029' }}>
        <Row noGutters>
          <Col xs={12}>
            <div className='p-2 d-flex align-items-center justify-content-between'>
              <div className='d-flex align-items-center'>
                <ArrowBack
                  className='mr-3'
                  role='button'
                  tabIndex={0}
                  onKeyDown={() => {}}
                  onClick={() => history.push('/conversation/details')}
                />
                <h5 className='pb-0 mb-0'>Media</h5>
              </div>
              <div className='d-flex justify-self-end align-items-center'>
                <MoreVert className='ml-1' />
              </div>
            </div>
          </Col>
        </Row>
      </div>
      {!loading && (
        <div
          className='messages-container desktopContainer container-fluid mt-2'
          // ref={scrollParent}
          style={{
            height: '80vh',
            overflowY: 'auto',
            display: 'flex',
            // flexDirection: 'column-reverse',
          }}
          id='scrollableDiv'
        >
          <InfiniteScrollComponent
            dataLength={Object.keys(files).length}
            next={() => fetchMoreFiles(nextPage)}
            hasMore={hasMore}
            loader={<p />}
            style={{ overflowY: 'auto' }}
            scrollableTarget='scrollableDiv'
          >
            {Object.keys(files)
              .sort((a, b) => {
                const aa = new Date(a.split('-').reverse().join('-'));
                const bb = new Date(b.split('-').reverse().join('-'));
                return (aa > bb) - (aa < bb);
              })
              .map((date) => (
                <div className='files pb-2'>
                  <div className='text-center'>
                    <p className='file-date'>{date}</p>
                  </div>
                  <Row>
                    {files[date].map((mediaObj) => (
                      <div className='mediaContainer'>
                        <a href={mediaObj.url} target='__blank' style={{ color: 'inherit' }}>
                          <div style={{ width: '80%' }} className='media-gallery pb-2'>
                            <>
                              {getFileExt(mediaObj.name) === 'image' && (
                                <Image height='120px' width='auto' rounded src={mediaObj.url} />
                              )}
                              {getFileExt(mediaObj.name) === 'video' && (
                                <div>
                                  <ReactPlayer
                                    className='video-message'
                                    controls
                                    url={[{ src: mediaObj.url, type: 'video/mp4' }]}
                                    height='120px'
                                    width='auto'
                                  />
                                </div>
                              )}
                            </>
                          </div>
                        </a>
                      </div>
                    ))}
                  </Row>
                </div>
              ))}
          </InfiniteScrollComponent>
        </div>
      )}
    </>
  );
};

export default ConversationMedia;
