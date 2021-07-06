/** @jsxImportSource @emotion/react */

import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Accordion from 'react-bootstrap/Accordion';
import Modal from 'react-bootstrap/Modal';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import GetAppIcon from '@material-ui/icons/GetApp';
import fromUnixTime from 'date-fns/fromUnixTime';
import format from 'date-fns/format';
import { apiValidation, get } from '../../Utilities';
import {
  getClientId,
  getClientUserId,
  getRoleArray,
} from '../../redux/reducers/clientUserId.reducer';
import { PageHeader, Readmore } from '../Common';
import doc from '../../assets/images/FilesFolders/doc.svg';
import docx from '../../assets/images/FilesFolders/docx.svg';
import pdf from '../../assets/images/FilesFolders/pdf.svg';
import ppt from '../../assets/images/FilesFolders/ppt.svg';
import xls from '../../assets/images/FilesFolders/xls.svg';
import txt from '../../assets/images/FilesFolders/txt.svg';
import youtube from '../../assets/images/FilesFolders/youtube.png';
import videocam from '../../assets/images/FilesFolders/videocam.svg';
import images from '../../assets/images/FilesFolders/Images.svg';
import './StudyBin.scss';
import '../Courses/Courses.scss';
import StudyBinMenu from './StudyBinMenu';
import LiveClassesStyle from '../Live Classes/LiveClasses.style';
import { downloadFile } from '../../Utilities/customUpload';

