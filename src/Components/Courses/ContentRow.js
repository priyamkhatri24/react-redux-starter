/* eslint-disable react/jsx-curly-newline */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-shadow */

import React from 'react';
import PropTypes from 'prop-types';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import AssignmentIcon from '@material-ui/icons/Assignment';
import CloseIcon from '@material-ui/icons/Close';

const ContentRow = (props) => {
  const { openTheContent, removeSection, content, handleDragEnd } = props;

  const getItemStyle = (isDragging, draggableStyle) => ({
    ...draggableStyle,
    opacity: isDragging ? '0.7' : '1',
    //  backgroundColor: isDragging ? 'var(--primary-blue)' : '#fff',
    //  color: isDragging ? '#fff' : '#010102',
  });

  return (
    // <DragDropContext>
    //   {content.length > 0 &&
    //     content.map((elem) => {
    //       return (
    //         <Row
    //           className='LiveClasses__adminCard p-2 m-2'
    //           key={elem.id}
    //           style={{ border: '1px solid rgba(112, 112, 112, 1)', borderRadius: '5px' }}
    //         >
    //           <Col
    //             xs={2}
    //             onClick={() =>
    //               openTheContent(
    //                 elem.content_type === 'file' ? elem.file_type : elem.content_type,
    //                 elem,
    //               )
    //             } // eslint-disable-line
    //           >
    //             <AssignmentIcon />
    //           </Col>
    //           <Col xs={8}>
    //             <Button
    //               style={{
    //                 backgroundColor: '#fff',
    //                 borderColor: '#fff',
    //                 padding: 0,
    //                 textAlign: 'left',
    //                 width: '100%',
    //               }}
    //               variant='light'
    //               onClick={() =>
    //                 openTheContent(
    //                   elem.content_type === 'file' ? elem.file_type : elem.content_type,
    //                   elem,
    //                 )
    //               } // eslint-disable-line
    //             >
    //               <h6 className='LiveClasses__adminHeading mb-0'>{elem.name}</h6>
    //               <p className='LiveClasses__adminCardTime mb-0' />

    //               <p className='LiveClasses__adminDuration mb-0'>
    //                 Type:{' '}
    //                 <span>{elem.content_type === 'file' ? elem.file_type : elem.content_type}</span>
    //               </p>
    //             </Button>
    //           </Col>
    //           <Col xs={2} className='d-flex justify-content-center align-items-center p-0'>
    //             <Button
    //               onClick={() => removeSection(elem)}
    //               style={{
    //                 backgroundColor: '#fff',
    //                 borderColor: '#fff',
    //                 zIndex: '9',
    //                 width: '100%',
    //                 textAlign: 'center',
    //               }}
    //               variant='light'
    //             >
    //               <CloseIcon />
    //             </Button>
    //           </Col>
    //         </Row>
    //       );
    //     })}
    // </DragDropContext>
    <div className='mb-5 pb-5'>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId='facts'>
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {provided.placeholder}

              {content.length > 0 &&
                content.map((elem, i) => {
                  return (
                    <div key={elem.file_link}>
                      <Draggable draggableId={elem.file_link} index={i}>
                        {(provided, snapshot) => (
                          <div
                            className=''
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            ref={provided.innerRef}
                            style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                          >
                            <Row
                              className='LiveClasses__adminCard p-2 m-2'
                              key={elem.id}
                              style={{
                                border: '1px solid rgba(112, 112, 112, 1)',
                                borderRadius: '5px',
                              }}
                            >
                              <Col
                                xs={2}
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
                                  role='button'
                                  onClick={() =>
                                    openTheContent(
                                      elem.content_type === 'file'
                                        ? elem.file_type
                                        : elem.content_type,
                                      elem,
                                    )
                                  }
                                  onKeyDown={() =>
                                    openTheContent(
                                      elem.content_type === 'file'
                                        ? elem.file_type
                                        : elem.content_type,
                                      elem,
                                    )
                                  }
                                >
                                  <h6 className='LiveClasses__adminHeading mb-0'>{elem.name}</h6>
                                  <p className='LiveClasses__adminCardTime mb-0' />

                                  <p className='LiveClasses__adminDuration mb-0'>
                                    Type:{' '}
                                    <span>
                                      {elem.content_type === 'file'
                                        ? elem.file_type
                                        : elem.content_type}
                                    </span>
                                  </p>
                                </div>
                              </Col>
                              <Col
                                xs={2}
                                className='d-flex justify-content-center align-items-center p-0'
                              >
                                <div
                                  role='button'
                                  tabIndex='-1'
                                  onClick={() => removeSection(elem)}
                                  onKeyDown={() => removeSection(elem)}
                                  style={{
                                    backgroundColor: '#fff',
                                    borderColor: '#fff',
                                    zIndex: '9',
                                    width: '100%',
                                    textAlign: 'center',
                                  }}
                                >
                                  <CloseIcon />
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
    </div>
  );
};

export default ContentRow;

ContentRow.propTypes = {
  content: PropTypes.instanceOf(Array).isRequired,
  openTheContent: PropTypes.func.isRequired,
  removeSection: PropTypes.func.isRequired,
  handleDragEnd: PropTypes.func.isRequired,
};
