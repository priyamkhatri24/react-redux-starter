import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createMatchSelector } from 'connected-react-router';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Media from 'react-bootstrap/Media';
import Image from 'react-bootstrap/Image';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Spinner from 'react-bootstrap/Spinner';
import { useParams, useHistory } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroller';
import ArrowBack from '@material-ui/icons/ArrowBack';
import MoreVert from '@material-ui/icons/MoreVert';
import {
  getConversation,
  getSocket,
  getPosts,
} from '../../../redux/reducers/conversations.reducer';
import { get, apiValidation } from '../../../Utilities';
import FileIcon from '../../../assets/images/file.svg';
import AudioIcon from '../../../assets/images/audiotrack.svg';
import './ConversationFiles.scss';
import '../Conversation.scss';

const ConversationFiles = ({}) => {
  const [files, setFiles] = useState({});
  const [loading, setLoading] = useState(true);
  const history = useHistory();
  const conversation = useSelector((state) => getConversation(state));
  const { id, type } = useParams();

  const loader = () => (
    <div style={{ height: '100px' }} className='d-flex align-items-center justify-content-center'>
      <Spinner animation='border' variant='primary' />
    </div>
  );

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = () => {
    console.log(id, type);
    get(null, `/conversations/${conversation.id}/${type}`).then((res) => {
      const apiData = apiValidation(res);
      console.log(apiData);
      setFiles(apiData);
      setLoading(false);
    });
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
                <h5 className='pb-0 mb-0'>{type === 'files' ? `Files` : `Audio Files`}</h5>
              </div>
              <div className='d-flex justify-self-end align-items-center'>
                <MoreVert className=' ml-1' />
              </div>
            </div>
          </Col>
        </Row>
      </div>
      {!loading && (
        <InfiniteScroll isReverse initialLoad={false} threshold={500} loader={loader()}>
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

                {files[date].map((file) => (
                  <a href={file.url} target='__blank' style={{ color: 'inherit' }}>
                    <div className='d-flex align-items-center mt-3 mb-3'>
                      <div className='pr-2'>
                        <Image src={type === 'files' ? FileIcon : AudioIcon} height='24px' />
                      </div>
                      <p className='mb-0'>{file.name}</p>
                    </div>
                  </a>
                ))}
              </div>
            ))}
        </InfiniteScroll>
      )}
    </>
  );
};

export default ConversationFiles;
