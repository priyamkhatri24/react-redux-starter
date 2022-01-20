import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import Spinner from 'react-bootstrap/Spinner';
import Modal from 'react-bootstrap/Modal';
import { useParams, useHistory } from 'react-router-dom';
import InfiniteScrollComponent from 'react-infinite-scroll-component';
import ReactPlayer from 'react-player';
import ArrowBack from '@material-ui/icons/ArrowBack';
import GetAppIcon from '@material-ui/icons/GetApp';
import MoreVert from '@material-ui/icons/MoreVert';
import { getConversation } from '../../../redux/reducers/conversations.reducer';
import { get, apiValidation } from '../../../Utilities';
import './ConversationMedia.scss';
import '../Conversation.scss';

const ConversationMedia = ({}) => {
  const [files, setFiles] = useState({});
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [mediaToOpen, setMediaToOpen] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [nextPage, setNextPage] = useState(3);
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
      get(null, `/conversations/${conversation.id}/media?page=${2}`).then((resp) => {
        const apiDataa = apiValidation(resp);
        console.log(apiDataa, 'apiDataa');
        const newFiles = { ...apiData };
        for (const date of Object.keys(apiDataa)) {
          if (Object.keys(newFiles).includes(date)) {
            newFiles[date] = [...newFiles[date], ...apiDataa[date]];
          } else {
            newFiles[date] = [...apiDataa[date]];
          }
        }
        setFiles(newFiles);
        // if (!Object.keys(apiData).length) {
        //   setHasMore(false);
        // }
        setNextPage(nextPage + 1);
        setLoading(false);
      });
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
      console.log(files);
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

  const openMediaModal = (media) => {
    console.log(media);
    setMediaToOpen(media);
    setOpenModal(true);
  };

  return (
    <div style={{ height: '100vh' }}>
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
          // ref={scrollParent}
          className='scrollHideClass'
          style={{
            height: '90vh',
            overflowY: 'auto',
            margin: 'auto',
          }}
          id='scrollableDiv'
        >
          <InfiniteScrollComponent
            dataLength={Object.values(files).flat().length}
            next={() => fetchMoreFiles(nextPage)}
            hasMore={hasMore}
            loader={<p />}
            style={{ overflowY: 'auto' }}
            scrollableTarget='scrollableDiv'
          >
            {Object.keys(files)
              // .sort((a, b) => {
              //   const aa = new Date(a.split('-').reverse().join('-'));
              //   const bb = new Date(b.split('-').reverse().join('-'));
              //   return (aa > bb) - (aa < bb);
              // })
              .map((date) => (
                <div className='files pb-2'>
                  <div className='text-center'>
                    <p className='file-date'>{date}</p>
                  </div>
                  <div className='wrapper'>
                    {files[date].map((mediaObj) => (
                      <div className='mediaContainer'>
                        {/* eslint-disable */}
                        <div
                          onClick={() => openMediaModal(mediaObj)}
                          style={{ width: '100%' }}
                          className='media-gallery pb-1 mt-1'
                        >
                          <>
                            {mediaObj.type === 'image' && (
                              <img
                                height='120px'
                                width='auto'
                                className='mediaImage'
                                src={mediaObj.url}
                              />
                            )}
                            {mediaObj.type === 'video' && (
                              <div className='mediaImage'>
                                <video
                                  className='mediaImage'
                                  autoPlay='autoplay'
                                  autoplay='autoplay'
                                  muted
                                  style={{ borderRadius: '5px' }}
                                >
                                  <source src={mediaObj.url} type='video/mp4' />
                                  <track src='' kind='subtitles' srcLang='en' label='English' />
                                </video>
                              </div>
                            )}
                          </>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </InfiniteScrollComponent>
        </div>
      )}
      <Modal
        show={openModal}
        onHide={() => setOpenModal(false)}
        centered
        className='d-flex justify-content-center'
      >
        {mediaToOpen.type === 'image' && <img className='modalImageChats' src={mediaToOpen.url} />}
        {mediaToOpen.type === 'video' && (
          <video
            className='modalImageChats'
            controls='controls'
            width='100%'
            style={{ borderRadius: '5px' }}
          >
            <source src={mediaToOpen.url} type='video/mp4' />
            <track src='' kind='subtitles' srcLang='en' label='English' />
          </video>
        )}

        <Modal.Footer>
          <a href={mediaToOpen.url}>
            <GetAppIcon />
          </a>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ConversationMedia;
