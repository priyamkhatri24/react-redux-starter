import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Swal from 'sweetalert2';
import fromUnixTime from 'date-fns/fromUnixTime';
import compareAsc from 'date-fns/compareAsc';
import Accordion from 'react-bootstrap/Accordion';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import PlyrComponent from 'plyr-react';
import 'plyr-react/dist/plyr.css';
import Col from 'react-bootstrap/Col';
import { apiValidation, get, post } from '../../Utilities';
import { PageHeader } from '../Common/PageHeader/PageHeader';
import { testsActions } from '../../redux/actions/tests.action';
import { getClientUserId } from '../../redux/reducers/clientUserId.reducer';
import { getCurrentBranding } from '../../redux/reducers/branding.reducer';
import { getCourseId } from '../../redux/reducers/course.reducer';

const Mycourse = (props) => {
  const {
    history,
    courseId,
    setTestResultArrayToStore,
    setTestTypeToStore,
    setTestIdToStore,
    setTestEndTimeToStore,
    setTestStartTimeToStore,
    clientUserId,
    currentbranding: {
      branding: { client_logo: image },
    },
  } = props;
  const options = {
    autoplay: true,
  };
  const [course, setCourse] = useState({});
  const [isVideo, setVideo] = useState(false);
  const [source, setSource] = useState({
    type: 'video',
    sources: [
      {
        src: 'w5Aioq5VYF0',
        provider: 'youtube',
      },
    ],
  });

  useEffect(() => {
    if (!courseId) history.push('/');
    else {
      const payload = {
        client_user_id: clientUserId,
        course_id: courseId,
      };

      get(payload, '/getCourseDetails').then((res) => {
        const result = apiValidation(res);
        setCourse(result);
        if (result.course_preview_video) setVideo(true);
        setSource((s) => (s.sources = [{ src: result.course_preview_video }]));
      });
    }
  }, [courseId, clientUserId]);

  const displayContent = (elem, type) => {
    if (type === 'file') {
      if (elem.file_type === 'video') {
        setVideo(true);
        const newSource = JSON.parse(JSON.stringify(source));
        newSource.sources = [{ src: elem.file_link }];
        setSource(newSource);
      } else {
        history.push({
          pathname: '/fileviewer',
          state: { filePath: elem.file_link },
        });
      }
    } else if (type === 'test') {
      if (elem.test_type === 'homework') {
        startHomeworkTest(elem);
      } else if (elem.test_type === 'demo test') startDemoTest(elem);
      else if (elem.test_type === 'live test') startLiveTest(elem);
    }
  };

  const startHomeworkTest = (elem) => {
    const payload = {
      client_user_id: clientUserId,
      test_id: elem.id,
      language_type: elem.language_type,
    };

    get(payload, '/getTestQuestionsForStudentWithLanguage').then((res) => {
      Swal.fire({
        title: 'Your Homework is Loaded',
        text: 'hello',
        icon: 'success',
        showCloseButton: true,
        showCancelButton: true,
        confirmButtonText: `Attempt`,
        denyButtonText: `Later`,
        customClass: 'Assignments__SweetAlert',
      }).then((result) => {
        if (result.isConfirmed) {
          const response = apiValidation(res);
          startHomework(response, elem.id);
        }
      });
      console.log(res);
    });
  };

  const startHomework = (responseArray, testId) => {
    const { push } = history;
    push('/questiontaker');
    setTestResultArrayToStore(responseArray);
    setTestIdToStore(testId);
    setTestTypeToStore('homework');
  };

  const startDemoTest = (elem) => {
    const demoPayload = {
      test_id: elem.test_id,
      client_user_id: clientUserId,
    };

    get(demoPayload, '/getDemoTestEndTime').then((res) => {
      const result = apiValidation(res);
      console.log(result, 'endTime');
      if (result.status === 'Not started') {
        Swal.fire({
          text: 'Do you wish to attempt the test?',
          icon: 'question',
          showCloseButton: true,
          showCancelButton: true,
          confirmButtonText: `Attempt`,
          denyButtonText: `Later`,
          customClass: 'Assignments__SweetAlert',
        }).then((response) => {
          if (response.isConfirmed) {
            const testPayload = {
              client_user_id: clientUserId,
              test_id: elem.test_id,
              test_status: 'started',
            };

            post(testPayload, '/submitTest').then((testres) => {
              if (testres.success) {
                const demoTestPayload = {
                  client_user_id: clientUserId,
                  test_id: elem.test_id,
                  language_type: elem.language_type,
                };
                get(demoTestPayload, '/getTestQuestionsForStudentWithLanguage').then((r) =>
                  console.log(r),
                );
              }
            });
          } else if (response.isDenied) {
            console.log('oh no');
          }
        });
      } else if (result.status === 'started') {
        const currentTime = fromUnixTime(result.current_time);
        const testStartTime = fromUnixTime(result.test_end_time);
        const dateResult = compareAsc(currentTime, testStartTime);
        console.log(dateResult);

        if (dateResult < 0) {
          const demoTestPayload = {
            client_user_id: clientUserId,
            test_id: elem.test_id,
            language_type: elem.language_type,
          };
          get(demoTestPayload, '/getTestQuestionsForStudentWithLanguage').then((response) => {
            console.log(response);
            const studentQuestions = apiValidation(response);
            startLive(studentQuestions, currentTime, testStartTime, 'demotest');
          });
        } else if (dateResult > 0) {
          const testPayload = {
            client_user_id: clientUserId,
            test_id: elem.test_id,
            test_status: 'expired',
          };
          post(testPayload, '/submitTest').then((responseSubmit) => {
            if (responseSubmit.success) {
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'The test has expired',
              });
            }
          });
        }
      } else if (result.status === 'expired') {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'The test has expired',
        });
      }
    });
  };

  const startLiveTest = (elem) => {
    console.log('live');
    // const liveCheck = allowLiveTest.filter((e) => {
    //   return e.id === elem.test_id;
    // });
    // if (liveCheck.length > 0 && liveCheck[0].isAllowed) {
    //   const payload = {
    //     client_user_id: clientUserId,
    //     test_id: elem.test_id,
    //     language_type: elem.language_type,
    //   };
    //   get(payload, '/getTestQuestionsForStudentWithLanguage').then((res) => {
    //     Swal.fire({
    //       title: 'Your Live Test is Loaded',
    //       text: 'hello',
    //       icon: 'success',
    //       showCloseButton: true,
    //       showCancelButton: true,
    //       confirmButtonText: `Attempt`,
    //       denyButtonText: `Later`,
    //       customClass: 'Assignments__SweetAlert',
    //     }).then((result) => {
    //       if (result.isConfirmed) {
    //         const response = apiValidation(res);
    //         startLive(
    //           response,
    //           parseInt(liveCheck[0].startTime, 10),
    //           liveCheck[0].endTime,
    //           'livetest',
    //         );
    //         console.log(response);
    //       }
    //     });
    //     console.log(res, 'live test');
    //   });
    // }
  };

  const startLive = (responseArray, startTime = 0, endTime = 0, testType) => {
    const { push } = history;
    // push({
    //   pathname: '/questiontaker',
    //   state: { result: responseArray, currentTime: startTime, testEndTime: endTime },
    // });
    push('/questiontaker');
    setTestResultArrayToStore(responseArray);
    setTestEndTimeToStore(endTime);
    setTestStartTimeToStore(startTime);
    setTestTypeToStore(testType);
  };

  return (
    <div>
      <PageHeader transparent />
      {Object.keys(course).length > 0 && (
        <div>
          {isVideo && (
            <div>
              <PlyrComponent source={source} options={options} />
            </div>
          )}
          {!isVideo && (
            <div className='m-3'>
              <img
                src={course.course_display_image ? course.course_display_image : image}
                alt='logo'
                className='img-fluid'
              />
            </div>
          )}
          <Tabs
            defaultActiveKey='Lectures'
            className='Profile__Tabs'
            justify
            style={{ marginTop: '3rem' }}
          >
            <Tab eventKey='Lectures' title='Lectures'>
              <p className='Courses__heading m-3'>Course Content</p>
              {course.section_array.map((e) => {
                return (
                  <Accordion key={e.section_id}>
                    <Card className='Courses__accordionHeading m-3'>
                      <Accordion.Toggle as='div' eventKey='0'>
                        <Row className='m-2'>
                          <span>{e.section_name}</span>
                          <span className='ml-auto'>
                            <ExpandMoreIcon />
                          </span>
                        </Row>
                      </Accordion.Toggle>
                      <Accordion.Collapse eventKey='0'>
                        <div>
                          {e.content_array.map((elem, i) => {
                            return (
                              <Row
                                className='mx-2'
                                key={elem.id}
                                onClick={() => displayContent(elem, elem.content_type)}
                              >
                                <Col xs={2}>{i + 1}.</Col>
                                <Col xs={10} className='p-0'>
                                  <p className='mb-0'>{elem.name}</p>
                                  <small>Type : {elem.content_type}</small>
                                </Col>
                              </Row>
                            );
                          })}
                        </div>
                      </Accordion.Collapse>
                    </Card>
                  </Accordion>
                );
              })}
            </Tab>
            <Tab eventKey='More' title='More'>
              <div
                className='Scrollable__viewAll justify-content-center align-items-center d-flex'
                style={{ height: '50vh' }}
              >
                Coming Soon
              </div>
            </Tab>
          </Tabs>
        </div>
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  clientUserId: getClientUserId(state),
  currentbranding: getCurrentBranding(state),
  courseId: getCourseId(state),
});

const mapDispatchToProps = (dispatch) => {
  return {
    setTestIdToStore: (payload) => {
      dispatch(testsActions.setTestIdToStore(payload));
    },
    setTestTypeToStore: (payload) => {
      dispatch(testsActions.setTestTypeToStore(payload));
    },
    setTestStartTimeToStore: (payload) => {
      dispatch(testsActions.setTestStartTimeToStore(payload));
    },
    setTestEndTimeToStore: (payload) => {
      dispatch(testsActions.setTestEndTimeToStore(payload));
    },
    setTestResultArrayToStore: (payload) => {
      dispatch(testsActions.setTestResultArrayToStore(payload));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Mycourse);

Mycourse.propTypes = {
  clientUserId: PropTypes.number.isRequired,
  history: PropTypes.instanceOf(Object).isRequired,
  setTestResultArrayToStore: PropTypes.func.isRequired,
  setTestEndTimeToStore: PropTypes.func.isRequired,
  setTestStartTimeToStore: PropTypes.func.isRequired,
  setTestIdToStore: PropTypes.func.isRequired,
  setTestTypeToStore: PropTypes.func.isRequired,
  currentbranding: PropTypes.shape({
    branding: PropTypes.shape({
      client_logo: PropTypes.string,
      client_icon: PropTypes.string,
      client_title: PropTypes.string,
    }),
  }).isRequired,
  courseId: PropTypes.number.isRequired,
};
