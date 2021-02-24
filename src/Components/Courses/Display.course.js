import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Card from 'react-bootstrap/Card';
import CreateIcon from '@material-ui/icons/Create';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import AddIcon from '@material-ui/icons/Add';
import { courseActions } from '../../redux/actions/course.action';
import { uploadImage } from '../../Utilities';
import YCIcon from '../../assets/images/ycIcon.png';

const Display = (props) => {
  const {
    setCourseCurrentSlideToStore,
    courseTitle,
    courseDesc,
    updateDisplayDetails,
    courseDisplayImage,
  } = props;
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageTitle, setImageTitle] = useState('');
  const courseImage = useRef('');
  const courseVideo = useRef('');
  const courseVideoRef = useRef(null);
  const courseImageRef = useRef(null);

  useEffect(() => {
    setTitle(courseTitle);
    setDescription(courseDesc && courseDesc !== 'null' ? courseDesc : '');
  }, [courseTitle, courseDesc]);

  useEffect(() => {
    if (courseDisplayImage) setImageTitle(courseDisplayImage);
  }, [courseDisplayImage]);

  const getImageInput = (e, type) => {
    const reader = new FileReader();
    const file = e.target.files[0];
    if (file) {
      reader.readAsDataURL(e.target.files[0]);
      uploadImage(file).then((res) => {
        type === 'image'
          ? (courseImage.current = res.filename)
          : (courseVideo.current = res.filename);
      });
      if (type === 'image') {
        reader.onloadend = function getImage() {
          const base64data = reader.result;
          setImageTitle(base64data);
        };
      }
    }
  };
  return (
    <div>
      {['Basic Information', 'Create your content'].map((e, i) => {
        return (
          <Card
            className='m-2 p-2'
            style={{ boxShadow: '0px 1px 3px 0px rgba(0,0,0,0.16)', borderRadius: '10px' }}
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
          <label className='has-float-label my-auto w-100'>
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
        <Row className='m-2'>
          <Col
            xs={4}
            style={{ height: '60px', width: '95px', borderRadius: '5px' }}
            className='align-items-center d-flex justify-content-center p-0'
            onClick={() => courseImageRef.current.click()}
            onKeyDown={() => courseImageRef.current.click()}
            role='button'
            tabIndex='-1'
          >
            <input
              id='file-input'
              type='file'
              onChange={(e) => getImageInput(e, 'image')}
              accept='image/*'
              style={{ display: 'none' }}
              ref={courseImageRef}
            />
            {imageTitle && (
              <>
                <img
                  src={imageTitle}
                  alt='upload your profile pic'
                  className='img-fluid'
                  style={{ height: '60px', width: '95px', borderRadius: '5px' }}
                />
              </>
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
              accept='image/*'
              style={{ display: 'none' }}
              ref={courseVideoRef}
            />
            {courseVideo.current && (
              <img src={YCIcon} alt='upload your profile pic' className='img-fluid' />
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
                className='align-items-center d-flex justify-content-center p-0 w-100'
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
              updateDisplayDetails(title, description, courseImage.current, courseVideo.current)} // prettier-ignore
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
  };
};

export default connect(null, mapDispatchToProps)(Display);

Display.propTypes = {
  setCourseCurrentSlideToStore: PropTypes.func.isRequired,
  courseTitle: PropTypes.string.isRequired,
  courseDesc: PropTypes.string,
  updateDisplayDetails: PropTypes.func.isRequired,
  courseDisplayImage: PropTypes.string,
};

Display.defaultProps = {
  courseDesc: '',
  courseDisplayImage: '',
};
