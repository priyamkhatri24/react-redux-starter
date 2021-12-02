import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import CachedIcon from '@material-ui/icons/Cached';
import MoveIcon from '@material-ui/icons/Folder';
import CopyIcon from '@material-ui/icons/FileCopy';
import DeleteIcon from '@material-ui/icons/Delete';
import CreateIcon from '@material-ui/icons/Create';
import { post } from '../../Utilities';
import { BatchesSelector } from '../Common';

const StudyBinMenu = (props) => {
  const {
    kholdo,
    clientUserId,
    createdAt,
    rerenderFilesAndFolders,
    handleClose,
    type,
    currentStatus,
    id,
    currentBatches,
    finalBatches,
    currentFolderName,
    fromRecording,
    handleMove,
    handleCopy,
  } = props;
  const [showRenameModal, setShowRenameModal] = useState(false);
  const handleRenameClose = () => setShowRenameModal(false);
  const handleRenameOpen = () => setShowRenameModal(true);
  const [newName, setNewName] = useState(currentFolderName);
  const [batches, setBatches] = useState([]);
  const [removedBatches, setRemovedBatches] = useState([]);
  const [allBatches, setAllBatches] = useState([]);
  const [showBatchModal, setShowBatchModal] = useState(false);

  const openBatchModal = () => setShowBatchModal(true);
  const closeBatchModal = () => setShowBatchModal(false);

  useEffect(() => {
    console.log(currentFolderName);
    setNewName(currentFolderName);
  }, [currentFolderName]);

  useEffect(() => {
    setBatches(currentBatches);
    setAllBatches(finalBatches);
  }, [currentBatches, finalBatches]);

  const shareWithBatch = () => {
    let payload;
    if (type === 'folder') {
      payload = {
        folder_id: id,
        batch_add: JSON.stringify(batches),
        batch_remove: JSON.stringify(allBatches.filter((e) => e.user_id !== null)),
      };

      post(payload, '/addFolderToBatch').then((res) => {
        if (res.success) {
          rerenderFilesAndFolders();
          closeBatchModal();
          handleClose();
        }
      });
    } else {
      payload = {
        file_id: id,
        batch_add: JSON.stringify(batches),
        batch_remove: JSON.stringify(allBatches.filter((e) => e.user_id !== null)),
      };

      post(payload, '/addFileToBatch').then((res) => {
        if (res.success) {
          rerenderFilesAndFolders();
          closeBatchModal();
          handleClose();
        }
      });
    }
  };

  const changeStatus = (elem) => {
    let payload;
    if (type === 'folder') {
      payload = {
        folder_id: id,
        status: `${
          elem === 'Delete' ? 'deleted' : currentStatus === 'active' ? 'inactive' : 'active'
        }`,
      };

      post(payload, '/changeFolderStatus').then((res) => {
        if (res.success) {
          rerenderFilesAndFolders();
          handleClose();
        }
      });
    } else {
      payload = {
        file_id: id,
        status: `${
          elem === 'Delete' ? 'deleted' : currentStatus === 'active' ? 'inactive' : 'active'
        }`,
      };

      post(payload, '/changeFileStatus').then((res) => {
        if (res.success) {
          rerenderFilesAndFolders();
          handleClose();
        }
      });
    }
  };

  const changeRecordingStatus = (elem) => {
    const payload = {
      stream_name: id,
      status: `${
        elem === 'Delete' ? 'deleted' : currentStatus === 'active' ? 'inactive' : 'active'
      }`,
    };

    post(payload, '/changeLiveRecordingFileStatus').then((res) => {
      if (res.success) {
        rerenderFilesAndFolders();
        handleClose();
      }
    });
  };

  const renameElement = () => {
    console.log(newName);
    let payload;
    if (type === 'folder') {
      payload = {
        folder_id: id,
        folder_name: newName,
      };
      post(payload, '/changeFolderName').then((res) => {
        if (res.success) {
          rerenderFilesAndFolders();
          handleRenameClose();
          handleClose();
        }
      });
    } else {
      payload = {
        file_id: id,
        file_name: newName,
      };
      post(payload, '/changeFileName').then((res) => {
        if (res.success) {
          rerenderFilesAndFolders();
          handleRenameClose();
          handleClose();
        }
      });
    }
  };

  const getSelectedBatches = (allbatches, selectedBatches, removed) => {
    setBatches(selectedBatches);
    setAllBatches(allbatches);
    setRemovedBatches(removed);
    console.log(removed, 'removedddd');
  };

  const shareRecordingWithBatch = () => {
    const payload = {
      stream_name: id,
      batch_remove: JSON.stringify(batches),
      batch_add: JSON.stringify(removedBatches),
      client_user_id: clientUserId,
      created_at: createdAt,
    };

    console.log(payload);

    post(payload, '/shareRecordedStream').then((res) => {
      console.log(res);
      if (res.success) {
        rerenderFilesAndFolders();
        closeBatchModal();
        handleClose();
      }
    });
  };

  return (
    <>
      <Modal show={kholdo} onHide={handleClose} centered>
        <Modal.Body>
          {[
            { text: 'Share', func: openBatchModal },
            { text: 'Make Inactive', func: changeStatus },
            { text: 'Delete', func: fromRecording ? changeRecordingStatus : changeStatus },
            { text: 'Rename', func: handleRenameOpen },
            { text: 'Move', func: handleMove },
            { text: 'Copy', func: handleCopy },
          ]
            .filter((e) => !fromRecording || e.text !== 'Rename')
            .map((elem, i) => {
              return (
                <Row key={elem.text} onClick={() => elem.func(elem.text)} className='m-2'>
                  <Col xs={2}>
                    <span style={{ height: '24px', width: '24px' }}>
                      {i === 0 ? (
                        <PersonAddIcon />
                      ) : i === 1 ? (
                        <CachedIcon />
                      ) : i === 2 ? (
                        <DeleteIcon />
                      ) : i === 3 ? (
                        <CreateIcon />
                      ) : i === 4 ? (
                        <MoveIcon />
                      ) : (
                        <CopyIcon />
                      )}
                    </span>
                  </Col>
                  <Col xs={8} className='p-0 StudyBin__categoryText my-auto'>
                    {elem.text}
                  </Col>
                </Row>
              );
            })}
        </Modal.Body>
      </Modal>

      <Modal show={showRenameModal} onHide={handleRenameClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Rename Folder</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <label className='has-float-label my-auto'>
            <input
              className='form-control'
              name='Name'
              type='text'
              placeholder='Name'
              onChange={(e) => setNewName(e.target.value)}
              value={newName}
            />
            <span>Name</span>
          </label>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='dashboardBlueOnWhite' onClick={() => renameElement()}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showBatchModal} onHide={closeBatchModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Select Batches</Modal.Title>
        </Modal.Header>
        <BatchesSelector
          batches={allBatches}
          getSelectedBatches={getSelectedBatches}
          title='Batches'
          selectBatches={batches}
          sendBoth
        />
        <Modal.Footer>
          <Button
            variant='boldText'
            onClick={fromRecording ? () => shareRecordingWithBatch() : () => shareWithBatch()}
          >
            Done
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default StudyBinMenu;

StudyBinMenu.propTypes = {
  kholdo: PropTypes.bool.isRequired,
  clientUserId: PropTypes.number.isRequired,
  createdAt: PropTypes.string.isRequired,
  handleMove: PropTypes.func.isRequired,
  handleCopy: PropTypes.func.isRequired,
  rerenderFilesAndFolders: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
  currentStatus: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
  currentBatches: PropTypes.instanceOf(Array).isRequired,
  finalBatches: PropTypes.instanceOf(Array).isRequired,
  currentFolderName: PropTypes.string.isRequired,
  fromRecording: PropTypes.bool,
};

StudyBinMenu.defaultProps = {
  fromRecording: false,
};
