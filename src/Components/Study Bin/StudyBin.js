import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import folder from '../../assets/images/FilesFolders/folderIcon.svg';
import doc from '../../assets/images/FilesFolders/doc.svg';
import docx from '../../assets/images/FilesFolders/docx.svg';
import pdf from '../../assets/images/FilesFolders/pdf.svg';
import ppt from '../../assets/images/FilesFolders/ppt.svg';
import xls from '../../assets/images/FilesFolders/xls.svg';
import txt from '../../assets/images/FilesFolders/txt.svg';
import youtube from '../../assets/images/FilesFolders/youtube.png';
import { get, apiValidation, post } from '../../Utilities';
import {
  getClientId,
  getClientUserId,
  getRoleArray,
} from '../../redux/reducers/clientUserId.reducer';
import { PageHeader } from '../Common';
import './StudyBin.scss';
import { AddButton } from '../Common/AddButton/AddButton';

const StudyBin = (props) => {
  // const { clientUserId, clientId, history, roleArray } = props;
  // const { state: { title, videoId } = {} } = props.location;

  const {
    location: { state: { title, videoId } = {} },
    clientUserId,
    clientId,
    history,
    roleArray,
  } = props;

  const [fileArray, setFileArray] = useState([]);
  const [folderArray, setFolderArray] = useState([]);
  const [insideFolder, setInsideFolder] = useState(true);
  const [folderIdStack, setFolderIdStack] = useState([]);
  const [showModal, setModal] = useState(false);
  const [folderName, setFolderName] = useState('');
  const [rerender, setrerender] = useState(false);
  const handleClose = () => setModal(false);
  const handleShow = () => setModal(true);

  const searchFolder = (search) => {
    console.log(search);
  };

  const addNewFolder = () => {
    console.log('folder clicked');
    handleShow();
    setrerender(true);
  };

  const addFolder = () => {
    const payload = {
      client_user_id: clientUserId,
      primary_folder_id: folderIdStack[folderIdStack.length - 1],
      folder_name: folderName,
    };

    post(payload, '/addFolder')
      .then((res) => {
        if (res.success) {
          handleClose();
        }
      })
      .catch((err) => console.log(err));
  };

  const addNewFile = (elem) => {
    console.log('file clicked', elem.get('data'));
    post(elem, '/upload')
      .then((res) => console.log(res))
      .catch((err) => console.error(err));
  };

  const getYoutubeFile = useCallback(() => {
    console.log('bhosdj');
    const payload = {
      client_user_id: clientUserId,
      folder_id: folderIdStack[folderIdStack.length - 1],
      file_name: title,
      file_link: videoId,
      file_type: 'youtube',
    };
    post(payload, '/addFile')
      .then((res) => {
        console.log(res);
        setrerender(true);
      })
      .catch((e) => console.log(e));
  }, [clientUserId, folderIdStack, title, videoId]);

  const addYoutubeLink = () => {
    history.push('/addyoutubevideo');
  };

  const handleBack = () => {
    if (folderIdStack.length > 0) {
      const newFolderIdStack = folderIdStack.reverse().slice(1).reverse();
      setFolderIdStack(newFolderIdStack);
    }
  };

  useEffect(() => {
    const payload = {
      client_user_id: clientUserId,
      clientId,
    };

    if (folderIdStack.length === 0 && insideFolder) {
      if (roleArray.includes(3) || roleArray.includes(4)) {
        const temp = {
          client_user_id: 1605,
          client_id: clientId,
        };
        get(temp, '/getPrimaryFoldersAndFiles') // instead of temp should be [payload]
          .then((res) => {
            const result = apiValidation(res);
            setFileArray(result.files);
            setFolderArray(result.folders);
            setFolderIdStack((prevState) => [...prevState, result.client_folder_id]);
            setInsideFolder(false);
          })
          .catch((err) => console.log(err));
      } else {
        get(payload, '/getFoldersAndFilesForStudent')
          .then((res) => {
            const result = apiValidation(res);
            setFileArray(result.files);
            setFolderArray(result.folders);
            setInsideFolder(false);
          })
          .catch((err) => console.log(err));
      }
    } else if (folderIdStack.length !== 0 && insideFolder) {
      const currentFolderId = folderIdStack[folderIdStack.length - 1];
      const newPayload = {
        folder_id: currentFolderId,
        client_id: clientId,
      };
      get(newPayload, '/getFoldersAndFilesOfFolder')
        .then((res) => {
          const result = apiValidation(res);
          setFileArray(result.files);
          setFolderArray(result.folders);
        })
        .catch((err) => console.log(err));
    }

    if (title && videoId && !rerender) {
      getYoutubeFile();
    }
  }, [
    getYoutubeFile,
    clientId,
    clientUserId,
    folderIdStack,
    insideFolder,
    title,
    videoId,
    roleArray,
    rerender,
  ]);

  const goToVideoPlayer = (elem) => {
    history.push({ pathname: `/videoplayer/${elem.file_link}`, state: { link: elem.file_link } });
  };

  const openFileView = (elem) => {
    console.log(elem);
    const fileType = elem.file_type.replace(/\./g, ''); // removes the . form .doc / .ppt etc
    history.push({ pathname: '/fileviewer', state: { filePath: elem.file_link, type: fileType } });
  };

  const openFolder = (elem) => {
    setFolderIdStack((prevState) => [...prevState, elem.folder_id]);
    setInsideFolder(true);
  };

  const addButtonArray = [
    { name: 'add File', func: addNewFile },
    { name: 'add Folder', func: addNewFolder },
    { name: 'add Youtube Link', func: addYoutubeLink },
  ];

  return (
    <>
      <div className='StudyBin'>
        <PageHeader
          title='Study Bin'
          search
          placeholder='Search for file or folder'
          searchFilter={searchFolder}
          customBack={insideFolder}
          handleBack={handleBack}
        />
        <div style={{ marginTop: '6rem' }} className='mx-4 mx-md-5'>
          <h6 className='StudyBin__heading'>
            Folders <span>({folderArray.length})</span>
          </h6>
          <Row>
            {folderArray.map((elem) => {
              return (
                <Col
                  xs={5}
                  md={4}
                  lg={3}
                  key={elem.folder_id}
                  className='p-2 StudyBin__box my-2 mx-2'
                >
                  <span className='Dashboard__verticalDots'>
                    <MoreVertIcon />
                  </span>
                  <div
                    className='m-2 text-center'
                    onKeyDown={() => openFolder(elem)}
                    onClick={() => openFolder(elem)}
                    role='button'
                    tabIndex='-1'
                  >
                    <img src={folder} alt='folder' height='67' width='86' />
                    <h6 className='text-center mt-3 StudyBin__folderName'>{elem.folder_name}</h6>
                  </div>
                </Col>
              );
            })}
          </Row>
        </div>

        <div className='mx-4 mx-md-5 my-5'>
          <h6 className='StudyBin__heading'>
            Files <span>({fileArray.length})</span>
          </h6>
          <Row>
            {fileArray.map((elem) => {
              return (
                <Col
                  xs={5}
                  md={4}
                  lg={3}
                  key={elem.file_id}
                  className='p-2 StudyBin__box my-2 mx-2'
                >
                  {elem.file_type === 'youtube' ? (
                    <>
                      <span className='Dashboard__verticalDots'>
                        <MoreVertIcon />
                      </span>
                      <div
                        className='m-2 text-center'
                        onClick={() => goToVideoPlayer(elem)}
                        onKeyDown={() => goToVideoPlayer(elem)}
                        role='button'
                        tabIndex='-1'
                      >
                        <img src={youtube} alt='youtube' height='67' width='67' />
                        <h6 className='text-center mt-3 StudyBin__folderName'>{elem.file_name}</h6>
                      </div>
                    </>
                  ) : (
                    <>
                      <span className='Dashboard__verticalDots'>
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
                          alt='folder'
                          height='67'
                          width='86'
                        />
                        <h6 className='text-center mt-3 StudyBin__folderName'>{elem.file_name}</h6>
                      </div>
                    </>
                  )}
                </Col>
              );
            })}
          </Row>
        </div>
      </div>
      {(roleArray.includes(3) || roleArray.includes(4)) && (
        <AddButton addButtonArray={addButtonArray} />
      )}

      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Create Folder</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <label className='has-float-label my-auto'>
            <input
              className='form-control'
              name='Folder Name'
              type='text'
              placeholder='Folder Name'
              onChange={(e) => setFolderName(e.target.value)}
            />
            <span>Folder Name</span>
          </label>
        </Modal.Body>
        {folderName && (
          <Modal.Footer>
            <Button variant='boldText' onClick={() => addFolder()}>
              Create
            </Button>
          </Modal.Footer>
        )}
      </Modal>
    </>
  );
};

const mapStateToProps = (state) => ({
  clientId: getClientId(state),
  clientUserId: getClientUserId(state),
  roleArray: getRoleArray(state),
});

export default connect(mapStateToProps)(StudyBin);

StudyBin.propTypes = {
  clientId: PropTypes.number.isRequired,
  clientUserId: PropTypes.number.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  roleArray: PropTypes.instanceOf(Array).isRequired,
  location: PropTypes.instanceOf(Object).isRequired,
};
