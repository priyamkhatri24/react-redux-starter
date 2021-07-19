import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import AddIcon from '@material-ui/icons/Add';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import folder from '../../assets/images/FilesFolders/folderIcon.svg';
import doc from '../../assets/images/FilesFolders/doc.svg';
import docx from '../../assets/images/FilesFolders/docx.svg';
import pdf from '../../assets/images/FilesFolders/pdf.svg';
import ppt from '../../assets/images/FilesFolders/ppt.svg';
import xls from '../../assets/images/FilesFolders/xls.svg';
import txt from '../../assets/images/FilesFolders/txt.svg';
import youtube from '../../assets/images/FilesFolders/youtube.png';
import videocam from '../../assets/images/FilesFolders/videocam.svg';
import images from '../../assets/images/FilesFolders/Images.svg';
import { get, apiValidation, post } from '../../Utilities';
import {
  getClientId,
  getClientUserId,
  getRoleArray,
} from '../../redux/reducers/clientUserId.reducer';
import { PageHeader } from '../Common';
import AddButton from '../Common/AddButton/AddButton';
import './StudyBin.scss';
import { studyBinActions } from '../../redux/actions/studybin.actions';
import { getStudyBinFolderIDArray } from '../../redux/reducers/studybin.reducer';
import StudyBinMenu from './StudyBinMenu';
import { loadingActions } from '../../redux/actions/loading.action';

