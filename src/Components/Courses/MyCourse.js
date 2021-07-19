import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Swal from 'sweetalert2';
import fromUnixTime from 'date-fns/fromUnixTime';
import compareAsc from 'date-fns/compareAsc';
import differenceInSeconds from 'date-fns/differenceInSeconds';
import Accordion from 'react-bootstrap/Accordion';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';
import Toast from 'react-bootstrap/Toast';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import PlyrComponent from 'plyr-react';
import 'plyr-react/dist/plyr.css';
import Col from 'react-bootstrap/Col';
import { apiValidation, get, post, shareThis } from '../../Utilities';
import { PageHeader } from '../Common/PageHeader/PageHeader';
import { testsActions } from '../../redux/actions/tests.action';
import { getClientId, getClientUserId } from '../../redux/reducers/clientUserId.reducer';
import { getCurrentBranding } from '../../redux/reducers/branding.reducer';
import { getCourseId } from '../../redux/reducers/course.reducer';
import checkmark from '../../assets/images/order/icons8-checked.svg';
import { getCurrentDashboardData } from '../../redux/reducers/dashboard.reducer';

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
    dashboardData,
    clientId,
    currentbranding: {
      branding: { client_logo: image },
    },
  } = props;
  const options = {
    autoplay: true,
  };
  const [course, setCourse] = useState({});
  const [analysis, setAnalysis] = useState({});
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const [isVideo, setVideo] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [imgLink, setImgLink] = useState('');
  const [source, setSource] = useState({
    type: 'video',
    sources: [
      {
        src: 'w5Aioq5VYF0',
        provider: 'youtube',
      },
    ],
  });
  const [showToast, setShowToast] = useState(false);

  const handleImageOpen = () => setShowImageModal(true);
  const handleImageClose = () => setShowImageModal(false);

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

  const openImage = (elem) => {
    setImgLink(elem.file_link);
    handleImageOpen();
  };

  const displayContent = (elem, type) => {
    if (type === 'file') {
      // if (elem.file_type === 'video') {
      //   setVideo(true);
      //   const newSource = JSON.parse(JSON.stringify(source));
      //   newSource.sources = [{ src: elem.file_link }];
      //   setSource(newSource);
      // }
      console.log(elem);
      if (elem.file_type === 'gallery') {
        openImage(elem);
      } else if (elem.file_type === '.pdf') {
        history.push({
          pathname: '/fileviewer',
          state: { filePath: elem.file_link },
        });
      } else if (elem.file_type === 'youtube') {
        history.push({
          pathname: `/videoplayer/${elem.file_link}`,
          state: { videoId: elem.file_id },
        });
      } else if (elem.file_type === 'video') {
        history.push({
          pathname: `/videoplayer`,
          state: { videoLink: elem.file_link, videoId: elem.file_id },
        });
      } else {
        history.push({
          pathname: '/otherfileviewer',
          state: { filePath: elem.file_link },
        });
      }
    } else if (type === 'test') {
      const payload = {
        client_user_id: clientUserId,
        test_id: elem.id,
        is_paid: false,
      };

      get(payload, '/getTestStatusForStudent').then((res) => {
        const resp = apiValidation(res);
        console.log(resp);
        if (resp.is_attempt === 1) {
          Swal.fire({
            icon: 'info',
            title: 'Oops...',
            text: 'You have already attempted this test. Would you like to see your results?',
            showCloseButton: true,
            showCancelButton: true,
            customClass: 'Assignments__SweetAlert',
          }).then((result) => {
            if (result.isConfirmed) {
              const testPayload = {
                client_user_id: clientUserId,
                test_id: elem.id,
                test_type: elem.test_type,
              };
              get(testPayload, '/getTestAnalysisForStudent').then((response) => {
                console.log(response);
                const analysisResult = apiValidation(response, 'analysis');
                setAnalysis(analysisResult);
                openAnalysisModal();
              });
            }
          });
        } else if (elem.test_type === 'homework') {
          startHomeworkTest(elem);
        } else if (elem.test_type === 'demo test') startDemoTest(elem);
        else if (elem.test_type === 'live test') startLiveTest(elem);
      });
    }
  };

  const startHomeworkTest = (elem) => {
    const payload = {
      client_user_id: clientUserId,
      test_id: elem.id,
      language_type: elem.language_type,
    };

    get(payload, '/getTestQuestionsForStudentWithLanguageLatest').then((res) => {
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
    setTestResultArrayToStore(responseArray);
    setTestIdToStore(testId);
    setTestTypeToStore('homework');
    push('/questiontaker');
  };

  const startDemoTest = (elem) => {
    const demoPayload = {
      test_id: elem.id,
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
              test_id: elem.id,
              test_status: 'started',
            };

            post(testPayload, '/submitTest').then((testres) => {
              if (testres.success) {
                const demoTestPayload = {
                  client_user_id: clientUserId,
                  test_id: elem.id,
                  language_type: elem.language_type,
                };
                get(demoTestPayload, '/getTestQuestionsForStudentWithLanguageLatest').then((r) => {
                  const studentQuestions = apiValidation(r);
                  console.log(
                    +new Date(),
                    +new Date() + parseInt(result.duration, 10) / 1000,
                    'wtfffff',
                  );
                  startLive(
                    studentQuestions,
                    Math.round(+new Date() / 1000),
                    Math.round((+new Date() + parseInt(result.duration, 10)) / 1000),
                    'demotest',
                    elem.id,
                  );
                });
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
            test_id: elem.id,
            language_type: elem.language_type,
          };
          get(demoTestPayload, '/getTestQuestionsForStudentWithLanguageLatest').then((response) => {
            console.log(response);
            const studentQuestions = apiValidation(response);
            startLive(
              studentQuestions,
              Math.round(currentTime / 1000),
              Math.round(testStartTime / 1000),
              'demotest',
              elem.id,
            );
          });
        } else if (dateResult > 0) {
          const testPayload = {
            client_user_id: clientUserId,
            test_id: elem.id,
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
    console.log('live', elem);

    get({ test_id: elem.id }, '/getTestAvailability').then((res) => {
      console.log(res);
      const result = apiValidation(res);
      const currentTime = fromUnixTime(result.current_time);
      const testStartTime = fromUnixTime(parseInt(result.test_start_time, 10));
      const dateResult = compareAsc(currentTime, testStartTime);
      if (dateResult > 0 && Number(result.status) !== 1) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'The test has expired',
        });
      } else if (dateResult < 0) {
        const durationTime = differenceInSeconds(testStartTime, currentTime);

        Swal.fire({
          icon: 'warning',
          title: 'Oops...',
          text: `The test has not yet started. It will start in  ${Math.floor(
            durationTime / 3600,
          )} hour(s),  ${Math.floor((durationTime % 3600) / 60)} minute(s) and ${Math.floor(
            durationTime % 60,
          )} second(s).`,
        });
      } else if (Number(result.status) === 1 && dateResult > 0) {
        const payload = {
          client_user_id: clientUserId,
          test_id: elem.id,
          language_type: elem.language_type,
        };
        get(payload, '/getTestQuestionsForStudentWithLanguage').then((resp) => {
          Swal.fire({
            title: 'Your Live Test is Loaded',
            text: 'hello',
            icon: 'success',
            showCloseButton: true,
            showCancelButton: true,
            confirmButtonText: `Attempt`,
            denyButtonText: `Later`,
            customClass: 'Assignments__SweetAlert',
          }).then((respo) => {
            if (respo.isConfirmed) {
              const response = apiValidation(resp);
              startLive(
                response,
                Math.round(+new Date() / 1000),
                parseInt(result.test_end_time, 10),
                'livetest',
                elem.id,
              );
              console.log(response);
            }
          });
          console.log(res, 'live test');
        });
      }
    });

    // const liveCheck = allowLiveTest.filter((e) => {
    //   return e.id === elem.test_id;
    // });
    //   if (liveCheck.length > 0 && liveCheck[0].isAllowed) {

    // }
  };

  const startLive = (responseArray, startTime = 0, endTime = 0, testType, id) => {
    const { push } = history;
    setTestResultArrayToStore(responseArray);
    setTestEndTimeToStore(endTime);
    setTestStartTimeToStore(startTime);
    setTestTypeToStore(testType);
    setTestIdToStore(id);
    push('/questiontaker');
  };

  const openAnalysisModal = () => setShowAnalysisModal(true);
  const closeAnalysisModal = () => setShowAnalysisModal(false);

  const shareCourse = () => {
    // eslint-disable-next-line
    const url = `${window.location.protocol}//${window.location.host}/courses/buyCourse/${clientId}/${course.course_id}`;
    console.log(url);
    const hasShared = shareThis(url, dashboardData.client_name);
    if (hasShared === 'clipboard') setShowToast(true);
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
                                  <small>
                                    Type : {elem.file_type ? elem.file_type : elem.content_type}
                                  </small>
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
                <Button
                  className='mt-3 mx-auto'
                  variant='greenButtonLong'
                  onClick={() => shareCourse()}
                >
                  Share
                </Button>
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
            </Tab>
          </Tabs>
        </div>
      )}

      <Modal show={showAnalysisModal} centered onHide={closeAnalysisModal}>
        <Modal.Header closeButton>
          <span className='Scrollable__courseCardHeading my-auto' style={{ fontSize: '14px' }}>
            Analysis
          </span>
        </Modal.Header>
        <Modal.Body className='mx-auto'>
          <div className='text-center my-3'>
            <img src={checkmark} alt='checkmark' />
          </div>
          <Row className='Scrollable__courseCardHeading mt-3 mx-auto' style={{ fontSize: '14px' }}>
            <Col className='text-center' xs={6}>
              Attempted
            </Col>
            <Col className='text-center' xs={6}>
              {analysis.attempted}
            </Col>
          </Row>
          <Row className='Scrollable__courseCardHeading mt-3 mx-auto' style={{ fontSize: '14px' }}>
            <Col className='text-center' xs={6}>
              Correct Questions
            </Col>
            <Col className='text-center' xs={6}>
              {analysis.correct_questions}
            </Col>
          </Row>
          <Row className='Scrollable__courseCardHeading mt-3 mx-auto' style={{ fontSize: '14px' }}>
            <Col className='text-center' xs={6}>
              Incorrect Questions
            </Col>
            <Col className='text-center' xs={6}>
              {analysis.incorrect_questions}
            </Col>
          </Row>
          <Row className='Scrollable__courseCardHeading mt-3 mx-auto' style={{ fontSize: '14px' }}>
            <Col className='text-center' xs={6}>
              Marks
            </Col>
            <Col className='text-center' xs={6}>
              {analysis.total_marks} / {analysis.maximum_marks}
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='boldTextSecondary' onClick={() => closeAnalysisModal()}>
            Cancel
          </Button>
        </Modal.Footer>
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
  clientUserId: getClientUserId(state),
  clientId: getClientId(state),
  currentbranding: getCurrentBranding(state),
  courseId: getCourseId(state),
  dashboardData: getCurrentDashboardData(state),
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
  clientId: PropTypes.number.isRequired,
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
  dashboardData: PropTypes.instanceOf(Object).isRequired,
};
