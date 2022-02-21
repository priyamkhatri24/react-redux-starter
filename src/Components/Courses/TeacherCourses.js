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
import InfiniteScroll from 'react-infinite-scroll-component';
import {
  getClientId,
  getClientUserId,
  getRoleArray,
} from '../../redux/reducers/clientUserId.reducer';
import { getCourseId } from '../../redux/reducers/course.reducer';
import { get, post } from '../../Utilities/Remote';
import { apiValidation, shareThis } from '../../Utilities';
import { Readmore, PageHeader } from '../Common';
import BottomNavigation from '../Common/BottomNavigation/BottomNavigation';
import { courseActions } from '../../redux/actions/course.action';
import './Courses.scss';
import '../Profile/Profile.scss';
import { getCurrentBranding } from '../../redux/reducers/branding.reducer';
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
    currentbranding: {
      branding: { currency_symbol: currencySymbol },
    },
  } = props;
  const [courses, setCourses] = useState([]);
  const [sortBy, setSortBy] = useState('date');
  const [filterModal, setFilterModal] = useState(false);
  const [statistics, setStatistics] = useState([]);
  const [courseModal, setCourseModal] = useState(false);
  const [courseTitle, setCourseTitle] = useState('');
  const [isValid, setValid] = useState(false);
  const inputEl = useRef(null);
  const [showToast, setShowToast] = useState(false);
  const [searchString, setSearchString] = useState('');
  const [activeTab, setActiveTab] = useState('My Courses');
  const [searchedCourses, setSearchedCourses] = useState([]);
  const [searchedStatistics, setSearchedStatistics] = useState([]);
  // const [page, setPage] = useState(1);
  const [coursePage, setCoursePage] = useState(1);
  const [searchedCoursePage, setSearchedCoursePage] = useState(1);
  const [statisticsPage, setStatisticsPage] = useState(1);
  const [searchedStatisticsPage, setSearchedStatisticsPage] = useState(1);

  // const infiniteScroll = () => {
  //   // console.log(currencySymbol)
  //   if (
  //     window.innerHeight + document.documentElement.scrollTop >=
  //       document.documentElement.offsetHeight - 10 ||
  //     window.innerHeight + document.body.scrollTop >= document.body.offsetHeight
  //   ) {
  //     if (activeTab === 'My Courses') {
  //       setSearchedCoursePage((prev) => prev + 1);
  //       setCoursePage((prev) => prev + 1);
  //     } else if (activeTab === 'Statistics') {
  //       setSearchedStatisticsPage((prev) => prev + 1);
  //       setStatisticsPage((prev) => prev + 1);
  //     }
  //     console.log(activeTab);
  //   }
  // };

  const infiniteScroll = () => {
    if (activeTab === 'My Courses') {
      setSearchedCoursePage((prev) => prev + 1);
      setCoursePage((prev) => prev + 1);
    } else if (activeTab === 'Statistics') {
      setSearchedStatisticsPage((prev) => prev + 1);
      setStatisticsPage((prev) => prev + 1);
    }
  };

  // useEffect(() => {
  //   window.addEventListener('scroll', infiniteScroll);

  //   return () => window.removeEventListener('scroll', infiniteScroll);
  // }, [activeTab]);

  const NoPreview =
    'https://s3.ap-south-1.amazonaws.com/ingenium-question-images/1625835287424.jpg';

  useEffect(() => {
    //   const payload = {
    //     client_id: clientId,
    //     client_user_id: clientUserId,
    //     is_admin: roleArray.includes(4),
    //     sort_by: sortBy,
    //     page: coursePage,
    //   };
    //   // get(payload, '/getCoursesOfCoachingLatest3').then((res) => {
    //   //   const result = apiValidation(res);
    //   //   const searchedArray = [...courses, ...result].filter(
    //   //     (e) => e.course_title.toLowerCase().indexOf(searchString.toLowerCase()) > -1,
    //   //   );
    //   //   setCourses(searchedArray);
    //   //   console.log(result, 'getCoursesOfCoachingLatest3');
    //   // });
    //   // console.log(history, 'hiatory');

    //   const publishedPayload = {
    //     client_id: clientId,
    //     client_user_id: clientUserId,
    //     is_admin: roleArray.includes(4),
    //     sort_by: sortBy,
    //     page: 1,
    //   };
    //   // get(publishedPayload, '/getPublishedCoursesOfCoaching3').then((res) => {
    //   //   const result = apiValidation(res);
    //   //   console.log(result, 'getPublishedCoursesOfCoaching3');
    //   //   const searchedArray = [...statistics, ...result].filter(
    //   //     (e) => e.course_title.toLowerCase().indexOf(searchString.toLowerCase()) > -1,
    //   //   );
    //   //   setStatistics(searchedArray);
    //   // });

    get({ client_id: clientId, course_id: 9 }, '/getCourseDetails').then((res) => {
      console.log(res, 'jaishritest');
    });
  }, [clientId, clientUserId, history, roleArray, sortBy]);

  useEffect(() => {
    let timer;
    if (searchString.length > 0 && activeTab === 'My Courses') {
      console.log(searchedCourses, 'searchedCourses');
      timer = setTimeout(() => {
        const searchPayload = {
          client_id: clientId,
          client_user_id: clientUserId,
          is_admin: roleArray.includes(4),
          sort_by: sortBy,
          page: searchedCoursePage,
          keyword: searchString,
        };

        get(searchPayload, '/searchInCourses2').then((res) => {
          const result = apiValidation(res);
          const searchedArray = [...searchedCourses, ...result];
          setSearchedCourses(searchedArray);
          console.log(result, 'searchInCourses', searchedCoursePage);
        });
      }, 500);
    }
    if (searchString.length === 0 && activeTab === 'My Courses') {
      const payload = {
        client_id: clientId,
        client_user_id: clientUserId,
        is_admin: roleArray.includes(4),
        sort_by: sortBy,
        page: coursePage,
      };

      get(payload, '/getCoursesOfCoachingLatest3').then((res) => {
        const result = apiValidation(res);
        const resultArray = [...courses, ...result];
        setCourses(resultArray);
        console.log(result, 'getCoursesOfCoachingLatest3', coursePage);
      });
    }
    return () => {
      clearTimeout(timer);
      // setCourses([]);
      //     // setCoursePage(1);
      // setSearchedCoursePage(1);
    };
  }, [coursePage, searchString, activeTab, sortBy]);

  useEffect(() => {
    let timer;
    if (searchString.length > 0 && activeTab === 'Statistics') {
      timer = setTimeout(() => {
        const publishedPayload = {
          client_id: clientId,
          client_user_id: clientUserId,
          is_admin: roleArray.includes(4),
          sort_by: sortBy,
          page: searchedStatisticsPage,
          keyword: searchString,
        };
        get(publishedPayload, '/searchInPublishedCourses2').then((res) => {
          const result = apiValidation(res);
          const searchedArray = [...searchedStatistics, ...result];
          console.log(result);
          setSearchedStatistics(searchedArray);
        });
      }, 500);
    }
    if (searchString.length === 0 && activeTab === 'Statistics') {
      const publishedPayload = {
        client_id: clientId,
        client_user_id: clientUserId,
        is_admin: roleArray.includes(4),
        sort_by: sortBy,
        page: statisticsPage,
      };

      get(publishedPayload, '/getPublishedCoursesOfCoaching3').then((res) => {
        const result = apiValidation(res);
        console.log(result, 'getPublishedCoursesOfCoaching3', statisticsPage);
        const resultArray = [...statistics, ...result];
        setStatistics(resultArray);
      });
    }
    return () => {
      clearTimeout(timer);
    };
  }, [statisticsPage, searchString, activeTab, sortBy]);

  useEffect(() => {
    console.log(history.location.state);
    if (history.location.state && history.location.state.activeTab) {
      handleSelect(history.location.state.activeTab);
      delete history.location.state;
    }
  }, [history.location.state]);

  const getStatisticOfCourse = (id) => {
    history.push({ pathname: '/courses/teachercourse/statistics', state: { id, currencySymbol } });
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
    const url = `${window.location.protocol}//${
      window.location.host
    }/courses/buyCourse/${window.btoa(clientId)}/${window.btoa(course.course_id)}`;
    console.log(url);
    const hasShared = shareThis(url, dashboardData.client_name);
    if (hasShared === 'clipboard') setShowToast(true);
  };

  const searchCourses = (search) => {
    setSearchString(search);
    if (!search) window.scrollTo(0, 0);
    if (activeTab === 'My Courses') {
      setSearchedCourses([]);
      setCourses([]);
      setCoursePage(1);
      setSearchedCoursePage(1);
    }
    if (activeTab === 'Statistics') {
      setSearchedStatistics([]);
      setStatistics([]);
      setStatisticsPage(1);
      setSearchedStatisticsPage(1);
    }
  };

  const handleSelect = (tab) => {
    console.log(tab);
    setCoursePage(1);
    setStatisticsPage(1);
    setSearchedCoursePage(1);
    setSearchedStatisticsPage(1);
    setActiveTab(tab);
    window.scrollTo(0, 0);
  };

  const triggerFilters = () => setFilterModal(!filterModal);

  const filterResult = (how) => {
    if (how === 'alphabetically' && sortBy !== 'name') {
      // setSearchString('');
      setCoursePage(1);
      setStatisticsPage(1);
      setCourses([]);
      setStatistics([]);
      setSortBy('name');
    } else if (how !== 'alphabetically' && sortBy !== 'date') {
      // setSearchString('');
      setCoursePage(1);
      setStatisticsPage(1);
      setStatistics([]);
      setCourses([]);
      setSortBy('date');
    }
    setFilterModal(false);
  };

  return (
    <>
      <PageHeader
        title='Courses'
        handleBack={goToDashboard}
        customBack
        filter
        triggerFilters={triggerFilters}
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
          activeKey={activeTab}
        >
          <Tab
            eventKey='My Courses'
            title='My Courses'
            style={{ marginTop: '7rem', marginBottom: '1rem' }}
            onclick={() => handleSelect('My Courses')}
          >
            <Button
              variant='customPrimaryWithShadow'
              style={{
                position: 'fixed',
                bottom: 20,
                zIndex: '10',
                left: '50%',
                transform: 'translate(-50%, 0)',
              }}
              onClick={() => showCourseModal()}
            >
              Create Course
            </Button>
            {/* {(searchString.length > 0 && activeTab == 'My Courses' ? searchedCourses : courses).map( */}
            <InfiniteScroll
              dataLength={(searchedCourses.length > 0 ? searchedCourses : courses).length}
              next={infiniteScroll}
              height={document.documentElement.clientHeight - 130}
              hasMore
              loader={<h4 />}
            >
              {(searchedCourses.length > 0 ? searchedCourses : courses).map((course) => {
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
                      <p className='Scrollable__courseCardHeading mx-2 mb-1'>
                        {course.course_title}
                      </p>
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
                              ? {
                                  background: '#D26163',
                                  color: '#fff',
                                }
                              : { background: ' rgba(0, 0, 0, 0.54)', color: '#fff' }
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
            </InfiniteScroll>
          </Tab>
          <Tab
            eventKey='Statistics'
            title='Statistics'
            style={{ marginTop: '7rem' }}
            onclick={() => handleSelect('Statistics')}
          >
            <InfiniteScroll
              dataLength={(searchedStatistics.length > 0 ? searchedStatistics : statistics).length}
              next={infiniteScroll}
              hasMore
              height={document.documentElement.clientHeight - 130}
              loader={<h4 />}
            >
              {(searchedStatistics.length > 0 ? searchedStatistics : statistics).map((course) => {
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
                      <p className='Scrollable__courseCardHeading mx-2 mb-1'>
                        {course.course_title}
                      </p>
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
            </InfiniteScroll>
          </Tab>
        </Tabs>

        <Modal centered show={filterModal} onHide={() => setFilterModal(false)}>
          <Modal.Body>
            {/* eslint-disable */}
            <p
              style={{ fontFamily: 'Montserrat-Bold', cursor: 'pointer' }}
              onClick={() => filterResult('datewise')}
            >
              Date wise
            </p>
            <p
              style={{ fontFamily: 'Montserrat-Bold', cursor: 'pointer' }}
              onClick={() => filterResult('alphabetically')}
            >
              Alphabetically
            </p>
          </Modal.Body>
        </Modal>

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

        <BottomNavigation activeNav='courses' history={history} />
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
  currentbranding: getCurrentBranding(state),
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
  currentbranding: PropTypes.shape({
    branding: PropTypes.shape({
      currency_symbol: PropTypes.string,
    }),
  }).isRequired,
};