const StudyBin = (props) => {
  const {
    clientUserId,
    clientId,
    history,
    roleArray,
    studyBinFolderIdArray,
    pushFolderIDToFolderIDArrayInStore,
    popFolderIDFromFolderIDArrayInStore,
    setSpinnerStatusToStore,
    setLoadingSuccessToStore,
    setLoadingPendingToStore,
  } = props;

  const [fileArray, setFileArray] = useState([]);
  const [folderArray, setFolderArray] = useState([]);
  const [folderIdStack, setFolderIdStack] = useState(studyBinFolderIdArray);
  const [showModal, setModal] = useState(false);
  const [folderName, setFolderName] = useState('');
  const [searchString, setSearchString] = useState('');
  const [categoryArray, setCategoryArray] = useState([]);
  const [showImageModal, setShowImageModal] = useState(false);
  const [imgLink, setImgLink] = useState('');
  const [menuOptions, setMenuOptions] = useState({
    id: 0,
    type: '',
    status: '',
    finalBatches: [],
    currentBatches: [],
    currentFolderName: '',
  });
  const [openMenu, setOpenMenu] = useState(false);
  const handleImageOpen = () => setShowImageModal(true);
  const handleImageClose = () => setShowImageModal(false);
  const handleClose = () => setModal(false);
  const handleShow = () => setModal(true);
  const handleMenuClose = () => setOpenMenu(false);
  const handleMenuShow = () => setOpenMenu(true);

  const searchFolder = (search) => {
    console.log(search);
    setSearchString(search);
  };

  const addNewFolder = () => {
    console.log('folder clicked');
    handleShow();
  };

  const rerenderFilesAndFolders = () => {
    const temp = {
      client_user_id: clientUserId,
      client_id: clientId,
    };
    if (folderIdStack.length < 1) {
      get(temp, '/getPrimaryFoldersAndFiles') // instead of temp should be [payload]
        .then((res) => {
          const result = apiValidation(res);
          setFileArray(result.files);
          setFolderArray(result.folders);
          pushFolderIDToFolderIDArrayInStore(result.client_folder_id);
        })
        .catch((err) => console.log(err));
    } else {
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
          rerenderFilesAndFolders();
          handleClose();
        }
      })
      .catch((err) => console.log(err));
  };

  // const addNewFile = (name, link) => {

  //   console.log('file clicked', name);
  //   // https://stackoverflow.com/questions/190852/how-can-i-get-file-extensions-with-javascript - visioN
  //   const extension = name.slice(((name.lastIndexOf('.') - 1) >>> 0) + 2); // eslint-disable-line
  //   console.log(extension);
  //   const payload = {
  //     client_user_id: clientUserId,
  //     folder_id: folderIdStack[folderIdStack.length - 1],
  //     file_name: name,
  //     file_link: link,
  //     file_type:
  //       extension === 'doc'
  //         ? '.doc'
  //         : extension === 'docx'
  //         ? '.docx'
  //         : extension === 'pdf'
  //         ? '.pdf'
  //         : extension === 'xls'
  //         ? '.xls'
  //         : extension === 'xslx'
  //         ? '.xslx'
  //         : extension === 'csv'
  //         ? '.csv'
  //         : extension === 'ppt'
  //         ? '.ppt'
  //         : extension === 'pptx'
  //         ? '.pptx'
  //         : extension === 'mp4'
  //         ? '.mp4'
  //         : extension === 'jpg'
  //         ? '.jpg'
  //         : extension === 'png'
  //         ? '.png'
  //         : extension === 'jpeg'
  //         ? '.jpeg'
  //         : 'file',
  //   };
  //   post(payload, '/addFile')
  //     .then((res) => {
  //       console.log(res);
  //       rerenderFilesAndFolders();
  //     })
  //     .catch((e) => console.log(e));
  // };

  const addNewFile = (files) => {
    const filesArray = files.map((elem) => {
      const obj = {};
      obj.file_link = elem.filename;
      obj.file_name = elem.name;
      const extension = elem.name.slice(((elem.name.lastIndexOf('.') - 1) >>> 0) + 2); // eslint-disable-line
      obj.file_type =
        extension === 'doc'
          ? '.doc'
          : extension === 'docx'
          ? '.docx'
          : extension === 'pdf'
          ? '.pdf'
          : extension === 'xls'
          ? '.xls'
          : extension === 'xslx'
          ? '.xslx'
          : extension === 'csv'
          ? '.csv'
          : extension === 'ppt'
          ? '.ppt'
          : extension === 'pptx'
          ? '.pptx'
          : extension === 'mp4'
          ? '.mp4'
          : extension === 'jpg'
          ? '.jpg'
          : extension === 'png'
          ? '.png'
          : extension === 'jpeg'
          ? '.jpeg'
          : 'file';
      return obj;
    });

    const payload = {
      client_user_id: clientUserId,
      folder_id: folderIdStack[folderIdStack.length - 1],
      file_array: JSON.stringify(filesArray),
    };
    post(payload, '/addMultipleFile')
      .then((res) => {
        console.log(res);
        rerenderFilesAndFolders();
      })
      .catch((e) => console.log(e));
  };

  const addYoutubeLink = () => {
    history.push('/addyoutubevideo');
  };

  const handleBack = () => {
    if (folderIdStack.length > 1) {
      popFolderIDFromFolderIDArrayInStore();
    } else {
      history.push('/');
      popFolderIDFromFolderIDArrayInStore();
    }
  };

  useEffect(() => {
    setFolderIdStack(studyBinFolderIdArray);
  }, [studyBinFolderIdArray]);

  useEffect(() => {
    const payload = {
      client_user_id: clientUserId,
      clientId,
    };
    setSpinnerStatusToStore(true);
    setLoadingPendingToStore();

    if (folderIdStack.length < 1) {
      if (roleArray.includes(3) || roleArray.includes(4)) {
        const temp = {
          client_user_id: clientUserId,
          client_id: clientId,
        };
        get(temp, '/getPrimaryFoldersAndFiles') // instead of temp should be [payload]
          .then((res) => {
            setSpinnerStatusToStore(false);
            setLoadingSuccessToStore();
            const result = apiValidation(res);
            setFileArray(result.files);
            setFolderArray(result.folders);
            pushFolderIDToFolderIDArrayInStore(result.client_folder_id);
          })
          .catch((err) => {
            console.log(err);
            setSpinnerStatusToStore(false);
            setLoadingSuccessToStore();
          });
      } else {
        get(payload, '/getFoldersAndFilesForStudent')
          .then((res) => {
            setSpinnerStatusToStore(false);
            setLoadingSuccessToStore();
            const result = apiValidation(res);
            setFileArray(result.files);
            setFolderArray(result.folders);
          })
          .catch((err) => {
            console.log(err);
            setSpinnerStatusToStore(false);
            setLoadingSuccessToStore();
          });
      }
    } else if (folderIdStack.length >= 1) {
      const currentFolderId = folderIdStack[folderIdStack.length - 1];
      const newPayload = {
        folder_id: currentFolderId,
        client_id: clientId,
      };
      get(newPayload, '/getFoldersAndFilesOfFolder')
        .then((res) => {
          setSpinnerStatusToStore(false);
          setLoadingSuccessToStore();
          const result = apiValidation(res);
          setFileArray(result.files);
          setFolderArray(result.folders);
        })
        .catch((err) => {
          console.log(err);
          setSpinnerStatusToStore(false);
          setLoadingSuccessToStore();
        });
    }
  }, [
    clientId,
    clientUserId,
    folderIdStack,
    roleArray,
    pushFolderIDToFolderIDArrayInStore,
    setSpinnerStatusToStore,
    setLoadingSuccessToStore,
    setLoadingPendingToStore,
  ]);

  useEffect(() => {
    get({ client_user_id: clientUserId }, '/getFileCategoriesForStudent').then((res) => {
      console.log(res);
      const result = apiValidation(res);
      setCategoryArray(result);
    });
  }, [clientUserId]);

  const goToVideoPlayer = (elem, type) => {
    if (type === 'youtube')
      history.push({
        pathname: `/videoplayer/${elem.file_link}`,
        state: { videoId: elem.file_id },
      });
    else if (type === 'video')
      history.push({
        pathname: `/videoplayer`,
        state: { videoLink: elem.file_link, videoId: elem.file_id },
      });
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

  const openFolder = (elem) => {
    pushFolderIDToFolderIDArrayInStore(elem.folder_id);
  };

  const addButtonArray = [
    { name: 'add File', func: addNewFile },
    { name: 'add Folder', func: addNewFolder },
    { name: 'add Youtube Link', func: addYoutubeLink },
  ];

  const openContextMenu = (elem, type) => {
    setMenuOptions({
      ...menuOptions,
      type,
      status: elem.status,
      id: type === 'folder' ? elem.folder_id : elem.file_id,
      finalBatches: elem.final_batch,
      currentBatches: elem.current_batch,
      currentFolderName: elem.folder_name,
    });
    handleMenuShow();
  };

  const enterCategory = (id) => {
    history.push(`/studybin/categories/${id}`);
  };

  return (
    <>
      <StudyBinMenu
        kholdo={!roleArray.includes(1) && openMenu}
        handleClose={handleMenuClose}
        rerenderFilesAndFolders={rerenderFilesAndFolders}
        id={menuOptions.id}
        type={menuOptions.type}
        currentStatus={menuOptions.status}
        finalBatches={menuOptions.finalBatches}
        currentBatches={menuOptions.currentBatches}
        currentFolderName={menuOptions.currentFolderName}
      />
      <div className='StudyBin'>
        <PageHeader
          title='Library'
          search
          placeholder='Search for file or folder'
          searchFilter={searchFolder}
          customBack={folderIdStack.length > 1}
          handleBack={handleBack}
        />
        <div style={{ marginTop: '6rem' }} className='mx-4 mx-md-5'>
          {(folderIdStack.length === 1 || roleArray.includes(1)) && (
            <div className='mb-3'>
              <h6 className='StudyBin__heading'>
                Categories <span>({categoryArray.length})</span>
              </h6>
              {categoryArray.map((elem) => {
                return (
                  <Row
                    className='mr-1'
                    onClick={() => enterCategory(elem.category_id)}
                    key={elem.category_id}
                  >
                    <Col xs={2} className='my-auto' style={{ textAlign: 'center' }}>
                      <img
                        src={elem.category_icon}
                        alt='category icon'
                        height='24px'
                        width='24px'
                      />
                    </Col>
                    <Col
                      xs={10}
                      style={{
                        borderBottom: '1px solid rgba(112, 112, 112, 0.2)',
                        padding: '0.5rem',
                      }}
                    >
                      <span className='StudyBin__categoryText'>
                        {elem.category} ({elem.no_of_files})
                      </span>
                    </Col>
                  </Row>
                );
              })}
            </div>
          )}

          {folderArray.length === 0 && fileArray.length === 0 && (
            <h6 className='StudyBin__heading'>
              No Files or Folders found. In order to add new Files or Folders, please click on the{' '}
              <span>
                <AddIcon />
              </span>{' '}
              on the bottom right corner
            </h6>
          )}

          {folderArray.length > 0 && (
            <>
              <h6 className='StudyBin__heading'>
                Folders <span>({folderArray.length})</span>
              </h6>
              <Row className='container_studybin'>
                {folderArray
                  .filter((elem) => {
                    return elem.folder_name.includes(searchString);
                  })
                  .map((elem) => {
                    return (
                      <Col
                        xs={5}
                        md={4}
                        lg={3}
                        key={elem.folder_id}
                        className='p-2 StudyBin__box my-2 mx-2'
                        style={elem.status === 'active' ? {} : { opacity: '0.4' }}
                      >
                        <span
                          className='StudyBin__verticalDots'
                          onClick={() => openContextMenu(elem, 'folder')}
                          onKeyDown={() => openContextMenu(elem, 'folder')}
                          tabIndex='-1'
                          role='button'
                        >
                          <MoreVertIcon />
                        </span>
                        <div
                          className='m-2 text-center'
                          onKeyDown={() => openFolder(elem)}
                          onClick={() => openFolder(elem)}
                          role='button'
                          tabIndex='-1'
                        >
                          <img src={folder} alt='folder' className='folder_icon' />
                          <h6
                            className='text-center mt-3 StudyBin__folderName'
                            style={{ lineHeight: '1' }}
                          >
                            {elem.folder_name}
                          </h6>
                        </div>
                      </Col>
                    );
                  })}
              </Row>
            </>
          )}
          {fileArray.length > 0 && (
            <>
              <h6 className='StudyBin__heading mt-4'>
                Files <span>({fileArray.length})</span>
              </h6>
              <Row className='container_studybin'>
                {fileArray
                  .filter((elem) => {
                    return elem.file_name.includes(searchString);
                  })
                  .map((elem) => {
                    return (
                      <Col
                        xs={5}
                        md={4}
                        lg={3}
                        key={elem.file_id}
                        className='p-2 StudyBin__box my-2 mx-1'
                        style={elem.status === 'active' ? {} : { opacity: '0.4' }}
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
                              <h6
                                className='text-center mt-3 StudyBin__folderName'
                                style={{ lineHeight: '1' }}
                              >
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
                              <img src={videocam} alt='video' height='67' width='67' />
                              <h6
                                className='text-center mt-3 StudyBin__folderName'
                                style={{ wordBreak: 'break-all', lineHeight: '1' }}
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
                              <img src={images} alt='video' height='67' width='67' />
                              <h6
                                className='text-center mt-3 StudyBin__folderName'
                                style={{ wordBreak: 'break-all', lineHeight: '1' }}
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
                              <h6
                                className='text-center mt-3 StudyBin__folderName'
                                style={{ wordBreak: 'break-all' }}
                              >
                                {elem.file_name}
                              </h6>
                            </div>
                          </>
                        )}
                      </Col>
                    );
                  })}
              </Row>
            </>
          )}
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
  clientId: getClientId(state),
  clientUserId: getClientUserId(state),
  roleArray: getRoleArray(state),
  studyBinFolderIdArray: getStudyBinFolderIDArray(state),
});

