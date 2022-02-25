/* eslint-disable react/jsx-curly-newline */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-shadow */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import Swal from 'sweetalert2';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import AssignmentIcon from '@material-ui/icons/Assignment';
import LockIcon from '@material-ui/icons/Lock';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import UnlockIcon from '@material-ui/icons/LockOpen';
import { responsesAreSame } from 'workbox-broadcast-update';
import './Courses.scss';

const ContentRow = (props) => {
  const {
    openTheContent,
    updateContent,
    removeSection,
    content,
    handleDragEnd,
    renameContent,
    makeContentFree,
  } = props;
  const [showMoreVertModal, setShowMoreVertModal] = useState(false);
  const [selectedContent, setSelectedContent] = useState({});
  const [newName, setNewName] = useState('');

  const getItemStyle = (isDragging, draggableStyle) => ({
    ...draggableStyle,
    opacity: isDragging ? '0.7' : '1',
  });

  const openMoreVertModal = (elem) => {
    setSelectedContent(elem);
    setShowMoreVertModal(true);
  };

  const closeMoreVertModal = () => setShowMoreVertModal(false);

  const startUpdatingContentName = () => {
    setNewName(selectedContent.name);
    const newContent = content.map((elem) => {
      if (elem.id === selectedContent.id) {
        elem.isUpdating = true;
      }
      return elem;
    });
    updateContent(newContent);
  };

  const stopUpdating = (e) => {
    e?.stopPropagation();
    const newContent = content.map((elem) => {
      elem.isUpdating = false;
      return elem;
    });
    updateContent(newContent);
  };

  return (
    <div className='mb-5 pb-5'>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId='facts'>
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {provided.placeholder}

              {content.length > 0 &&
                content.map((elem, i) => {
                  return (
                    <div key={elem.id}>
                      <Draggable draggableId={elem.id.toString()} index={i}>
                        {(provided, snapshot) => (
                          <div
                            className=''
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            ref={provided.innerRef}
                            style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                          >
                            <Row
                              className='Courses__adminCard justify-content-between p-2 m-2'
                              key={elem.id}
                              style={{
                                border: '1px solid rgba(112, 112, 112, 1)',
                                borderRadius: '5px',
                              }}
                            >
                              <Col
                                xs={1}
                                onClick={() =>
                                  openTheContent(
                                    elem.content_type === 'file'
                                      ? elem.file_type
                                      : elem.content_type,
                                    elem,
                                  )
                                }
                              >
                                <AssignmentIcon />
                              </Col>
                              <Col xs={8}>
                                <div
                                  tabIndex='-1'
                                  className='d-flex'
                                  role='button'
                                  onClick={() => {
                                    if (elem.isUpdating) return;
                                    openTheContent(
                                      elem.content_type === 'file'
                                        ? elem.file_type
                                        : elem.content_type,
                                      elem,
                                    );
                                  }}
                                  onKeyDown={() => {
                                    if (elem.isUpdating) return;
                                    openTheContent(
                                      elem.content_type === 'file'
                                        ? elem.file_type
                                        : elem.content_type,
                                      elem,
                                    );
                                  }}
                                >
                                  <div className='w-100'>
                                    {!elem.isUpdating ? (
                                      <h6 className='Courses__adminHeading mb-0'>{elem.name}</h6>
                                    ) : (
                                      <>
                                        <Row className='mx-0 mt-2'>
                                          <label
                                            className='has-float-label my-auto'
                                            style={{ width: '100%' }}
                                          >
                                            <input
                                              className='form-control'
                                              name='Name'
                                              type='text'
                                              value={newName}
                                              placeholder='Name'
                                              onChange={(e) => setNewName(e.target.value)}
                                            />
                                            <span>Name</span>
                                          </label>
                                        </Row>
                                        <Row className='m-0'>
                                          <div className='ml-auto'>
                                            <Button
                                              variant='boldTextSecondary'
                                              onClick={(e) => stopUpdating(e)}
                                            >
                                              Cancel
                                            </Button>
                                            <Button
                                              variant='boldText'
                                              onClick={() =>
                                                renameContent(selectedContent, newName).then(
                                                  (resp) => {
                                                    console.log(resp);
                                                    stopUpdating();
                                                    Swal.fire({
                                                      icon: 'success',
                                                      title: 'Success',
                                                      text: 'Content renamed successfully.',
                                                      confirmButtonText: `OK`,
                                                    });
                                                  },
                                                )
                                              }
                                            >
                                              Update
                                            </Button>
                                          </div>
                                        </Row>
                                      </>
                                    )}
                                    <p className='Courses__adminCardTime mb-0' />

                                    <p className='Courses__adminDuration mb-0'>
                                      Type:{' '}
                                      <span>
                                        {elem.content_type === 'file'
                                          ? elem.file_type
                                          : elem.content_type}
                                      </span>
                                    </p>
                                  </div>
                                </div>
                              </Col>
                              <Col
                                xs={1}
                                className='d-flex justify-content-center align-items-center p-0'
                              >
                                <div
                                  role='button'
                                  tabIndex='-1'
                                  // onClick={() => removeSection(elem)}
                                  // onKeyDown={() => removeSection(}
                                  style={{
                                    backgroundColor: '#fff',
                                    borderColor: '#fff',
                                    zIndex: '9',
                                    width: '100%',
                                    textAlign: 'center',
                                  }}
                                >
                                  {/* <CloseIcon /> */}
                                  {elem.is_free === 'false' ? (
                                    <LockIcon style={{ color: 'gray', marginRight: '5px' }} />
                                  ) : null}
                                </div>
                              </Col>
                              <Col
                                xs={1}
                                className='d-flex justify-content-end align-items-center p-0'
                              >
                                <div
                                  role='button'
                                  tabIndex='-1'
                                  onClick={() => openMoreVertModal(elem)}
                                  onKeyDown={() => openMoreVertModal(elem)}
                                  style={{
                                    backgroundColor: '#fff',
                                    borderColor: '#fff',
                                    zIndex: '9',
                                    width: '100%',
                                    textAlign: 'right',
                                  }}
                                >
                                  <MoreVertIcon />
                                </div>
                              </Col>
                            </Row>
                          </div>
                        )}
                      </Draggable>
                    </div>
                  );
                })}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <Modal show={showMoreVertModal} onHide={closeMoreVertModal} centered>
        <Modal.Body
          className='d-flex flex-column align-items-center '
          style={{ width: '90%', margin: 'auto' }}
        >
          <div
            role='button'
            tabIndex='-1'
            className='d-flex w-100 justify-content-between Courses__moreVertModalBodydiv'
            onClick={() => {
              // renameContent(selectedContent, newName);
              startUpdatingContentName();
              closeMoreVertModal();
            }}
            onKeyDown={() => {
              // renameContent(selectedContent, newName);
              startUpdatingContentName();
              closeMoreVertModal();
            }}
          >
            <p>Rename Content</p>
            <EditIcon />
          </div>
          <div
            role='button'
            tabIndex='-1'
            className='d-flex w-100 justify-content-between Courses__moreVertModalBodydiv'
            onClick={() => {
              makeContentFree(
                selectedContent,
                selectedContent.is_free === 'false' ? 'true' : 'false',
              );
              closeMoreVertModal();
            }}
            onKeyDown={() => {
              makeContentFree(
                selectedContent,
                selectedContent.is_free === 'false' ? 'true' : 'false',
              );
              closeMoreVertModal();
            }}
          >
            {selectedContent.is_free === 'false' ? (
              <p>Make Content Free</p>
            ) : (
              <p>Make Content Paid</p>
            )}
            {selectedContent.is_free === 'false' ? <UnlockIcon /> : <LockIcon />}
          </div>
          <div
            role='button'
            tabIndex='-1'
            className='d-flex w-100 justify-content-between Courses__moreVertModalBodydiv'
            onClick={() => {
              removeSection(selectedContent);
              closeMoreVertModal();
            }}
            onKeyDown={() => {
              removeSection(selectedContent);
              closeMoreVertModal();
            }}
          >
            <p>Delete Content</p>
            <DeleteIcon />
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ContentRow;

ContentRow.propTypes = {
  content: PropTypes.instanceOf(Array).isRequired,
  openTheContent: PropTypes.func.isRequired,
  removeSection: PropTypes.func.isRequired,
  renameContent: PropTypes.func.isRequired,
  makeContentFree: PropTypes.func.isRequired,
  handleDragEnd: PropTypes.func.isRequired,
  updateContent: PropTypes.func.isRequired,
};
