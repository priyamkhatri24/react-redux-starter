import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import Spinner from 'react-bootstrap/Spinner';

import { useParams, useHistory } from 'react-router-dom';
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
        <InfiniteScroll
          isReverse
          initialLoad={false}
          threshold={500}
          loader={loader()}
          className='pl-3 pr-3'
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
                    <Col span={3}>
                      <a href={mediaObj.url} target='__blank' style={{ color: 'inherit' }}>
                        <div className='media-gallery pb-2'>
                          <>
                            {getFileExt(mediaObj.name) === 'image' && (
                              <Image height='64px' width='auto' rounded src={mediaObj.url} />
                            )}
                            {getFileExt(mediaObj.name) === 'video' && (
                              <div style={{ height: '64px', maxWidth: '64px' }}>
                                <ReactPlayer
                                  className='video-message'
                                  controls
                                  url={[{ src: mediaObj.url, type: 'video/mp4' }]}
                                  height='64px'
                                />
                              </div>
                            )}
                          </>
                        </div>
                      </a>
                    </Col>
                  ))}
                </Row>
              </div>
            ))}
        </InfiniteScroll>
      )}
    </>
  );
};

export default ConversationMedia;