const mapDispatchToProps = (dispatch) => {
  return {
    setFolderIdArrayToStore: (payload) => {
      dispatch(studyBinActions.setFolderIdArrayToStore(payload));
    },
    popFolderIDFromFolderIDArrayInStore: () => {
      dispatch(studyBinActions.popFolderIDFromFolderIDArrayInStore());
    },
    pushFolderIDToFolderIDArrayInStore: (payload) => {
      dispatch(studyBinActions.pushFolderIDToFolderIDArrayInStore(payload));
    },
    setLoadingPendingToStore: (payload) => {
      dispatch(loadingActions.pending());
    },
    setLoadingSuccessToStore: (payload) => {
      dispatch(loadingActions.success());
    },
    setSpinnerStatusToStore: (payload) => {
      dispatch(loadingActions.spinner(payload));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(StudyBin);

StudyBin.propTypes = {
  clientId: PropTypes.number.isRequired,
  clientUserId: PropTypes.number.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  roleArray: PropTypes.instanceOf(Array).isRequired,
  studyBinFolderIdArray: PropTypes.instanceOf(Array).isRequired,
  pushFolderIDToFolderIDArrayInStore: PropTypes.func.isRequired,
  popFolderIDFromFolderIDArrayInStore: PropTypes.func.isRequired,
  setSpinnerStatusToStore: PropTypes.func.isRequired,
  setLoadingPendingToStore: PropTypes.func.isRequired,
  setLoadingSuccessToStore: PropTypes.func.isRequired,
};
