import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Swal from 'sweetalert2';
import Card from 'react-bootstrap/Card';
import CreateIcon from '@material-ui/icons/Create';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import CloseIcon from '@material-ui/icons/Close';
import AddIcon from '@material-ui/icons/Add';
import VideoThumbnail from 'react-video-thumbnail';
import { courseActions } from '../../redux/actions/course.action';
import { verifyIsFile, verifyIsImage, verifyIsVideo } from '../../Utilities';
import { uploadingImage } from '../../Utilities/customUpload';
import YCIcon from '../../assets/images/ycIcon.png';
import { loadingActions } from '../../redux/actions/loading.action';
import Cropper from '../Common/CropperModal/Cropper';
// import { shadow } from 'pdfjs-dist';

const Display = (props) => {
  const {
    setCourseCurrentSlideToStore,
    courseTitle,
    courseDesc,
    updateDisplayDetails,
    courseDisplayImage,
    courseDisplayVideo,
    clientId,
    courseId,
  } = props;
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [languages, setLanguages] = useState([
    'English',
    'Hindi',
    'Bengali',
    'Marathi',
    'Tamil',
    'Telegu',
    'Gujarati',
    'Kannada',
    'Punjabi',
    'French',
    'Mandarin (Chinese)',
    'Cantonese (Chinese)',
    'Spanish',
    'Arabic',
    'Russian',
    'German',
    'Sanskrit',
    'Japanese',
    'Korean',
    'Urdu',
    'Portugese',
  ]);
  const [selectedLanguage, setSelectedLanguage] = useState(['English']);
  const [languageString, setLanguageString] = useState('English');
  const [imageTitle, setImageTitle] = useState('');
  const [imageModal, setImageModal] = useState(false);
  const [upImg, setUpImg] = useState();
  const [profileImage, setProfileImage] = useState('');
  const courseImage = useRef('');
  const courseVideo = useRef('');
  const courseVideoRef = useRef(null);
  const courseImageRef = useRef(null);
  const [videoName, setVideoName] = useState('');
  const [videoURL, setVideoURL] = useState('');
  const [thumbnailImg, setThumbnail] = useState('');

  const handleClose = () => setImageModal(false);
  const handleOpen = () => setImageModal(true);

  useEffect(() => {
    setTitle(courseTitle);
    setDescription(courseDesc && courseDesc !== 'null' ? courseDesc : '');
  }, [courseTitle, courseDesc]);

  useEffect(() => {
    if (courseDisplayImage) {
      setImageTitle(courseDisplayImage);
      courseImage.current = courseDisplayImage;
    }

    if (courseDisplayVideo) {
      courseVideo.current = courseDisplayVideo;
      setVideoName(
        courseVideo.current.substr(courseVideo.current.lastIndexOf('/') + 1),
        courseVideo.current.length,
      );
      setVideoURL(courseVideo.current);
    }
  }, [courseDisplayImage, courseDisplayVideo]);

  const getImageInput = (e, type) => {
    const reader = new FileReader();
    const file = e.target.files[0];
    if (type === 'image') handleOpen();

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
            : type === 'video'
            ? 'mov, mp3, mp4 , mpg, avi, wmv, flv, 3gp'
            : 'doc, docx, xls, xlsx, ppt, pptx, txt, pdf'
        }`,
      });
    }
    if (file && isFileAllowed) {
      // setLoadingPendingToStore();
      reader.addEventListener('load', () => setUpImg(reader.result));
      reader.readAsDataURL(e.target.files[0]);

      if (type !== 'image') {
        const path = `${
          process.env.NODE_ENV == 'development' ? 'Development' : 'Production'
        }/${clientId}/Course/${courseId}/Preview/Videos`;
        uploadingImage(file, path).then((res) => {
          courseVideo.current = res.filename;
          const startVideo = courseVideo.current.lastIndexOf('/') + 1;
          setVideoName(courseVideo.current.substr(startVideo, courseVideo.current.length));
          setVideoURL(courseVideo.current);
        });
      }

      if (type === 'image') {
        reader.onloadend = function getImage() {
          const base64data = reader.result;
          setImageTitle(profileImage);
          // setImageTitle(courseDisplayImage);
          // courseImage.current = profileImage;
        };
      }
    }
  };

  useEffect(() => {
    if (profileImage) {
      setImageTitle(profileImage);
      courseImage.current = profileImage;
    }
  }, [profileImage]);

  console.log(profileImage);
  // courseImage.current = courseDisplayImage;

  const removeDisplayImage = (e, type) => {
    e.stopPropagation();
    if (type === 'image') {
      setImageTitle(null);
      courseImage.current = '';
    } else if (type === 'video') {
      setVideoURL(null);
      setThumbnail(null);
      courseVideo.current = '';
    }
  };

  const addLanguage = () => {
    const langArray = [...selectedLanguage];
    langArray.push('English');
    setSelectedLanguage(langArray);
    setLanguageString(`${languageString}~English`);
  };

  const makeLanguageString = (lang, index) => {
    const langArray = languageString.split('~');
    langArray[index] = lang;
    const selectedAr = [...selectedLanguage];
    selectedAr[index] = lang;
    setLanguageString(langArray.join('~'));
    setSelectedLanguage(selectedAr);
  };

  const removeLanguage = (ix) => {
    const selectedAr = selectedLanguage.filter((e, i) => i !== ix);
    setSelectedLanguage(selectedAr);
    const langStr = languageString
      .split('~')
      .filter((e, i) => i !== ix)
      .join('~');
    setLanguageString(langStr);
  };

  console.log(imageTitle, 'titleee');

  return (
    <div>
      {['Basic Information', 'Create your content'].map((e, i) => {
        return (
          <Card
            className='m-2 p-2'
            style={{ boxShadow: '0px 1px 3px 0px rgba(0,0,0,0.16)', borderRadius: '5px' }}
            onClick={() => setCourseCurrentSlideToStore(i + 1)}
            key={i} // eslint-disable-line
          >
            <Row className='my-auto Courses__createCourse mx-2'>
              <span className='Courses__coloredNumber mr-2'>{i + 1}</span>{' '}
              <span className='my-auto ml-3'>{e}</span>
              <span className='ml-auto' style={{ color: 'rgba(0, 0, 0, 0.54)' }}>
                <CreateIcon />
              </span>
            </Row>
          </Card>
        );
      })}
      <Card
        className='m-2 p-2'
        style={{ boxShadow: '0px 1px 3px 0px rgba(0,0,0,0.16)', borderRadius: '10px' }}
      >
        <Row className='my-auto Courses__createCourse mx-2'>
          <span className='Courses__coloredNumber mr-2'>3</span>{' '}
          <span className='my-auto ml-3'>Course display page</span>
        </Row>
        <Row className='m-2 mt-3 justify-content-center'>
          <label className='has-float-label my-auto' style={{ width: '100%' }}>
            <input
              className='form-control'
              name='Name'
              type='text'
              value={title}
              placeholder='Name'
              onChange={(e) => setTitle(e.target.value)}
            />
            <span>Name</span>
          </label>
        </Row>
        <Row className='m-2 justify-content-center'>
          <label className='has-float-label my-auto w-100'>
            <textarea
              className='form-control'
              name='Course Description'
              type='text'
              value={description}
              placeholder='Course Description'
              onChange={(e) => setDescription(e.target.value)}
            />
            <span>Course Description</span>
          </label>
        </Row>

        <div className='m-2 justify-content-start align-items-center'>
          {selectedLanguage.map((ele, i) => {
            return (
              <div className='d-flex align-items-center'>
                <label className='has-float-label my-2 w-100'>
                  <select
                    className='form-control'
                    style={{ boxShadow: 'none' }}
                    name='Language'
                    type='select'
                    value={languageString.split('~')[i]}
                    placeholder='Language'
                    onChange={(e) => makeLanguageString(e.target.value, i)}
                  >
                    {/* <option>English</option> */}
                    {languages.sort().map((lang) => (
                      <option selected={lang === 'English'}>{lang}</option>
                    ))}
                  </select>
                  <span>Language</span>
                </label>
                {i > 0 ? (
                  <div
                    className='d-flex justify-content-center'
                    style={{
                      width: '10%',
                    }}
                  >
                    <span
                      onKeyPress={() => removeLanguage(i)}
                      tabIndex={-1}
                      role='button'
                      onClick={() => removeLanguage(i)}
                      className='removeLanguage'
                    >
                      <CloseIcon />
                    </span>
                  </div>
                ) : null}
              </div>
            );
          })}
          {selectedLanguage.length < 3 ? (
            <div
              onClick={addLanguage}
              onKeyPress={addLanguage}
              tabIndex={-1}
              role='button'
              style={{ width: '130px' }}
              className='Courses__addRegionalPriceButton mt-2'
            >
              + Add More
            </div>
          ) : null}
        </div>

        <Row className='m-2 mt-4'>
          <Col
            xs={4}
            style={{ height: '60px', width: '95px', borderRadius: '5px' }}
            className=' d-flex justify-content-center p-0'
            onClick={() => courseImageRef.current.click()}
            onKeyDown={() => courseImageRef.current.click()}
            role='button'
            tabIndex='-1'
          >
            <input
              id='file-input'
              type='file'
              onChange={(e) => getImageInput(e, 'image')}
              style={{ display: 'none' }}
              ref={courseImageRef}
            />
            {imageTitle && (
              <Row className='justify-content-center'>
                <span
                  role='button'
                  tabIndex={-1}
                  onKeyDown={(e) => removeDisplayImage(e, 'image')}
                  onClick={(e) => removeDisplayImage(e, 'image')}
                  className='removeImageIcon positionVideo'
                >
                  X
                </span>
                <img
                  src={imageTitle}
                  alt='upload your profile pic'
                  className='img-fluid'
                  style={{ height: '60px', width: '95px', borderRadius: '5px' }}
                />
              </Row>
            )}
            {!imageTitle && (
              <div
                style={{
                  background: '#F1F9FF',
                  height: '60px',
                  width: '95px',
                  borderRadius: '5px',
                  cursor: 'pointer',
                }}
                className='align-items-center d-flex justify-content-center p-0'
              >
                <span style={{ color: '#7FC4FD' }}>
                  <AddIcon style={{ fontSize: '60px' }} />
                </span>
              </div>
            )}
          </Col>
          <Cropper
            sourceImage={upImg}
            imageModal={imageModal}
            handleClose={handleClose}
            setProfileImage={setProfileImage}
            aspectTop={16}
            aspectBottom={9}
            clientId={clientId}
            featureId={`${courseId}/Preview`}
            feature='Course'
          />
          <Col xs={8} className='p-0'>
            <Row className='my-auto Courses__createCourse mx-2'>
              <span className='my-auto ml-3' style={{ fontFamily: 'Montserrat-Regular' }}>
                Add Course display image
              </span>
            </Row>
            <Row className='my-auto mx-2'>
              <span className='my-auto ml-3 Courses__tinySubHeading'>
                Important guidelines: 750x422 pixels; .jpg, .jpeg,. gif, or .png. no text on the
                image.{' '}
              </span>
            </Row>
          </Col>
        </Row>
        <Row className='m-2'>
          <Col
            xs={4}
            style={{ height: '60px', width: '95px', borderRadius: '5px' }}
            className='align-items-center d-flex justify-content-center p-0'
            onClick={() => courseVideoRef.current.click()}
            onKeyDown={() => courseVideoRef.current.click()}
            role='button'
            tabIndex='-1'
          >
            <input
              id='file-input'
              type='file'
              onChange={(e) => getImageInput(e, 'video')}
              style={{ display: 'none' }}
              ref={courseVideoRef}
            />
            {courseVideo.current && (
              <div style={{ flexDirection: 'row' }}>
                <Row className='justify-content-center'>
                  <span
                    role='button'
                    tabIndex={-1}
                    onKeyDown={(e) => removeDisplayImage(e, 'video')}
                    onClick={(e) => removeDisplayImage(e, 'video')}
                    className='removeImageIcon positionVideo'
                  >
                    X
                  </span>
                  <img
                    src={thumbnailImg || YCIcon}
                    alt='upload your profile pic'
                    className='img-fluid'
                    style={{ height: '60px', width: '95px', borderRadius: '5px' }}
                  />
                  <div style={{ display: 'none' }}>
                    <VideoThumbnail
                      videoUrl={videoURL}
                      thumbnailHandler={(thumbnail) => setThumbnail(thumbnail)}
                    />
                  </div>
                </Row>
                <Row>
                  <div>{/* <small className='Courses__tinySubHeading'>{videoName}</small> */}</div>
                </Row>
              </div>
            )}
            {!courseVideo.current && (
              <div
                style={{
                  background: '#F1F9FF',
                  height: '60px',
                  width: '95px',
                  borderRadius: '5px',
                  cursor: 'pointer',
                }}
                className='align-items-center d-flex justify-content-center p-0'
              >
                <span style={{ color: '#7FC4FD' }}>
                  <AddIcon style={{ fontSize: '60px' }} />
                </span>
              </div>
            )}
          </Col>

          <Col xs={8} className='p-0'>
            <Row className='my-auto Courses__createCourse mx-2'>
              <span className='my-auto ml-3' style={{ fontFamily: 'Montserrat-Regular' }}>
                Add course preview video
              </span>
            </Row>
            <Row className='my-auto mx-2'>
              <span className='my-auto ml-3 Courses__tinySubHeading'>
                Important guidelines: 750x422 pixels; .jpg, .jpeg,. gif, or .png. no text on the
                image.
              </span>
            </Row>
          </Col>
        </Row>

        <Row className='w-25 justify-content-end ml-auto m-2'>
          <Button
            variant='customPrimarySmol'
            onClick={() =>
            {
              if (!imageTitle) {
                Swal.fire({
                  icon: 'warning',
                  title: 'Attention',
                  text: 'Please add a preview image to the course. It will make your course more attractive.',
                });
                return;
              }
              updateDisplayDetails(title, description, courseImage.current, courseVideo.current, languageString)
            }} // prettier-ignore
          >
            Continue
          </Button>
        </Row>
      </Card>
      {['Pricing and promotion', 'Privacy and publish'].map((e, i) => {
        return (
          <Card
            className='m-2 p-2'
            style={{ boxShadow: '0px 1px 3px 0px rgba(0,0,0,0.16)', borderRadius: '10px' }}
            key={i} // eslint-disable-line
          >
            <Row className='my-auto Courses__createCourse mx-2'>
              <span className='Courses__coloredNumber mr-2'>{i + 4}</span>{' '}
              <span className='my-auto ml-3'>{e}</span>
            </Row>
          </Card>
        );
      })}
    </div>
  );
};
const mapDispatchToProps = (dispatch) => {
  return {
    setCourseCurrentSlideToStore: (payload) => {
      dispatch(courseActions.setCourseCurrentSlideToStore(payload));
    },

    setLoadingPendingToStore: (payload) => {
      dispatch(loadingActions.pending());
    },

    setLoadingSuccessToStore: (payload) => {
      dispatch(loadingActions.success());
    },
  };
};

export default connect(null, mapDispatchToProps)(Display);

Display.propTypes = {
  setCourseCurrentSlideToStore: PropTypes.func.isRequired,
  courseTitle: PropTypes.string.isRequired,
  courseDesc: PropTypes.string,
  updateDisplayDetails: PropTypes.func.isRequired,
  courseDisplayImage: PropTypes.string,
  courseDisplayVideo: PropTypes.string,
  clientId: PropTypes.number.isRequired,
  courseId: PropTypes.number.isRequired,
};

Display.defaultProps = {
  courseDesc: '',
  courseDisplayImage: '',
  courseDisplayVideo: '',
};
