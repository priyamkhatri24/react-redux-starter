import React, { useState, useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import Swal from 'sweetalert2';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import AssignmentIcon from '@material-ui/icons/Assignment';
import CloseIcon from '@material-ui/icons/Close';
import PhotoLibraryIcon from '@material-ui/icons/PhotoLibrary';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';
import VideocamIcon from '@material-ui/icons/Videocam';
import { AddButton, PageHeader } from '../Common';
import {
  apiValidation,
  get,
  post,
  propComparator,
  uploadImage,
  verifyIsImage,
  verifyIsVideo,
  verifyIsFile,
} from '../../Utilities';
import {
  getCourseAddContentTestId,
  getCourseCurrentSectionId,
  getCourseCurrentSectionName,
  getCourseSectionPriorityOrder,
} from '../../redux/reducers/course.reducer';
import { homeworkActions } from '../../redux/actions/homework.action';
import { getClientUserId } from '../../redux/reducers/clientUserId.reducer';
import { courseActions } from '../../redux/actions/course.action';

const AddContent = (props) => {
  const {
    history: {
      push,
      location: { state: { draft, videoId, title } = {} },
    },
    history,
    sectionId,
    sectionName,
    setSelectedQuestionArrayToStore,
    clientUserId,
    setCourseSectionPriorityOrderToStore,
    courseSectionPriorityOrder,
    courseAddContentTestId,
    setCourseAddContentTestIdToStore,
  } = props;
  const [showModal, setShowModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [content, setContent] = useState([]);
  const [imgLink, setImgLink] = useState('');
  const handleClose = () => setShowModal(false);
  const handleOpen = () => setShowModal(true);
  const handleImageOpen = () => setShowImageModal(true);
  const handleImageClose = () => setShowImageModal(false);
  const courseImage = useRef('');
  const courseVideo = useRef('');
  const courseVideoRef = useRef(null);
  const courseImageRef = useRef(null);
  const courseFileRef = useRef(null);

  const getSectionContent = useCallback(() => {
    get({ section_id: sectionId }, '/getSectionContent').then((resp) => {
      console.log(resp);
      const result = apiValidation(resp);
      result.sort(propComparator('priority_order'));
      setCourseSectionPriorityOrderToStore(result.length);
      setContent(result);
    });
  }, [sectionId, setCourseSectionPriorityOrderToStore]);

  useEffect(() => {
    getSectionContent();
  }, [getSectionContent]);

  useEffect(() => {
    if (courseAddContentTestId) {
      const newOrder = courseSectionPriorityOrder + 1;
      const payload = {
        section_id: sectionId,
        test_array: JSON.stringify([{ test_id: courseAddContentTestId, order: newOrder }]),
        is_draft: draft,
        client_user_id: clientUserId,
      };
      post(payload, '/addSectionContent').then((res) => {
        console.log(res, 'test id');
        getSectionContent();
        setCourseSectionPriorityOrderToStore(newOrder);
      });
      setCourseAddContentTestIdToStore(0);
    }
  }, [
    courseAddContentTestId,
    setCourseAddContentTestIdToStore,
    courseSectionPriorityOrder,
    setSelectedQuestionArrayToStore,
    clientUserId,
    draft,
    sectionId,
    getSectionContent,
    setCourseSectionPriorityOrderToStore,
  ]);

  useEffect(() => {
    if (videoId) {
      const newOrder = courseSectionPriorityOrder + 1;

      const payload = {
        section_id: sectionId,
        file_array: JSON.stringify([
          { file_url: videoId, order: newOrder, file_name: title, file_type: 'youtube' },
        ]),
        client_user_id: clientUserId,
      };
      post(payload, '/addSectionContent').then((res) => {
        getSectionContent();
        setCourseSectionPriorityOrderToStore(newOrder);
      });
      delete history.location.state.videoId;
      delete history.location.state.title;
    }
  }, [
    videoId,
    title,
    getSectionContent,
    clientUserId,
    sectionId,
    history,
    setCourseSectionPriorityOrderToStore,
    courseSectionPriorityOrder,
  ]);

  const openOptionsModal = () => {
    handleOpen();
  };

  const goToContent = (i) => {
    if (i === 6) {
      Swal.fire({
        icon: 'info',
        title: 'Coming Soon!',
      });
    } else if (i === 1) {
      courseImageRef.current.click();
    } else if (i === 4) {
      courseVideoRef.current.click();
    } else if (i === 5) {
      push({ pathname: '/addyoutubevideo', state: { goTo: 'addContent' } });
    } else if (i === 3) {
      push({ pathname: '/homework/savedtests', state: { goTo: 'addContent' } });
    } else if (i === 2) {
      courseFileRef.current.click();
    }
  };

  const postImageToSection = (name, fileUrl, type) => {
    const newOrder = courseSectionPriorityOrder + 1;

    const payload = {
      section_id: sectionId,
      file_array: JSON.stringify([
        {
          file_url: fileUrl,
          order: newOrder,
          file_name: name,
          file_type: type,
        },
      ]),
      client_user_id: clientUserId,
    };
    post(payload, '/addSectionContent').then((res) => {
      getSectionContent();
      setCourseSectionPriorityOrderToStore(newOrder);
      handleClose();
    });
  };

  const getImageInput = (e, type) => {
    const reader = new FileReader();
    const file = e.target.files[0];
    let isFileAllowed = false;
    console.log(file);
    if (type === 'image' && verifyIsImage.test(file.name.split('.')[1])) {
      isFileAllowed = true;
    } else if (type === 'video' && verifyIsVideo.test(file.name.split('.')[1])) {
      isFileAllowed = true;
    } else if (type === 'file' && verifyIsFile.test(file.name.split('.')[1])) {
      isFileAllowed = true;
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Invalid File Type!',
        text: `The supported file types are ${
          type === 'image'
            ? 'gif, jpeg, jpg, tiff, png, webp, bmp'
            : 'mov,mp3, mp4 , mpg, avi, wmv, flv, 3gp'
        }`,
      });
    }
    if (file && isFileAllowed) {
      reader.readAsDataURL(e.target.files[0]);
      uploadImage(file).then((res) => {
        postImageToSection(file.name, res.filename, type);
      });
      if (type === 'image') {
        reader.onloadend = function getImage() {
          const base64data = reader.result;
          //   setImageTitle(base64data);
        };
      }
    }
  };

  const handleBackButton = () => {
    history.push('/courses/createcourse');
  };

  const openTheContent = (type, elem) => {
    if (type === 'test') {
      get({ test_id: elem.id }, '/getTestQuestions').then((res) => {
        console.log(res);
        const result = apiValidation(res);
        setSelectedQuestionArrayToStore(result);
        history.push({ pathname: '/homework/preview', state: { goTo: 'addContent' } });
      });
    } else if (type === 'youtube') {
      history.push(`/videoplayer/${elem.file_link}`);
    } else if (type === 'video') {
      history.push({ pathname: `/videoplayer`, state: { videoLink: elem.file_link } });
    } else if (type === 'image') {
      setImgLink(elem.file_link);
      handleImageOpen();
    } else if (type === 'file') {
      // const fileType = elem.file_type.replace(/\./g, ''); // removes the . form .doc / .ppt etc
      const fileType = elem.name.split('.')[1];
      fileType === 'pdf' || fileType === 'pd'
        ? history.push({
            pathname: '/fileviewer',
            state: { filePath: elem.file_link, type: fileType },
          })
        : history.push({
            pathname: '/otherfileviewer',
            state: { filePath: elem.file_link, type: fileType },
          });

      // history.push({
      //   pathname: '/otherfileviewer',
      //   state: { filePath: elem.file_link },
      // });
    }
  };

  const removeSection = (elem) => {
    const payload = {
      section_id: sectionId,
      delete_array: JSON.stringify([{ id: elem.id, content_type: elem.content_type }]),
    };

    Swal.fire({
      title: 'Delete Content',
      text: 'Do you wish to delete this content?',
      icon: 'question',
      confirmButtonText: `Yes`,
      showDenyButton: true,
      customClass: 'Assignments__SweetAlert',
    }).then((resp) => {
      if (resp.isConfirmed) {
        post(payload, '/deleteSectionContent').then((res) => {
          if (res.success) {
            getSectionContent();
          }
        });
      }
    });
  };

  return (
    <div>
      <PageHeader title={sectionName} customBack handleBack={handleBackButton} />
      <AddButton onlyUseButton triggerButton={openOptionsModal} />
      <div style={{ marginTop: '5rem' }}>
        <DragDropContext>
          {Object.keys(content).length > 0 &&
            content.map((elem) => {
              return (
                <Row
                  className='LiveClasses__adminCard p-2 m-2'
                  key={elem.id}
                  style={{ border: '1px solid rgba(112, 112, 112, 1)', borderRadius: '5px' }}
                >
                  <Col
                    xs={2}
                    onClick={() =>
                      openTheContent(
                        elem.content_type === 'file' ? elem.file_type : elem.content_type,
                        elem,
                      )
                    } // eslint-disable-line
                  >
                    <AssignmentIcon />
                  </Col>
                  <Col xs={8}>
                    <Button
                      style={{
                        backgroundColor: '#fff',
                        borderColor: '#fff',
                        padding: 0,
                        textAlign: 'left',
                        width: '100%',
                      }}
                      variant='light'
                      onClick={() =>
                        openTheContent(
                          elem.content_type === 'file' ? elem.file_type : elem.content_type,
                          elem,
                        )
                      } // eslint-disable-line
                    >
                      <h6 className='LiveClasses__adminHeading mb-0'>{elem.name}</h6>
                      <p className='LiveClasses__adminCardTime mb-0' />

                      <p className='LiveClasses__adminDuration mb-0'>
                        Type:{' '}
                        <span>
                          {elem.content_type === 'file' ? elem.file_type : elem.content_type}
                        </span>
                      </p>
                    </Button>
                  </Col>
                  <Col xs={2} className='d-flex justify-content-center align-items-center p-0'>
                    <Button
                      onClick={() => removeSection(elem)}
                      style={{
                        backgroundColor: '#fff',
                        borderColor: '#fff',
                        zIndex: '9',
                        width: '100%',
                        textAlign: 'center',
                      }}
                      variant='light'
                    >
                      <CloseIcon />
                    </Button>
                  </Col>
                </Row>
              );
            })}
        </DragDropContext>
      </div>
      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Select Content</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            {[
              { title: 'From Gallery', icon: <PhotoLibraryIcon /> },
              { title: 'From Files', icon: <AttachFileIcon /> },
              { title: 'Assignment', icon: <AssignmentIcon /> },
              { title: 'Video', icon: <VideocamIcon /> },
              { title: 'Youtube Video', icon: <AttachFileIcon /> },
              { title: 'Live Class', icon: <PhotoCameraIcon /> },
            ].map((elem, i) => {
              return (
                <Col
                  xs={4}
                  className='text-center'
                  key={elem.title}
                  onClick={() => goToContent(i + 1)}
                >
                  <p className='mb-0'>{elem.icon}</p>
                  <p className='Courses__tinySubHeading' style={{ color: 'rgba(22,22,22,1)' }}>
                    {elem.title}
                  </p>
                </Col>
              );
            })}
          </Row>
          <input
            id='file-input-image'
            type='file'
            onChange={(e) => getImageInput(e, 'image')}
            style={{ display: 'none' }}
            ref={courseImageRef}
          />
          <input
            id='file-input-video'
            type='file'
            accept
            onChange={(e) => getImageInput(e, 'video')}
            style={{ display: 'none' }}
            ref={courseVideoRef}
          />
          <input
            id='file-input-all'
            type='file'
            onChange={(e) => getImageInput(e, 'file')}
            style={{ display: 'none' }}
            ref={courseFileRef}
          />
        </Modal.Body>
      </Modal>
      <Modal show={showImageModal} onHide={handleImageClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Uploaded Image</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <img src={imgLink} alt='img' className='img-fluid' />
        </Modal.Body>
      </Modal>
    </div>
  );
};

const mapStateToProps = (state) => ({
  sectionId: getCourseCurrentSectionId(state),
  sectionName: getCourseCurrentSectionName(state),
  clientUserId: getClientUserId(state),
  courseSectionPriorityOrder: getCourseSectionPriorityOrder(state),
  courseAddContentTestId: getCourseAddContentTestId(state),
});

const mapDispatchToProps = (dispatch) => {
  return {
    setSelectedQuestionArrayToStore: (payload) => {
      dispatch(homeworkActions.setSelectedQuestionArrayToStore(payload));
    },
    setCourseSectionPriorityOrderToStore: (payload) => {
      dispatch(courseActions.setCourseSectionPriorityOrderToStore(payload));
    },
    setCourseAddContentTestIdToStore: (payload) => {
      dispatch(courseActions.setCourseAddContentTestIdToStore(payload));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddContent);

AddContent.propTypes = {
  // history: PropTypes.shape({
  //   push: PropTypes.func.isRequired,
  //   location: PropTypes.shape({
  //     state: PropTypes.shape({
  //       testId: PropTypes.number,
  //       draft: PropTypes.bool,
  //       videoId: PropTypes.string,
  //       title: PropTypes.string,
  //     }),
  //   }),
  // }).isRequired,
  history: PropTypes.instanceOf(Object).isRequired,
  sectionId: PropTypes.number.isRequired,
  sectionName: PropTypes.string.isRequired,
  setSelectedQuestionArrayToStore: PropTypes.func.isRequired,
  clientUserId: PropTypes.number.isRequired,
  setCourseSectionPriorityOrderToStore: PropTypes.func.isRequired,
  courseSectionPriorityOrder: PropTypes.number.isRequired,
  setCourseAddContentTestIdToStore: PropTypes.func.isRequired,
  courseAddContentTestId: PropTypes.number.isRequired,
};
