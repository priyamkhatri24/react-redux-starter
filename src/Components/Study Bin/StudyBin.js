import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import AddIcon from '@material-ui/icons/Add';

import MoreVertIcon from '@material-ui/icons/MoreVert';
import folder from '../../assets/images/FilesFolders/folderIcon.svg';
import doc from '../../assets/images/FilesFolders/doc.svg';
import docx from '../../assets/images/FilesFolders/docx.svg';
import pdf from '../../assets/images/FilesFolders/pdf.svg';
import ppt from '../../assets/images/FilesFolders/ppt.svg';
import xls from '../../assets/images/FilesFolders/xls.svg';
import txt from '../../assets/images/FilesFolders/txt.svg';
import ext from '../../assets/images/FilesFolders/external.svg';
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
import BottomNavigation from '../Common/BottomNavigation/BottomNavigation';
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
  const [isMove, setIsMove] = useState(false);
  const [isCopy, setIsCopy] = useState(false);
  const [selectedToMove, setSelectedToMove] = useState([]);
  const [selectedFreezed, setSelectedFreezed] = useState(false);
  const [presentFolderId, setPresentFolderId] = useState(null);
  const [externalName, setExternalName] = useState('');
  const [externalLink, setExternalLink] = useState('');
  const [triggerFilterModal, setTriggerFilterModal] = useState(false);
  const [showExternalLinkModal, setShowExternalLinkModal] = useState(false);
  const [sortBy, setSortBy] = useState('date');
  const [menuOptions, setMenuOptions] = useState({
    id: 0,
    type: '',
    status: '',
    finalBatches: [],
    currentBatches: [],
    currentFolderName: '',
    createdAt: '',
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
    const lowerCaseSearch = search.toLowerCase();
    setSearchString(lowerCaseSearch);
  };

  const addNewFolder = () => {
    console.log('folder clicked');
    handleShow();
  };

  const rerenderForLength2 = () => {
    setSpinnerStatusToStore(true);
    setLoadingPendingToStore();
    const temp = {
      client_user_id: clientUserId,
      client_id: clientId,
      is_admin: roleArray.includes(4),
      sort_by: sortBy,
    };
    console.log(temp, folderIdStack);
    get(temp, '/getPrimaryFoldersAndFiles2') // instead of temp should be [payload]
      .then((res) => {
        setSpinnerStatusToStore(false);
        setLoadingSuccessToStore();
        console.log(res, 'getPrimaryFoldersAndFiles2');
        const result = apiValidation(res);
        setFileArray(result.files);
        setFolderArray(result.folders);
        // pushFolderIDToFolderIDArrayInStore(result.client_folder_id);
      })
      .catch((err) => console.log(err));
  };

  const rerenderFilesAndFolders = () => {
    const temp = {
      client_user_id: clientUserId,
      client_id: clientId,
      is_admin: roleArray.includes(4),
      sort_by: sortBy,
    };
    console.log(temp, folderIdStack);
    if (folderIdStack.length <= 1) {
      console.log('rerendering.......................');
      get(temp, '/getPrimaryFoldersAndFiles2') // instead of temp should be [payload]
        .then((res) => {
          console.log(res, 'getPrimaryFoldersAndFiles2');
          const result = apiValidation(res);
          setFileArray(result.files);
          setFolderArray(result.folders);
          pushFolderIDToFolderIDArrayInStore(result.client_folder_id);
        })
        .catch((err) => console.log(err));
    } else {
      const currentFolderId = folderIdStack[folderIdStack.length - 1];
      const roleId = roleArray.includes(4)
        ? 4
        : roleArray.includes(3)
        ? 3
        : roleArray.includes(2)
        ? 2
        : 1;
      const newPayload = {
        folder_id: currentFolderId,
        client_id: clientId,
        client_user_id: clientUserId,
        role_id: roleId,
        sort_by: sortBy,
      };
      get(newPayload, '/getFoldersAndFilesOfFolder2')
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

  const openExternalLinkModal = () => setShowExternalLinkModal(true);

  const addExternalLink = () => {
    const payload = {
      client_user_id: clientUserId,
      folder_id: folderIdStack[folderIdStack.length - 1],
      file_name: externalName,
      file_link: externalLink,
      file_type: 'external',
    };
    post(payload, '/addFile')
      .then((res) => {
        console.log(res);
        setShowExternalLinkModal(false);
        rerenderFilesAndFolders();
      })
      .catch((e) => console.log(e));
  };

  const addNewFile = (files) => {
    const filesArray = files.map((elem) => {
      console.log(elem, 'SBELEM');
      const obj = {};
      obj.file_link = elem.filename;
      obj.file_name = elem.name;
      const extension = elem.name.slice(((elem.name.lastIndexOf('.') - 1) >>> 0) + 2).toLowerCase(); // eslint-disable-line
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
          : extension === 'mp3'
          ? '.mp4'
          : extension === 'mkv'
          ? '.mp4'
          : extension === 'mov'
          ? '.mp4'
          : extension === '3gp'
          ? '.mp4'
          : extension === 'flv'
          ? '.mp4'
          : extension === 'm4v'
          ? '.mp4'
          : extension === 'avi'
          ? '.mp4'
          : extension === 'jpg'
          ? '.jpg'
          : extension === 'tiff'
          ? '.jpg'
          : extension === 'webp'
          ? '.jpg'
          : extension === 'bmp'
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
        console.log(res, 'SBUPL');
        rerenderFilesAndFolders();
      })
      .catch((e) => console.log(e));
  };

  const addYoutubeLink = () => {
    history.push('/addyoutubevideo');
  };

  const handleBack = () => {
    if (folderIdStack.length >= 1) {
      popFolderIDFromFolderIDArrayInStore();
      if (folderIdStack.length === 2) {
        rerenderForLength2();
      } else rerenderFilesAndFolders();
    } else {
      history.push('/');
      popFolderIDFromFolderIDArrayInStore();
    }
  };

  useEffect(() => {
    setFolderIdStack(studyBinFolderIdArray);
  }, [studyBinFolderIdArray]);

  useEffect(() => {
    console.log('useeffecting........................................');
    const payload = {
      client_user_id: clientUserId,
      client_id: clientId,
      sort_by: sortBy,
    };

    if (folderIdStack.length < 1) {
      setSpinnerStatusToStore(true);
      setLoadingPendingToStore();
      if (roleArray.includes(3) || roleArray.includes(4)) {
        const temp = {
          client_user_id: clientUserId,
          is_admin: roleArray.includes(4),
          client_id: clientId,
          sort_by: sortBy,
        };
        console.log(temp, 'getPrimaryFoldersAndFiles2Payload');
        get(temp, '/getPrimaryFoldersAndFiles2') // instead of temp should be [payload]
          .then((res) => {
            console.log(res, 'getPrimaryFoldersAndFiles2');
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
    } else if (folderIdStack.length > 1) {
      setSpinnerStatusToStore(true);
      setLoadingPendingToStore();
      const currentFolderId = folderIdStack[folderIdStack.length - 1];
      const roleId = roleArray.includes(4)
        ? 4
        : roleArray.includes(3)
        ? 3
        : roleArray.includes(2)
        ? 2
        : 1;
      const newPayload = {
        folder_id: currentFolderId,
        client_id: clientId,
        client_user_id: clientUserId,
        role_id: roleId,
        sort_by: sortBy,
      };
      get(newPayload, '/getFoldersAndFilesOfFolder2')
        .then((res) => {
          setSpinnerStatusToStore(false);
          setLoadingSuccessToStore();
          const result = apiValidation(res);
          setFileArray(result.files);
          setFolderArray(result.folders);
          console.log(result, 'getFoldersAndFilesOfFoleder2');
        })
        .catch((err) => {
          console.log(err);
          setSpinnerStatusToStore(false);
          setLoadingSuccessToStore();
        });
    } else if (folderIdStack.length === 1) {
      setSpinnerStatusToStore(true);
      setLoadingPendingToStore();
      if (roleArray.includes(3) || roleArray.includes(4)) {
        const temp = {
          client_user_id: clientUserId,
          is_admin: roleArray.includes(4),
          client_id: clientId,
          sort_by: sortBy,
        };
        console.log(temp, 'getPrimaryFoldersAndFiles2Payload');
        get(temp, '/getPrimaryFoldersAndFiles2') // instead of temp should be [payload]
          .then((res) => {
            console.log(res, 'getPrimaryFoldersAndFiles2');
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
    }
  }, [folderIdStack, sortBy]);

  useEffect(() => {
    get({ client_user_id: clientUserId, client_id: clientId }, '/getFileCategoriesForStudent').then(
      (res) => {
        console.log(res);
        const result = apiValidation(res);
        setCategoryArray(result);
      },
    );
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
        state: {
          videoLink: elem.file_link,
          videoId: elem.file_id,
          videoLinkArray: elem.file_link_array,
        },
      });
  };

  const openFileView = (elem) => {
    console.log(elem);
    const fileType = elem.file_type.replace(/\./g, ''); // removes the . form .doc / .ppt etc
    fileType.includes('pdf') ||
    fileType.includes('pd') ||
    (fileType.includes('file') && linkExtention(elem.file_link).includes('pdf'))
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
    // rerenderFilesAndFolders();
  };

  const addButtonArray = [
    { name: 'add File', func: addNewFile },
    { name: 'add Folder', func: addNewFolder },
    { name: 'add Youtube Link', func: addYoutubeLink },
    { name: 'add External Link', func: openExternalLinkModal },
  ];

  const openContextMenu = (elem, type) => {
    console.log(elem, 'elememememm');
    const getBatchesPayload =
      type === 'folder'
        ? { folder_id: elem.folder_id, client_id: clientId }
        : { file_id: elem.file_id, client_id: clientId };
    get(getBatchesPayload, type === 'folder' ? '/getBatchesOfFolder' : '/getBatchesOfFile').then(
      (res) => {
        console.log(res, 'getBatchesOfFolder');
        const batches = apiValidation(res);
        setMenuOptions({
          ...menuOptions,
          type,
          status: elem.status,
          id: type === 'folder' ? elem.folder_id : elem.file_id,
          finalBatches: batches.final_batch,
          currentBatches: batches.current_batch,
          currentFolderName: elem.folder_name,
          createdAt: elem.created_at,
        });
        handleMenuShow();
      },
    );
  };

  const enterCategory = (id) => {
    history.push(`/studybin/categories/${id}`);
  };

  const handleMove = () => {
    setIsMove(true);
    setIsCopy(false);
    setPresentFolderId(folderIdStack[folderIdStack.length - 1]);
    const { id, type } = menuOptions;
    const selectedArray = [...selectedToMove];
    selectedArray.push({ id, type });
    setSelectedToMove(selectedArray);
    console.log(selectedArray, menuOptions);
    handleMenuClose();
    console.log('moved');
  };

  const handleCopy = () => {
    console.log('copied');
    setIsMove(false);
    setIsCopy(true);
    setPresentFolderId(folderIdStack[folderIdStack.length - 1]);
    const { id, type } = menuOptions;
    if (type === 'folder') {
      handleMenuClose();
      return;
    }
    const selectedArray = [...selectedToMove];
    selectedArray.push({ id, type });
    setSelectedToMove(selectedArray);
    console.log(selectedArray, menuOptions);
    handleMenuClose();
  };

  const cancelMovingAndCopying = () => {
    setIsMove(false);
    setIsCopy(false);
    setSelectedFreezed(false);
    setSelectedToMove([]);
  };

  const toggleFromSelectedArray = (elem) => {
    console.log(elem);
    const id = elem.folder_id ? elem.folder_id : elem.file_id;
    const type = elem.folder_id ? 'folder' : elem.file_id ? 'file' : null;
    if (selectedToMove.find((ele) => ele.id === id)) {
      const selectedArray = [...selectedToMove];
      const index = selectedArray.findIndex((ele) => ele.id === id);
      selectedArray.splice(index, 1);
      setSelectedToMove(selectedArray);
      console.log(selectedArray, 'selectedToMoveArrayyy');
    } else {
      setSelectedToMove([...selectedToMove, { type, id }]);
      console.log([...selectedToMove, { type, id }]);
    }
  };

  const freezeSelectedHandler = () => {
    setSelectedFreezed(true);
    window.scroll({ top: 0, behavior: 'smooth' });
  };

  const copyOrMoveSelectedItems = () => {
    console.log(selectedToMove, 'donee');
    const payload = {
      client_user_id: clientUserId,
      object_array: JSON.stringify(selectedToMove),
      destination_folder_id: folderIdStack[folderIdStack.length - 1],
      present_folder_id: presentFolderId,
      operation: isMove ? 'move' : isCopy ? 'copy' : null,
    };
    console.log(payload);
    post(payload, '/copyOrMoveMultipleFile').then((res) => {
      console.log(res);
      rerenderFilesAndFolders();
      setSelectedToMove([]);
      setSelectedFreezed(false);
      setIsMove(false);
      setIsCopy(false);
    });
  };

  const openExternalLink = (elem) => window.open(elem.file_link, '_blank');

  const closeTriggerFilterModal = () => setTriggerFilterModal(false);

  const updateSortBy = (value) => {
    setSortBy(value);
    closeTriggerFilterModal();
  };

  const linkExtention = (link) => {
    return link.slice(link.length - 3, link.length).toLowerCase();
  };

  return (
    <>
      <StudyBinMenu
        kholdo={!roleArray.includes(1) && openMenu}
        handleClose={handleMenuClose}
        rerenderFilesAndFolders={rerenderFilesAndFolders}
        id={menuOptions.id}
        type={menuOptions.type}
        createdAt={menuOptions.createdAt}
        currentStatus={menuOptions.status}
        finalBatches={menuOptions.finalBatches}
        currentBatches={menuOptions.currentBatches}
        currentFolderName={menuOptions.currentFolderName}
        handleMove={handleMove}
        handleCopy={handleCopy}
        clientUserId={clientUserId}
      />
      <div className='StudyBin'>
        <PageHeader
          title='Library'
          search
          placeholder='Search for file or folder'
          filter
          triggerFilters={() => setTriggerFilterModal(true)}
          searchFilter={searchFolder}
          customBack={folderIdStack.length > 1}
          handleBack={handleBack}
        />
        <div style={{ marginTop: '6rem' }} className='mx-4 mx-md-5'>
          {(folderIdStack.length === 1 || roleArray.includes(1)) && (
            <div className='mb-3'>
              {categoryArray.length > 0 ? (
                <h6 className='StudyBin__heading'>
                  Categories <span>({categoryArray.length})</span>
                </h6>
              ) : null}
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
                    return elem.folder_name.toLowerCase().includes(searchString);
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
                        {isMove ? (
                          <Form.Group controlId='formBasicCheckbox'>
                            <Form.Check
                              type='checkbox'
                              disabled={selectedFreezed}
                              onChange={() => toggleFromSelectedArray(elem)}
                              checked={selectedToMove.find(
                                (ele) => ele.id === elem.file_id || ele.id === elem.folder_id,
                              )}
                            />
                          </Form.Group>
                        ) : null}
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
                    return elem.file_name.toLowerCase().includes(searchString);
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
                        {isMove || isCopy ? (
                          <Form.Group controlId='formBasicCheckbox'>
                            <Form.Check
                              type='checkbox'
                              disabled={selectedFreezed}
                              onChange={() => toggleFromSelectedArray(elem)}
                              checked={selectedToMove.find(
                                (ele) => ele.id === elem.file_id || ele.id === elem.folder_id,
                              )}
                            />
                          </Form.Group>
                        ) : null}
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
                        ) : elem.file_type === 'video' || elem.file_type.includes('mp4') ? (
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
                                style={{ lineHeight: '1' }}
                              >
                                {elem.file_name}
                              </h6>
                            </div>
                          </>
                        ) : elem.file_type.includes('jp') ||
                          (elem.file_type.includes('file') &&
                            linkExtention(elem.file_link).includes('jpg')) ||
                          (elem.file_type.includes('file') &&
                            linkExtention(elem.file_link).includes('png')) ||
                          (elem.file_type.includes('file') &&
                            linkExtention(elem.file_link).includes('svg')) ||
                          elem.file_type.includes('png') ||
                          elem.file_type.includes('svg') ||
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
                                style={{ lineHeight: '1' }}
                              >
                                {elem.file_name}
                              </h6>
                            </div>
                          </>
                        ) : elem.file_type === 'external' ? (
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
                              onClick={() => openExternalLink(elem)}
                              onKeyDown={() => openExternalLink(elem)}
                              role='button'
                              tabIndex='-1'
                            >
                              <img src={ext} alt='External Link' height='67' width='67' />
                              <h6
                                className='text-center mt-3 StudyBin__folderName'
                                style={{ lineHeight: '1' }}
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
                                  elem.file_type.includes('doc') ||
                                  (elem.file_type.includes('file') &&
                                    linkExtention(elem.file_link).includes('doc'))
                                    ? doc
                                    : elem.file_type.includes('docx') ||
                                      (elem.file_type.includes('file') &&
                                        linkExtention(elem.file_link).includes('ocx'))
                                    ? docx
                                    : elem.file_type.includes('pdf')
                                    ? pdf
                                    : elem.file_type.includes('ppt') ||
                                      elem.file_type.includes('pptx') ||
                                      (elem.file_type.includes('file') &&
                                        linkExtention(elem.file_link).includes('ppt')) ||
                                      (elem.file_type.includes('file') &&
                                        linkExtention(elem.file_link).includes('ptx'))
                                    ? ppt
                                    : elem.file_type.includes('csv') ||
                                      elem.file_type.includes('xls') ||
                                      elem.file_type.includes('xlsx') ||
                                      (elem.file_type.includes('file') &&
                                        linkExtention(elem.file_link).includes('xls')) ||
                                      (elem.file_type.includes('file') &&
                                        linkExtention(elem.file_link).includes('lsx')) ||
                                      (elem.file_type.includes('file') &&
                                        linkExtention(elem.file_link).includes('csv'))
                                    ? xls
                                    : elem.file_type.includes('file') &&
                                      linkExtention(elem.file_link).includes('pdf')
                                    ? pdf
                                    : txt
                                }
                                alt='file'
                                height='67'
                                width='86'
                              />
                              <h6
                                className='text-center mt-3 StudyBin__folderName'
                                // style={{ wordBreak: 'break-all' }}
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
        <AddButton
          addButtonArray={addButtonArray}
          clientId={clientId}
          folderId={folderIdStack.length ? folderIdStack[folderIdStack.length - 1] : ''}
        />
      )}
      <BottomNavigation activeNav='studyBin' history={history} />

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

      <Modal show={showExternalLinkModal} onHide={() => setShowExternalLinkModal(false)} centered>
        <Modal.Header style={{ fontFamily: 'Montserrat-Bold' }} closeButton>
          Add External Link
        </Modal.Header>
        <Modal.Body>
          <label className='has-float-label my-3'>
            <input
              className='form-control'
              name='File Name'
              type='text'
              placeholder='File Name'
              onChange={(e) => setExternalName(e.target.value)}
            />
            <span>File Name</span>
          </label>
          <label className='has-float-label my-3'>
            <input
              className='form-control'
              name='File Link'
              type='text'
              placeholder='File Name'
              onChange={(e) => setExternalLink(e.target.value)}
            />
            <span>File Link</span>
          </label>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='boldTextSecondary' onClick={() => setShowExternalLinkModal(false)}>
            Cancel
          </Button>
          <Button
            disabled={!externalName && !externalLink}
            variant='boldText'
            onClick={addExternalLink}
          >
            Add Link
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showImageModal} onHide={handleImageClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Uploaded Image</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <img src={imgLink} alt='img' className='img-fluid' />
        </Modal.Body>
      </Modal>

      <Modal show={triggerFilterModal} onHide={closeTriggerFilterModal} centered>
        <Modal.Header>
          <Modal.Title style={{ fontFamily: 'Montserrat-Regular' }}>Select filter type</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div
            onClick={() => updateSortBy('name')}
            onKeyDown={() => updateSortBy('name')}
            className='studyBinFilterModalButtons'
            tabIndex={-1}
            role='button'
          >
            Alphabetical
          </div>
          <div
            onClick={() => updateSortBy('date')}
            onKeyDown={() => updateSortBy('date')}
            className='studyBinFilterModalButtons'
            tabIndex={-1}
            role='button'
          >
            Date wise
          </div>
        </Modal.Body>
      </Modal>

      {isMove && !selectedFreezed ? (
        <Alert className='alertModalToCopyAndMove' variant='secondary'>
          {/* Click to move selected files and folders{' '} */}
          <Button onClick={freezeSelectedHandler}>Move selected items</Button>
          <Button variant='secondary' onClick={cancelMovingAndCopying}>
            Cancel
          </Button>
        </Alert>
      ) : null}
      {isCopy && !selectedFreezed ? (
        <Alert className='alertModalToCopyAndMove' variant='secondary'>
          {/* Click to move selected files */}
          <Button onClick={freezeSelectedHandler}>Copy selected items</Button>
          <Button variant='secondary' onClick={cancelMovingAndCopying}>
            Cancel
          </Button>
        </Alert>
      ) : null}
      {selectedFreezed ? (
        <Alert className='alertModalToPaste' variant='secondary'>
          <Button className='mx-2' onClick={copyOrMoveSelectedItems}>
            {isMove ? 'Move here' : isCopy ? 'Paste here' : null}
          </Button>
          <Button className='mx-2' variant='secondary' onClick={cancelMovingAndCopying}>
            Cancel
          </Button>
        </Alert>
      ) : null}
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
