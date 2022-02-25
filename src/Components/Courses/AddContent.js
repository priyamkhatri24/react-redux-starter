import React, { useState, useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import pdfjsLib from 'pdfjs-dist';
import Swal from 'sweetalert2';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import AssignmentIcon from '@material-ui/icons/Assignment';
import PhotoLibraryIcon from '@material-ui/icons/PhotoLibrary';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';
import VideocamIcon from '@material-ui/icons/Videocam';
import { PageHeader } from '../Common';
import AddButton from '../Common/AddButton/AddButton';
import {
  apiValidation,
  get,
  post,
  propComparator,
  verifyIsImage,
  verifyIsVideo,
  verifyIsFile,
} from '../../Utilities';
import { uploadingImage, uploadMultipleImages } from '../../Utilities/customUpload';
import {
  getCourseAddContentTestId,
  getCourseCurrentSectionId,
  getCourseCurrentSectionName,
  getCourseSectionPriorityOrder,
  getCourseId,
} from '../../redux/reducers/course.reducer';
import { homeworkActions } from '../../redux/actions/homework.action';
import { getClientUserId } from '../../redux/reducers/clientUserId.reducer';
import { courseActions } from '../../redux/actions/course.action';
import ContentRow from './ContentRow';

window.URL = window.URL || window.webkitURL;
const script = document.createElement('script');
script.src = '//mozilla.github.io/pdf.js/build/pdf.js';
document.head.appendChild(script);
const AddContent = (props) => {
  const {
    history: {
      push,
      location: { state: { draft, videoId, title, duration } = {} },
    },
    history,
    sectionId,
    courseId,
    sectionName,
    setSelectedQuestionArrayToStore,
    clientUserId,
    setCourseSectionPriorityOrderToStore,
    courseSectionPriorityOrder,
    courseAddContentTestId,
    setCourseAddContentTestIdToStore,
    setQuestionArrayToStore,
    setTestNameToStore,
  } = props;
  const [showModal, setShowModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [content, setContent] = useState([]);
  const [imgLink, setImgLink] = useState('');
  const handleClose = () => setShowModal(false);
  const handleOpen = () => setShowModal(true);
  const handleImageOpen = () => setShowImageModal(true);
  const handleImageClose = () => setShowImageModal(false);
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
          {
            file_url: videoId,
            order: newOrder,
            file_name: title,
            file_type: 'youtube',
            total_time: duration,
          },
        ]),
        client_user_id: clientUserId,
      };
      post(payload, '/addSectionContentLatest').then((res) => {
        getSectionContent();
        setCourseSectionPriorityOrderToStore(newOrder);
      });
      delete history.location.state.videoId;
      delete history.location.state.title;
    }
  }, [
    videoId,
    title,
    duration,
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
      push({
        pathname: '/homework/savedtests',
        state: { goTo: 'addContent', courseId, sectionId },
      });
    } else if (i === 2) {
      courseFileRef.current.click();
    }
  };

  const postImageToSection = (arr, type) => {
    const newOrder = courseSectionPriorityOrder;
    const fileArray = arr.map((elem, index) => {
      return {
        file_url: elem.filename,
        order: newOrder + index + 1,
        file_name: elem.name,
        file_type: type,
        total_time: elem.duration || 300,
      };
    });
    const payload = {
      section_id: sectionId,
      file_array: JSON.stringify(fileArray),
      client_user_id: clientUserId,
    };
    post(payload, '/addSectionContentLatest').then((res) => {
      getSectionContent();
      setCourseSectionPriorityOrderToStore(newOrder + fileArray.length);
      handleClose();
    });
  };

  function reverse(s) {
    return [...s].reverse().join('');
  }

  const getVideoDuration = (fileObj) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.src = URL.createObjectURL(fileObj.file);
    video.onloadedmetadata = function () {
      window.URL.revokeObjectURL(video.src);
      fileObj.duration = video.duration || '1000';
    };
  };

  const getPdfPagesCount = (file) => {
    if (file.file.type === 'application/pdf') {
      const pdfjsLib = window['pdfjs-dist/build/pdf'];
      pdfjsLib.GlobalWorkerOptions.workerSrc = '//mozilla.github.io/pdf.js/build/pdf.worker.js';
      const reader = new FileReader();
      reader.onloadend = () => {
        // log to console
        // logs data:<type>;base64,wL2dvYWwgbW9yZ...
        console.log(reader.result);
        const loadingTask = pdfjsLib.getDocument(reader.result);
        loadingTask.promise.then(function (pdf) {
          console.log('PDF loaded', pdf.numPages);
          file.duration = 60 * 3 * pdf.numPages;
        });
      };
      reader.readAsDataURL(file.file);
    }
  };

  const getImageInput = (e, type) => {
    const reader = new FileReader();
    const { files } = e.target;
    const filesArr = [...files];
    const filess = filesArr.map((ele) => {
      return {
        file: ele,
        duration: 0,
      };
    });
    console.log(filess);
    console.log(filesArr);
    const isFileAllowedArray = [];
    for (let i = 0; i < filesArr.length; i++) {
      const { file } = filess[i];
      const s = reverse(reverse(file.name).split('.')[0]);
      if (type === 'image' && verifyIsImage.test(s)) {
        isFileAllowedArray.push(true);
        filess[i].duration = 300;
      } else if (type === 'video' && verifyIsVideo.test(s)) {
        getVideoDuration(filess[i]);
        isFileAllowedArray.push(true);
      } else if (type === 'file' && verifyIsFile.test(s)) {
        isFileAllowedArray.push(true);
        getPdfPagesCount(filess[i]);
      } else {
        isFileAllowedArray.push(false);
        Swal.fire({
          icon: 'error',
          title: 'Invalid File Type!',
          text: `The supported file types are ${
            type === 'image'
              ? 'gif, jpeg, jpg, m4v, tiff, png, webp, bmp'
              : type === 'video'
              ? 'mov,mp3, mp4 , mpg, avi, wmv, flv, 3gp'
              : 'doc, docx, xls, xlsx, ppt, pptx, txt, pdf'
          }`,
        });
        break;
      }
    }

    if (filess?.length && isFileAllowedArray.every((ele) => ele === true)) {
      // reader.readAsDataURL(e.target.files[0]);
      console.log(filess, 'beforeResponse');
      uploadMultipleImages(filesArr).then((res) => {
        res.forEach((ele, index) => {
          filess.forEach((elem) => {
            if (ele.name === elem.file.name) {
              ele.duration = elem.duration;
            }
          });
        });
        console.log(res, 'uploadedResponse');

        postImageToSection(res, type);
      });
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
        setQuestionArrayToStore(result);
        setTestNameToStore(elem.name);
        console.log(elem);
        history.push({
          pathname: '/homework/viewonly',
          state: { goTo: 'addContent', testIdd: elem.id, noButton: true },
        });
      });
    } else if (type === 'youtube') {
      history.push(`/videoplayer/${elem.file_link}`);
    } else if (type === 'video') {
      history.push({
        pathname: `/videoplayer`,
        state: { videoLink: elem.file_link, videoLinkArray: elem.file_link_array },
      });
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

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  const handleDragEnd = (result) => {
    // dropped outside the list

    if (!result.destination) {
      return;
    }

    const items = reorder(content, result.source.index, result.destination.index);
    const newItems = items.map((e, i) => {
      const elem = {
        priority_order: i + 1,
        id: e.id,
        content_type: e.content_type,
      };
      return elem;
    });

    const payload = {
      section_id: sectionId,
      content_array: JSON.stringify(newItems),
    };
    post(payload, '/rearrangeSectionContent').then((res) => {
      if (res.success) {
        setContent(items);
      }
    });
  };

  const makeContentFree = (item, freeOrPaid) => {
    console.log(item);
    console.log(content);
    const newContent = content.map((elem) => {
      if (elem.id === item.id) {
        elem.is_free = freeOrPaid;
      }
      return elem;
    });
    const newItems = newContent.map((e, i) => {
      const elem = {
        priority_order: i + 1,
        id: e.id,
        content_type: e.content_type,
        is_free: e.is_free,
      };
      return elem;
    });

    const payload = {
      section_id: sectionId,
      content_array: JSON.stringify(newItems),
    };
    post(payload, '/rearrangeSectionContent').then((res) => {
      if (res.success) {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text:
            freeOrPaid === 'true'
              ? 'Selected content is made free. Users can now access this content without subscribing the course.'
              : 'Content is paid. Users cannot access this content without subscribing to the course.',
          confirmButtonText: `OK`,
        });
        setContent(newContent);
      }
    });
  };

  const renameContent = async (item, newName) => {
    console.log(item);
    const payload = {
      sction_id: sectionId,
      id: item.id,
      content_type: item.content_type,
      name: newName,
    };
    console.log(payload);
    const newContent = content.map((elem) => {
      if (elem.id === item.id) {
        elem.name = newName;
      }
      return elem;
    });
    setContent(newContent);
    const res = await post(payload, '/renameSectionContent');
    return res;
  };

  return (
    <div>
      <PageHeader title={sectionName} customBack handleBack={handleBackButton} />
      <AddButton onlyUseButton triggerButton={openOptionsModal} />
      <div style={{ marginTop: '5rem' }}>
        <ContentRow
          removeSection={removeSection}
          makeContentFree={makeContentFree}
          renameContent={renameContent}
          openTheContent={openTheContent}
          handleDragEnd={handleDragEnd}
          content={content}
          updateContent={setContent}
        />
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
            multiple='multiple'
          />
          <input
            id='file-input-video'
            type='file'
            accept
            onChange={(e) => getImageInput(e, 'video')}
            style={{ display: 'none' }}
            ref={courseVideoRef}
            multiple='multiple'
          />
          <input
            id='file-input-all'
            type='file'
            onChange={(e) => getImageInput(e, 'file')}
            style={{ display: 'none' }}
            ref={courseFileRef}
            multiple='multiple'
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
  courseId: getCourseId(state),
  clientUserId: getClientUserId(state),
  courseSectionPriorityOrder: getCourseSectionPriorityOrder(state),
  courseAddContentTestId: getCourseAddContentTestId(state),
});

const mapDispatchToProps = (dispatch) => {
  return {
    setSelectedQuestionArrayToStore: (payload) => {
      dispatch(homeworkActions.setSelectedQuestionArrayToStore(payload));
    },
    setTestNameToStore: (payload) => {
      dispatch(homeworkActions.setTestNameToStore(payload));
    },
    setQuestionArrayToStore: (payload) => {
      dispatch(homeworkActions.setQuestionArrayToStore(payload));
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
  history: PropTypes.instanceOf(Object).isRequired,
  sectionId: PropTypes.number.isRequired,
  courseId: PropTypes.number.isRequired,
  sectionName: PropTypes.string.isRequired,
  setSelectedQuestionArrayToStore: PropTypes.func.isRequired,
  clientUserId: PropTypes.number.isRequired,
  setCourseSectionPriorityOrderToStore: PropTypes.func.isRequired,
  courseSectionPriorityOrder: PropTypes.number.isRequired,
  setCourseAddContentTestIdToStore: PropTypes.func.isRequired,
  setQuestionArrayToStore: PropTypes.func.isRequired,
  setTestNameToStore: PropTypes.func.isRequired,
  courseAddContentTestId: PropTypes.number.isRequired,
};
