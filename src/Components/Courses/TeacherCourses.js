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
import Toast from 'react-bootstrap/Toast';
import format from 'date-fns/format';
import {
  getClientId,
  getClientUserId,
  getRoleArray,
} from '../../redux/reducers/clientUserId.reducer';
import { getCourseId } from '../../redux/reducers/course.reducer';
import { get, post } from '../../Utilities/Remote';
import { apiValidation, shareThis } from '../../Utilities';
import { Readmore, PageHeader } from '../Common';
import { courseActions } from '../../redux/actions/course.action';
import './Courses.scss';
import '../Profile/Profile.scss';
import { getCurrentDashboardData } from '../../redux/reducers/dashboard.reducer';

const TeacherCourses = (props) => {
  const {
    clientId,
    clientUserId,
    history,
    setCourseIdToStore,
    setCourseObjectToStore,
    setCourseCurrentSlideToStore,
    dashboardData,
    roleArray,
  } = props;
  const [courses, setCourses] = useState([]);
  const [statistics, setStatistics] = useState([]);
  const [courseModal, setCourseModal] = useState(false);
  const [courseTitle, setCourseTitle] = useState('');
  const [isValid, setValid] = useState(false);
  const inputEl = useRef(null);
  const [showToast, setShowToast] = useState(false);
  const [searchString, setSearchString] = useState('');
  const [activeTab, setActiveTab] = useState('My Courses');

  const NoPreview =
    'https://s3.ap-south-1.amazonaws.com/ingenium-question-images/1625835287424.jpg';

  useEffect(() => {
    const payload = {
      client_id: clientId,
      client_user_id: clientUserId,
      is_admin: roleArray.includes(4),
    };
    get(payload, '/getCoursesOfCoachingLatest').then((res) => {
      const result = apiValidation(res);
      const searchedArray = result.filter(
        (e) => e.course_title.toLowerCase().indexOf(searchString.toLowerCase()) > -1,
      );
      setCourses(searchedArray);
      console.log(result);
    });
    console.log(history);
    get({ client_id: clientId }, '/getPublishedCoursesOfCoaching').then((res) => {
      const result = apiValidation(res);
      const searchedArray = result.filter(
        (e) => e.course_title.toLowerCase().indexOf(searchString.toLowerCase()) > -1,
      );
      setStatistics(searchedArray);
    });

    get({ client_id: clientId, course_id: 9 }, '/getCourseDetails').then((res) => {
      console.log(res, 'jaishritest');
    });
  }, [clientId, clientUserId, history, roleArray, searchString]);

  // useEffect(()=>{
  //   setActiveTab(history)
  // },[])
  console.log(history.top, 'ZZZZ');
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

  const shareCourse = (e, course) => {
    e.stopPropagation();
    // eslint-disable-next-line
    const url = `${window.location.protocol}//${window.location.host}/courses/buyCourse/${clientId}/${course.course_id}`;
    console.log(url);
    const hasShared = shareThis(url, dashboardData.client_name);
    if (hasShared === 'clipboard') setShowToast(true);
  };

  const searchCourses = (search) => {
    setSearchString(search);
  };

  const handleSelect = (tab) => {
    setActiveTab(tab);
  };

  return (
    <>
      <PageHeader
        title='Courses'
        handleBack={goToDashboard}
        customBack
        search
        searchFilter={searchCourses}
      />
      <div style={{}}>
        <Tabs
          defaultActiveKey={activeTab}
          className='Courses__Profile__Tabs'
          justify
          style={{ marginTop: '3.5rem' }}
          onSelect={handleSelect}
        >
          <Tab
            eventKey='My Courses'
            title='My Courses'
            style={{ marginTop: '7rem' }}
            onclick={() => handleSelect('My Courses')}
          >
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
                      src={course.course_display_image ? course.course_display_image : NoPreview}
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
                            ? { background: 'var(--primary-blue)', color: '#fff' }
                            : course.course_status === 'incomplete'
                            ? { background: 'rgba(255, 0, 0, 0.87)', color: 'rgba(0, 0, 0, 0.87)' }
                            : { background: ' rgba(0, 0, 0, 0.54)', color: 'rgba(0, 0, 0, 0.87)' }
                        }
                        onClick={
                          course.course_status === 'published'
                            ? (evt) => shareCourse(evt, course)
                            : () => {}
                        }
                        onKeyDown={
                          course.course_status === 'published'
                            ? (evt) => shareCourse(evt, course)
                            : () => {}
                        }
                        tabIndex='-1'
                        role='button'
                      >
                        <span
                          style={{
                            fontFamily: 'Montserrat-SemiBold',
                            fontSize: '10px',
                          }}
                          className='m-1 d-block text-center'
                        >
                          {course.course_status === 'published'
                            ? 'Share'
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
          <Tab
            eventKey='Statistics'
            title='Statistics'
            style={{ marginTop: '7rem' }}
            onclick={() => handleSelect('Statistics')}
          >
            {statistics.map((course) => {
              return (
                <Row
                  className='Courses__teacherCourse'
                  key={course.course_id}
                  onClick={() => getStatisticOfCourse(course.course_id)}
                >
                  <Col xs={4} className='Courses__iconImage'>
                    <img
                      src={course.course_display_image ? course.course_display_image : NoPreview}
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
      <Toast
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '15%',
          zIndex: '999',
        }}
        onClose={() => setShowToast(false)}
        show={showToast}
        delay={3000}
        autohide
      >
        <Toast.Header>
          <strong className='mr-auto'>Copied!</strong>
          <small>Just Now</small>
        </Toast.Header>
        <Toast.Body>The link has been copied to your clipboard!</Toast.Body>
      </Toast>
    </>
  );
};

const mapStateToProps = (state) => ({
  clientId: getClientId(state),
  clientUserId: getClientUserId(state),
  courseId: getCourseId(state),
  dashboardData: getCurrentDashboardData(state),
  roleArray: getRoleArray(state),
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
  dashboardData: PropTypes.instanceOf(Object).isRequired,
  roleArray: PropTypes.instanceOf(Array).isRequired,
};