const Categories = (props) => {
  const { history, match, clientUserId, clientId, roleArray } = props;
  const [files, setFiles] = useState([]);
  const [searchString, setSearchString] = useState('');
  const [showImageModal, setShowImageModal] = useState(false);
  const [imgLink, setImgLink] = useState('');
  const handleImageOpen = () => setShowImageModal(true);
  const handleImageClose = () => setShowImageModal(false);
  const [menuOptions, setMenuOptions] = useState({
    id: 0,
    type: '',
    status: '',
    finalBatches: [],
    currentBatches: [],
  });
  const [openMenu, setOpenMenu] = useState(false);
  const handleMenuClose = () => setOpenMenu(false);
  const handleMenuShow = () => setOpenMenu(true);

  const rerenderCategories = useCallback(() => {
    const { id } = match.params;

    get({ category_id: id, client_user_id: clientUserId }, '/getFilesOfCategory').then((res) => {
      console.log(res);
      const result = apiValidation(res);
      setFiles(result);
    });
  }, [match, clientUserId]);

  const getLiveRecordings = useCallback(() => {
    const payload = {
      client_user_id: clientUserId,
      client_id: clientId,
      isAdmin: roleArray.includes(4),
    };

    get(payload, '/getRecordedLiveStreamOfCoachingLatest').then((res) => {
      console.log(res, 'resp');
      const result = apiValidation(res);
      console.log(result);
      setFiles(result);
    });
  }, [clientId, clientUserId, roleArray]);

  useEffect(() => {
    if (match.params.id === '4') getLiveRecordings();
    else rerenderCategories();
  }, [rerenderCategories, match, getLiveRecordings]);

  const searchFolder = (search) => {
    console.log(search);
    setSearchString(search);
  };

  const goToVideoPlayer = (elem, type) => {
    if (type === 'youtube')
      history.push({ pathname: `/videoplayer/${elem.file_link}`, state: { link: elem.file_link } });
    else if (type === 'video')
      history.push({ pathname: `/videoplayer`, state: { videoLink: elem.file_link } });
  };

  const openFileView = (elem) => {
    console.log(elem);
    const fileType = elem.file_type.replace(/\./g, ''); // removes the . form .doc / .ppt etc
    fileType === 'pdf' || fileType === 'pd'
      ? history.push({
          pathname: '/fileviewer',
          state: { filePath: elem.file_link, type: fileType },
        })
      : history.push({
          pathname: '/otherfileviewer',
          state: { filePath: elem.file_link, type: fileType },
        });
  };

  const openImage = (elem) => {
    setImgLink(elem.file_link);
    handleImageOpen();
  };

  const openContextMenu = (elem, type) => {
    setMenuOptions({
      ...menuOptions,
      type,
      status: elem.status,
      id: type === 'folder' ? elem.folder_id : elem.file_id,
      finalBatches: elem.final_batch,
      currentBatches: elem.current_batch,
    });
    handleMenuShow();
  };

  const downloadRecording = (event, link) => {
    event.stopPropagation();
    downloadFile(link);
  };

  const goToRecording = (link) => {
    console.log(link, 'lodu');
    history.push({ pathname: `/videoplayer`, state: { videoLink: link } });
  };

  return (
    <>
      <PageHeader
        title={
          match.params.id === '1'
            ? 'Files'
            : match.params.id === '2'
            ? 'Youtube'
            : match.params.id === '3'
            ? 'Images'
            : match.params.id === '4'
            ? 'Live Class Recordings'
            : 'Videos'
        }
        search
        placeholder='Search for file or folder'
        searchFilter={searchFolder}
      />
      <StudyBinMenu
        kholdo={openMenu}
        handleClose={handleMenuClose}
        rerenderFilesAndFolders={rerenderCategories}
        id={menuOptions.id}
        type={menuOptions.type}
        currentStatus={menuOptions.status}
        finalBatches={menuOptions.finalBatches}
        currentBatches={menuOptions.currentBatches}
      />
      <div style={{ marginTop: '5rem' }} className='mx-4 mx-md-5'>
        <Row className='container_studybin'>
          {files.length > 0 &&
            files
              .filter((elem) => {
                console.log(elem, elem.stream_name);
                return match.params.id === '4'
                  ? elem.stream_name.includes(searchString)
                  : elem.file_name.includes(searchString);
              })
              .map((elem) => {
                return match.params.id === '4' ? (
                  <Accordion className='w-100'>
                    <Card className='Courses__accordionHeading m-3 p-2'>
                      <Row css={LiveClassesStyle.adminHeading} className='mb-0 mx-0'>
                        Recorded Class by {elem.first_name} {elem.last_name}
                        <span
                          className='ml-auto StudyBin__verticalDots'
                          onClick={() => openContextMenu(elem, 'file')}
                          onKeyDown={() => openContextMenu(elem, 'file')}
                          tabIndex='-1'
                          role='button'
                        >
                          <MoreVertIcon />
                        </span>
                      </Row>
                      <p css={LiveClassesStyle.adminCardTime} className='mb-0'>
                        {format(fromUnixTime(elem.created_at), 'HH:mm MMM dd, yyyy')}
                      </p>
                      <Row css={LiveClassesStyle.adminBatches}>
                        <Col xs={4}>Streamed In :</Col>

                        <Col xs={8} className='p-0'>
                          <Readmore maxcharactercount={100} batchesArray={elem.batch_array} />
                        </Col>
                      </Row>

                      <Accordion.Toggle as='div' eventKey='0'>
                        <Row className='m-2'>
                          <span>{elem.recording_link_array.length} Recordings Available</span>
                          <span className='ml-auto'>
                            <ExpandMoreIcon />
                          </span>
                        </Row>
                      </Accordion.Toggle>
                      <Accordion.Collapse eventKey='0'>
                        <div>
                          {elem.recording_link_array.map((e, i) => {
                            return (
                              <Row className='m-3' key={e} onClick={() => goToRecording(e)}>
                                {i + 1}. Recording {1 + i}{' '}
                                {!roleArray.includes(1) && (
                                  <span
                                    className='ml-auto'
                                    onClick={(event) => downloadRecording(event, e)}
                                    onKeyDown={(event) => downloadRecording(event, e)}
                                    tabIndex='-1'
                                    role='button'
                                  >
                                    <GetAppIcon />
                                  </span>
                                )}
                              </Row>
                            );
                          })}
                        </div>
                      </Accordion.Collapse>
                    </Card>
                  </Accordion>
                ) : (
                  <Col
                    xs={5}
                    md={4}
                    lg={3}
                    key={elem.file_id}
                    className='p-2 StudyBin__box my-2 mx-2'
                    style={{ wordBreak: 'break-all' }}
                  >
                    {elem.file_type === 'youtube' ? (
                      <>
                        <span
                          className='StudyBin__verticalDots'
                          onClick={() => openContextMenu(elem, 'file')}
                          onKeyDown={() => openContextMenu(elem, 'file')}
                          tabIndex='-1'
                          role='button'
                        >
                          <MoreVertIcon />
                        </span>
                        <div
                          className='m-2 text-center'
                          onClick={() => goToVideoPlayer(elem, 'youtube')}
                          onKeyDown={() => goToVideoPlayer(elem, 'youtube')}
                          role='button'
                          tabIndex='-1'
                        >
                          <img src={youtube} alt='youtube' height='67' width='67' />
                          <h6 className='text-center mt-3 StudyBin__folderName'>
                            {elem.file_name}
                          </h6>
                        </div>
                      </>
                    ) : elem.file_type === 'video' || elem.file_type === '.mp4' ? (
                      <>
                        <span
                          className='StudyBin__verticalDots'
                          onClick={() => openContextMenu(elem, 'file')}
                          onKeyDown={() => openContextMenu(elem, 'file')}
                          tabIndex='-1'
                          role='button'
                        >
                          <MoreVertIcon />
                        </span>
                        <div
                          className='m-2 text-center'
                          onClick={() => goToVideoPlayer(elem, 'video')}
                          onKeyDown={() => goToVideoPlayer(elem, 'video')}
                          role='button'
                          tabIndex='-1'
                        >
                          <img src={videocam} alt='video' height='60' width='60' />
                          <h6
                            className='text-center mt-3 StudyBin__folderName'
                            style={{ wordBreak: 'break-all' }}
                          >
                            {elem.file_name}
                          </h6>
                        </div>
                      </>
                    ) : elem.file_type === 'live_class' ? (
                      <>
                        <span
                          className='StudyBin__verticalDots'
                          onClick={() => openContextMenu(elem, 'file')}
                          onKeyDown={() => openContextMenu(elem, 'file')}
                          tabIndex='-1'
                          role='button'
                        >
                          <MoreVertIcon />
                        </span>
                        <div
                          className='m-2 text-center'
                          onClick={() => {}}
                          onKeyDown={() => {}}
                          role='button'
                          tabIndex='-1'
                        >
                          <img src={videocam} alt='video' height='60' width='60' />
                          <h6
                            className='text-center mt-3 StudyBin__folderName'
                            style={{ wordBreak: 'break-all' }}
                          >
                            {elem.file_name}
                          </h6>
                        </div>
                      </>
                    ) : elem.file_type === '.jpg' ||
                      elem.file_type === '.png' ||
                      elem.file_type === 'gallery' ? (
                      // eslint-disable-next-line
                      <>
                        <span
                          className='StudyBin__verticalDots'
                          onClick={() => openContextMenu(elem, 'file')}
                          onKeyDown={() => openContextMenu(elem, 'file')}
                          tabIndex='-1'
                          role='button'
                        >
                          <MoreVertIcon />
                        </span>
                        <div
                          className='m-2 text-center'
                          onClick={() => openImage(elem)}
                          onKeyDown={() => openImage(elem)}
                          role='button'
                          tabIndex='-1'
                        >
                          <img src={images} alt='video' height='60' width='60' />
                          <h6
                            className='text-center mt-3 StudyBin__folderName'
                            style={{ wordBreak: 'break-all' }}
                          >
                            {elem.file_name}
                          </h6>
                        </div>
                      </>
                    ) : (
                      <>
                        <span
                          className='StudyBin__verticalDots'
                          onClick={() => openContextMenu(elem, 'file')}
                          onKeyDown={() => openContextMenu(elem, 'file')}
                          tabIndex='-1'
                          role='button'
                        >
                          <MoreVertIcon />
                        </span>
                        <div
                          className='m-2 text-center'
                          onClick={() => openFileView(elem)}
                          role='button'
                          tabIndex='-1'
                          onKeyDown={() => openFileView(elem)}
                        >
                          <img
                            src={
                              elem.file_type === '.doc'
                                ? doc
                                : elem.file_type === '.docx'
                                ? docx
                                : elem.file_type === '.pdf'
                                ? pdf
                                : elem.file_type === '.ppt' || elem.file_type === '.pptx'
                                ? ppt
                                : elem.file_type === '.csv' ||
                                  elem.file_type === '.xls' ||
                                  elem.file_type === '.xlsx'
                                ? xls
                                : txt
                            }
                            alt='file'
                            height='67'
                            width='86'
                          />
                          <h6 className='text-center mt-3 StudyBin__folderName'>
                            {elem.file_name}
                          </h6>
                        </div>
                      </>
                    )}
                  </Col>
                );
              })}
        </Row>
      </div>
      <Modal show={showImageModal} onHide={handleImageClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Uploaded Image</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <img src={imgLink} alt='img' className='img-fluid' />
        </Modal.Body>
      </Modal>
    </>
  );
};

const mapStateToProps = (state) => ({
  clientUserId: getClientUserId(state),
  clientId: getClientId(state),
  roleArray: getRoleArray(state),
});

export default connect(mapStateToProps)(Categories);

Categories.propTypes = {
  history: PropTypes.instanceOf(Object).isRequired,
  match: PropTypes.instanceOf(Object).isRequired,
  clientUserId: PropTypes.number.isRequired,
  clientId: PropTypes.number.isRequired,
  roleArray: PropTypes.instanceOf(Array).isRequired,
};
