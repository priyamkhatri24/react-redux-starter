import React, { useState, useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import pdfjsLib from 'pdfjs-dist';
import Swal from 'sweetalert2';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import AssignmentIcon from '@material-ui/icons/Assignment';
import PhotoLibraryIcon from '@material-ui/icons/PhotoLibrary';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import Storage from '@material-ui/icons/Storage';
import Link from '@material-ui/icons/Link';
import VideocamIcon from '@material-ui/icons/Videocam';
import YouTube from '@material-ui/icons/YouTube';
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
import { getClientId, getClientUserId } from '../../redux/reducers/clientUserId.reducer';
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
    clientId,
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
  const [externalLinkModal, setExternalLinkModal] = useState(false);
  const [externalLink, setExternalLink] = useState('');
  const [externalLinkName, setExternalLinkName] = useState('');
  const handleClose = () => setShowModal(false);
  const handleOpen = () => setShowModal(true);
  const handleImageOpen = () => setShowImageModal(true);
  const handleImageClose = () => setShowImageModal(false);
  const courseVideoRef = useRef(null);
  const courseImageRef = useRef(null);
  const courseFileRef = useRef(null);

  const closeExternalLinkModal = () => setExternalLinkModal(false);

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

  const validURL = (str) => {
    const pattern = new RegExp(
      '^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$',
      'i',
    ); // fragment locator
    return !!pattern.test(str);
  };

  const goToContent = (i) => {
    if (i === 6) {
      // Swal.fire({
      //   icon: 'info',
      //   title: 'Coming Soon!',
      // });
      handleClose();
      setExternalLinkModal(true);
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
    } else if (i === 7) {
      goToLibraryForImport();
    }
  };

  const goToLibraryForImport = () => {
    history.push({
      pathname: '/studybin',
      state: { from: 'course', priorityOrder: courseSectionPriorityOrder + 1, sectionId },
    });
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
      const path = `${
        process.env.NODE_ENV == 'development' ? 'Development' : 'Production'
      }/${clientId}/Course/${courseId}/Sections/${sectionId}`;
      uploadMultipleImages(filesArr, path, 'courses').then((res) => {
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

  const addExternalLink = () => {
    if (!validURL(externalLink)) {
      return Swal.fire({
        icon: 'warning',
        title: 'Invalid Url!',
      });
    }
    const newOrder = courseSectionPriorityOrder + 1;

    const payload = {
      section_id: sectionId,
      file_array: JSON.stringify([
        {
          file_url: externalLink,
          order: newOrder + 1,
          file_name: externalLinkName,
          file_type: 'external',
          total_time: 0,
        },
      ]),
      client_user_id: clientUserId,
    };
    post(payload, '/addSectionContentLatest').then((res) => {
      getSectionContent();
      setCourseSectionPriorityOrderToStore(newOrder + 1);
      closeExternalLinkModal();
    });
    setExternalLink('');
    setExternalLinkName('');
    return 1;
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
    } else if (type === 'video' || type.includes('mp4')) {
      history.push({
        pathname: `/videoplayer`,
        state: { videoLink: elem.file_link, videoLinkArray: elem.file_link_array },
      });
    } else if (
      type === 'image' ||
      type.includes('png') ||
      type.includes('jpg') ||
      type.includes('jpeg')
    ) {
      setImgLink(elem.file_link);
      handleImageOpen();
    } else if (type.includes('pdf')) {
      // const fileType = elem.file_type.replace(/\./g, ''); // removes the . form .doc / .ppt etc
      const fileType = elem.name.split('.')[1];
      // fileType === 'pdf' || fileType === 'pd'
      //   ? history.push({
      //       pathname: '/fileviewer',
      //       state: { filePath: elem.file_link, type: fileType },
      //     })
      //   : history.push({
      //       pathname: '/otherfileviewer',
      //       state: { filePath: elem.file_link, type: fileType },
      //     });
      history.push({
        pathname: '/fileviewer',
        state: { filePath: elem.file_link, type: fileType },
      });
      // history.push({
      //   pathname: '/otherfileviewer',
      //   state: { filePath: elem.file_link },
      // });
    } else if (type === 'external') {
      window.open(elem.file_link, '_blank');
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

  const makeContentDownloadable = (item) => {
    if (item.content_type === 'test' || item.file_type === 'youtube') {
      Swal.fire({
        icon: 'error',
        title: 'Oops',
        text: "This content can't be made downloadable",
        confirmButtonText: `OK`,
      });
      return;
    }
    console.log(item, 'download krdee');
    const newIsDownloadable = item.is_downloadable !== 'true' ? 'true' : 'false';
    const payload = {
      section_has_file_id: item.section_has_file_id,
      is_downloadable: newIsDownloadable,
    };
    const newContent = content.map((elem) => {
      if (elem.section_has_file_id === item.section_has_file_id) {
        elem.is_downloadable = newIsDownloadable;
      }
      return elem;
    });
    // item.is_downloadable = item.is_downloadable !== 'true' ? 'false' : 'true';
    console.log(payload);
    post(payload, '/makeContentDownloadable').then((res) => {
      setContent(newContent);
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: `Content made ${!item.is_downloadable ? 'non-downloadable' : 'downloadable'}`,
        confirmButtonText: `OK`,
      });
    });
  };

  return (
    <div>
      <PageHeader title={sectionName} customBack handleBack={handleBackButton} />
      <AddButton onlyUseButton triggerButton={openOptionsModal} />
      <div style={{ marginTop: '5rem' }}>
        <ContentRow
          removeSection={removeSection}
          makeContentFree={makeContentFree}
          makeContentDownloadable={makeContentDownloadable}
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
          <Row className='justify-content-center'>
            {[
              { title: 'From Gallery', icon: <PhotoLibraryIcon /> },
              { title: 'From Files', icon: <AttachFileIcon /> },
              { title: 'Assignment', icon: <AssignmentIcon /> },
              { title: 'Video', icon: <VideocamIcon /> },
              { title: 'Youtube Video', icon: <YouTube /> },
              { title: 'External Link', icon: <Link /> },
              { title: 'Import from Library', icon: <Storage /> },
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
            accept='image/*'
            multiple='multiple'
          />
          <input
            id='file-input-video'
            type='file'
            accept='video/*,audio/*'
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

      <Modal show={externalLinkModal} onHide={closeExternalLinkModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add External Link</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <label className='has-float-label my-auto'>
            <input
              className='form-control'
              name='Name'
              type='text'
              placeholder='Name'
              onChange={(e) => setExternalLinkName(e.target.value)}
            />
            <span>Name</span>
          </label>
          <label className='has-float-label my-auto'>
            <input
              className='form-control'
              name='Add url'
              type='text'
              placeholder='Add url'
              onChange={(e) => setExternalLink(e.target.value)}
            />
            <span>Add url</span>
          </label>

          <div className='mt-2' style={{ textAlign: 'end' }}>
            <Button variant='boldTextSecondary' onClick={closeExternalLinkModal}>
              Cancel
            </Button>
            <Button variant='boldText' onClick={addExternalLink}>
              Add
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

const mapStateToProps = (state) => ({
  sectionId: getCourseCurrentSectionId(state),
  sectionName: getCourseCurrentSectionName(state),
  courseId: getCourseId(state),
  clientId: getClientId(state),
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
  clientId: PropTypes.number.isRequired,
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
