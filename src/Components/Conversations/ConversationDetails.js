import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Media from 'react-bootstrap/Media';
import Image from 'react-bootstrap/Image';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useHistory } from 'react-router-dom';
import ReactPlayer from 'react-player';
import ArrowBack from '@material-ui/icons/ArrowBack';
import MoreVert from '@material-ui/icons/MoreVert';
import ChevronRight from '@material-ui/icons/ChevronRight';
import ExpandMore from '@material-ui/icons/ExpandMore';
import { get, apiValidation } from '../../Utilities';
import { getClientUserId } from '../../redux/reducers/clientUserId.reducer';
import { getConversation, getSocket, getPosts } from '../../redux/reducers/conversations.reducer';
import AudioIcon from '../../assets/images/audiotrack.svg';
import FileIcon from '../../assets/images/file.svg';
import './Conversation.scss';

const ConversationDetails = () => {
  const history = useHistory();
  const [details, setDetails] = useState();
  const [loading, setLoading] = useState(true);
  const conversation = useSelector((state) => getConversation(state));

  useEffect(() => {
    fetchDetails();
  }, []);

  const fetchDetails = () => {
    get(null, `/conversations/${conversation.id}/details`).then((res) => {
      const apiData = apiValidation(res);
      console.log(apiData, 'detailss');
      setDetails(apiData);
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
                  onClick={() => history.push('/conversations')}
                  onKeyDown={() => history.push('/conversations')}
                />
              </div>
              <div className='d-flex justify-self-end align-items-center'>
                <MoreVert className='ml-1' />
              </div>
            </div>
          </Col>
        </Row>
      </div>
      {!loading && (
        <>
          <div className='mt-3'>
            <Media as='div' className='p-2'>
              <Image
                src={conversation.thumbnail}
                width={88}
                height={88}
                className='align-self-center mr-3'
                roundedCircle
              />
              <Media.Body className='align-self-center'>
                <Row>
                  <Col xs={12}>
                    <p
                      style={{
                        fontSize: '12px',
                        fontFamily: 'Montserrat-Bold',
                        color: '#000',
                        marginBottom: '0px',
                      }}
                    >
                      {conversation.name}
                    </p>
                    {conversation.participantsCount > 1 && (
                      <p
                        style={{
                          fontSize: '10px',
                          fontFamily: 'Montserrat-Regular',
                          color: '#0000008A',
                          marginBottom: '0px',
                        }}
                      >
                        {conversation.participantsCount} participants
                      </p>
                    )}
                  </Col>
                </Row>
              </Media.Body>
            </Media>
          </div>
          <div className='details-box p-2'>
            <Card>
              <Card.Header>
                <div className='d-flex justify-content-between align-items-center'>
                  <p className='details-heading mb-0'>Info</p>
                </div>
              </Card.Header>
              <Card.Body>
                <div className='d-flex align-items-center justify-content-between pb-2'>
                  <p className='mb-0'>8746758748</p>
                  <Form.Check type='switch' />
                </div>
              </Card.Body>
            </Card>
            <Card>
              <Card.Header>
                <div className='d-flex justify-content-between align-items-center'>
                  <p className='details-heading mb-0'>Settings</p>
                </div>
              </Card.Header>
              <Card.Body>
                <div className='d-flex align-items-center justify-content-between pb-2'>
                  <p className='mb-0'>Notification</p>
                  <Form.Check type='switch' />
                </div>
              </Card.Body>
            </Card>
            <Accordion>
              <Card className='mt-2'>
                <Accordion.Toggle as={Card.Header} eventKey='0'>
                  <div className='d-flex justify-content-between align-items-center'>
                    <p className='details-heading mb-0'>Members</p>
                    <Button variant='link' className='p-0 m-0'>
                      <ExpandMore />
                    </Button>
                  </div>
                </Accordion.Toggle>
                <Accordion.Collapse eventKey='0'>
                  <Card.Body>
                    <div className='members'>
                      {details.members.map((member) => (
                        <div>
                          <Media as='div' className='p-2'>
                            <Image
                              src={member.profile_picture}
                              width={20}
                              className='align-self-center mr-3'
                              roundedCircle
                            />
                            <Media.Body className='align-self-center'>
                              <Row>
                                <Col xs={12}>
                                  <p
                                    style={{
                                      fontSize: '12px',
                                      color: '#000',
                                      marginBottom: '0px',
                                    }}
                                  >
                                    {member.name}
                                  </p>
                                </Col>
                              </Row>
                            </Media.Body>
                          </Media>
                        </div>
                      ))}
                    </div>
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
            </Accordion>
            <Card className='mt-2'>
              <Card.Header onClick={() => history.push(`/conversations/${conversation.id}/media`)}>
                <div className='d-flex justify-content-between align-items-center'>
                  <p className='details-heading mb-0'>Media</p>
                  <Button variant='link' className='p-0 m-0'>
                    <ChevronRight />
                  </Button>
                </div>
              </Card.Header>

              <Card.Body>
                <div className='gallery pb-2'>
                  {details.media.map((mediaObj) => (
                    <>
                      {getFileExt(mediaObj.name) === 'image' && (
                        <Image height='64px' rounded src={mediaObj.url} />
                      )}
                      {getFileExt(mediaObj.name) === 'video' && (
                        <div style={{ height: '64px', maxWidth: '128px' }}>
                          <ReactPlayer
                            className='video-message'
                            controls
                            url={[{ src: mediaObj.url, type: 'video/mp4' }]}
                            height='64px'
                          />
                        </div>
                      )}
                    </>
                  ))}
                </div>
              </Card.Body>
            </Card>
            <Card className='mt-2'>
              <Card.Header onClick={() => history.push(`/conversations/${conversation.id}/files`)}>
                <div className='d-flex justify-content-between align-items-center'>
                  <p className='details-heading mb-0'>Files</p>
                  <Button variant='link' className='p-0 m-0'>
                    <ChevronRight />
                  </Button>
                </div>
              </Card.Header>

              <Card.Body>
                <div className='files pb-2'>
                  {details.files.map((file) => (
                    <a href={file.url} target='__blank' style={{ color: 'inherit' }}>
                      <div className='d-flex align-items-center mt-3 mb-3'>
                        <div className='pr-2'>
                          <Image src={FileIcon} height='24px' />
                        </div>
                        <p className='mb-0'>{file.name}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </Card.Body>
            </Card>
            <Card className='mt-2'>
              <Card.Header
                onClick={() => history.push(`/conversations/${conversation.id}/audio-files`)}
              >
                <div className='d-flex justify-content-between align-items-center'>
                  <p className='details-heading mb-0'>Audio</p>
                  <Button variant='link' className='p-0 m-0'>
                    <ChevronRight />
                  </Button>
                </div>
              </Card.Header>

              <Card.Body>
                <div className='files pb-2'>
                  {details.audioFiles.map((audioFile) => (
                    <div className='d-flex align-items-center mt-3 mb-3'>
                      <div className='pr-2'>
                        <Image src={AudioIcon} height='24px' />
                      </div>
                      <p className='mb-0'>{audioFile.name}</p>
                    </div>
                  ))}
                </div>
              </Card.Body>
            </Card>
          </div>
        </>
      )}
    </>
  );
};

export default ConversationDetails;
