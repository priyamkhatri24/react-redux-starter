import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import fromUnixTime from 'date-fns/fromUnixTime';
import format from 'date-fns/format';
import { getClientId, getClientUserId } from '../../redux/reducers/clientUserId.reducer';
import { getCourseId } from '../../redux/reducers/course.reducer';
import { get, post } from '../../Utilities/Remote';
import { apiValidation } from '../../Utilities';
import { Readmore, PageHeader } from '../Common';
import placeholder from '../../assets/images/ycIcon.png';
import { courseActions } from '../../redux/actions/course.action';
import './Courses.scss';
import '../Profile/Profile.scss';

const TeacherCourses = (props) => {
  const {
    clientId,
    clientUserId,
    history,
    setCourseIdToStore,
    setCourseObjectToStore,
    setCourseCurrentSlideToStore,
  } = props;
  const [courses, setCourses] = useState([]);
  const [statistics, setStatistics] = useState([]);
  const [courseModal, setCourseModal] = useState(false);
  const [courseTitle, setCourseTitle] = useState('');
  const [isValid, setValid] = useState(false);
  const inputEl = useRef(null);

  useEffect(() => {
    get({ client_id: clientId }, '/getCoursesOfCoaching').then((res) => {
      const result = apiValidation(res);
      setCourses(result);
      console.log(result);
    });
    get({ client_id: clientId }, '/getPublishedCoursesOfCoaching').then((res) => {
      const result = apiValidation(res);
      setStatistics(result);
    });

    get({ client_id: clientId, course_id: 9 }, '/getCourseDetails').then((res) => {
      console.log(res, 'jaishritest');
    });
  }, [clientId]);

  const getStatisticOfCourse = (id) => {
    history.push({ pathname: '/courses/teachercourse/statistics', state: { id } });
  };

  const showCourseModal = () => {
    setCourseModal(true);
    setTimeout(() => {
      inputEl.current.focus();
    }, 1000);
  };
  const closeCourseModal = () => setCourseModal(false);

  const goToCreateCourse = () => {
    courseTitle
      ? post({ course_title: courseTitle, client_user_id: clientUserId }, '/addCourse').then(
          (res) => {
            setCourseIdToStore(res.course_id);
            get({ client_id: clientId, course_id: res.course_id }, '/getCourseDetails').then(
              (response) => {
                console.log(response);
                const result = apiValidation(response);
                setCourseObjectToStore(result);
                setCourseCurrentSlideToStore(
                  result.tag_array.length === 0
                    ? 1
                    : result.section_array.length === 0
                    ? 2
                    : result.course_description
                    ? 3
                    : result.course_price
                    ? 4
                    : 5,
                );
              },
            );
            history.push('/courses/createcourse');
          },
        )
      : setValid(true);
  };

  const goToCreatedCourse = (id) => {
    get({ client_id: clientId, course_id: id }, '/getCourseDetails').then((response) => {
      console.log(response);
      const result = apiValidation(response);
      setCourseObjectToStore(result);
      setCourseIdToStore(result.course_id);
      setCourseCurrentSlideToStore(
        result.tag_array.length === 0
          ? 1
          : result.section_array.length === 0
          ? 2
          : result.course_display_image
          ? 3
          : result.course_price
          ? 4
          : 5,
      );
      history.push('/courses/createcourse');
    });
  };

  const goToDashboard = () => {
    history.push('/');
  };

  return (
    <>
      <PageHeader title='Courses' handleBack={goToDashboard} customBack />
      <div style={{ marginTop: '4rem' }}>
        <Tabs
          defaultActiveKey='My Courses'
          className='Profile__Tabs'
          justify
          style={{ marginTop: '4rem' }}
        >
          <Tab eventKey='My Courses' title='My Courses' style={{ marginTop: '2rem' }}>
            <Button
              variant='customPrimaryWithShadow'
              style={{
                position: 'fixed',
                bottom: 10,
                zIndex: '10',
                left: '50%',
                transform: 'translate(-50%, 0)',
              }}
              onClick={() => showCourseModal()}
            >
              Create Course
            </Button>
            {courses.map((course) => {
              return (
                <Row
                  className='Courses__teacherCourse p-1'
                  key={course.course_id}
                  onClick={() => goToCreatedCourse(course.course_id)}
                >
                  <Col xs={4} className='Courses__iconImage'>
                    <img
                      src={course.course_display_image ? course.course_display_image : placeholder}
                      alt='course '
                      className='mx-auto Courses__viewCourseImage'
                    />
                  </Col>
                  <Col xs={8} className='p-0'>
                    <p className='Scrollable__courseCardHeading mx-2 mb-1'>{course.course_title}</p>
                    <Row className='mx-2'>
                      <p
                        className='LiveClasses__adminCardTime '
                        style={{ fontSize: '12px', marginBottom: '5px' }}
                      >
                        Created: {format(fromUnixTime(course.created_at), 'HH:mm MMM dd, yyyy')}
                      </p>
                    </Row>
                    <Row className='mx-2'>
                      <p
                        className='LiveClasses__adminCardTime '
                        style={{ fontSize: '12px', color: 'rgba(22, 22, 22, 1)' }}
                      >
                        To:{' '}
                        {course.current_batch.length > 0 && (
                          <Readmore
                            maxcharactercount={100}
                            batchesArray={course.current_batch.map((e) => e.batch_name)}
                          />
                        )}
                      </p>
                      <div
                        className='ml-auto rounded Courses__slimButton'
                        style={
                          course.course_status === 'published'
                            ? {}
                            : course.course_status === 'incomplete'
                            ? { background: 'rgba(255, 0, 0, 0.87)' }
                            : { background: ' rgba(0, 0, 0, 0.54)' }
                        }
                      >
                        <span
                          style={{
                            fontFamily: 'Montserrat-SemiBold',
                            color: 'rgba(0, 0, 0, 0.87)',
                            fontSize: '10px',
                          }}
                          className='m-1 d-block text-center'
                        >
                          {course.course_status === 'published'
                            ? ' '
                            : course.course_status === 'completed'
                            ? 'Unpublished'
                            : 'Incomplete'}
                        </span>
                      </div>
                    </Row>
                  </Col>
                </Row>
              );
            })}
          </Tab>
          <Tab eventKey='Statistics' title='Statistics' style={{ marginTop: '2rem' }}>
            {statistics.map((course) => {
              return (
                <Row
                  className='Courses__teacherCourse'
                  key={course.course_id}
                  onClick={() => getStatisticOfCourse(course.course_id)}
                >
                  <Col xs={4} className='Courses__iconImage'>
                    <img
                      src={course.course_display_image ? course.course_display_image : placeholder}
                      alt='course '
                      className='mx-auto Courses__viewCourseImage'
                    />
                  </Col>
                  <Col xs={8} className='p-0'>
                    <p className='Scrollable__courseCardHeading mx-2 mb-1'>{course.course_title}</p>
                    <Row className='mx-2'>
                      <p className='LiveClasses__adminCardTime ' style={{ fontSize: '12px' }}>
                        Created: {format(fromUnixTime(course.created_at), 'HH:mm MMM dd, yyyy')}
                      </p>
                    </Row>
                    <Row className='mx-2'>
                      <p
                        className='LiveClasses__adminCardTime '
                        style={{
                          fontSize: '12px',
                          color: 'rgba(22, 22, 22, 1)',
                          overflowWrap: 'anywhere',
                        }}
                      >
                        To:{' '}
                        {course.current_batch.length > 0 && (
                          <Readmore
                            maxcharactercount={100}
                            batchesArray={course.current_batch.map((e) => e.batch_name)}
                          />
                        )}
                      </p>
                    </Row>
                  </Col>
                </Row>
              );
            })}
          </Tab>
        </Tabs>

        <Modal show={courseModal} centered onHide={closeCourseModal}>
          <Modal.Body>
            <label className='has-float-label my-auto'>
              <input
                className='form-control'
                name='Course Title'
                type='text'
                placeholder='Course Title'
                ref={inputEl}
                onChange={(e) => setCourseTitle(e.target.value)}
              />
              <span>Course Title</span>
            </label>
            {isValid && <small className='text-danger d-block'>Please enter a title</small>}
          </Modal.Body>
          <Modal.Footer>
            <Button variant='boldTextSecondary' onClick={() => closeCourseModal()}>
              Cancel
            </Button>
            <Button variant='boldText' onClick={() => goToCreateCourse()}>
              OK
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  clientId: getClientId(state),
  clientUserId: getClientUserId(state),
  courseId: getCourseId(state),
});

const mapDispatchToProps = (dispatch) => {
  return {
    setCourseIdToStore: (payload) => {
      dispatch(courseActions.setCourseIdToStore(payload));
    },
    setCourseCurrentSlideToStore: (payload) => {
      dispatch(courseActions.setCourseCurrentSlideToStore(payload));
    },
    setCourseObjectToStore: (payload) => {
      dispatch(courseActions.setCourseObjectToStore(payload));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TeacherCourses);

TeacherCourses.propTypes = {
  clientId: PropTypes.number.isRequired,
  setCourseIdToStore: PropTypes.func.isRequired,
  setCourseCurrentSlideToStore: PropTypes.func.isRequired,
  setCourseObjectToStore: PropTypes.func.isRequired,
  clientUserId: PropTypes.number.isRequired,
  history: PropTypes.instanceOf(Object).isRequired,
};

// {course.current_batch.map((e, i) => {
//   return (
//     <>
//       <span key={e.batch_id}>{e.batch_name}</span>
//       {i !== course.current_batch.length - 1 ? (
//         <span>, </span>
//       ) : (
//         <span> </span>
//       )}
//     </>
//   );
// })}
