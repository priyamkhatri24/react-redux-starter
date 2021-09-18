import React, { useState, useEffect, useRef } from 'react';
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
import StarBorderIcon from '@material-ui/icons/StarBorder';
import StarIcon from '@material-ui/icons/Star';
import VideoIcon from '@material-ui/icons/VideoLibrary';
import Play from '@material-ui/icons/PlayArrow';
import LiveIcon from '@material-ui/icons/LiveTv';
import DocIcon from '@material-ui/icons/Description';
import TestIcon from '@material-ui/icons/LiveHelp';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Toast from 'react-bootstrap/Toast';
import Modal from 'react-bootstrap/Modal';
import ShareIcon from '@material-ui/icons/Share';
import Button from 'react-bootstrap/Button';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import PlyrComponent from 'plyr-react';
import 'plyr-react/dist/plyr.css';
import Col from 'react-bootstrap/Col';
import Reviews from './CourseReviews';
import ProgressBar from '../Common/ProgressBar/ProgressBar';
import { apiValidation, get, post, shareThis } from '../../Utilities';
import sampleReviews from './courseReviewsSample';
import YCIcon from '../../assets/images/ycIcon.png';
import { PageHeader } from '../Common/PageHeader/PageHeader';
import { testsActions } from '../../redux/actions/tests.action';
import { getClientId, getClientUserId } from '../../redux/reducers/clientUserId.reducer';
import { getCurrentBranding } from '../../redux/reducers/branding.reducer';
import { getCourseId } from '../../redux/reducers/course.reducer';
import checkmark from '../../assets/images/order/icons8-checked.svg';
import { getCurrentDashboardData } from '../../redux/reducers/dashboard.reducer';
import './Courses.scss';

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
  const [contentArray, setContentArray] = useState([]);
  const [isTabScrollable, setIsTabScrollable] = useState(false);
  const [reviewPlaceholder, setReviewPlaceholder] = useState(
    'Please describe your experience about this course here.',
  );
  const [tabHeight, setTabHeight] = useState(600);
  const [source, setSource] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [addedRating, setAddedRating] = useState(0);
  const [addedReview, setAddedReview] = useState('');
  const [reviews, setReviews] = useState([]);
  const [userHasCommented, setUserHasCommented] = useState(false);
  const [videoIsPlaying, setVideoIsPlaying] = useState(true);
  const [previewText, setPreviewText] = useState(true);
  const [nowPlayingVideo, setNowPlayingVideo] = useState(null);
  const vidRef = useRef(null);
  const handleImageOpen = () => setShowImageModal(true);
  const handleImageClose = () => setShowImageModal(false);

  useEffect(() => {
    document.addEventListener('scroll', function (e) {
      if (window.innerHeight + window.scrollY >= document.body.clientHeight - 50) {
        // setscrolledToBottom(true);
        const tabHeightFromTop = document.getElementById('idForScroll2')?.offsetTop;
        const tabH = document.body.clientHeight - tabHeightFromTop;
        setTabHeight(tabH - 50);
        console.log(document.body.clientHeight, 'CH');
        console.log(tabHeightFromTop, 'HT');
        setIsTabScrollable(true);
      } else {
        setIsTabScrollable(false);
      }
    });
  }, []);

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
        console.log(result);
        setReviews(result.reviews);
        // setReviews(sampleReviews);
        if (result.course_preview_vedio) {
          const vidsource = {
            type: 'video',
            sources: [
              {
                src: result.course_preview_vedio,
              },
            ],
          };

          setSource(result.course_preview_vedio);
        }
        const content = [...contentArray];
        result.section_array.forEach((elem) => {
          content.push(...elem.content_array);
        });
        setContentArray(content);
        console.log(content, 'finalContentArray');
        if (result.reviews.filter((ele) => ele.client_user_id === clientUserId).length) {
          setUserHasCommented(true);
          const userComment = result.reviews.filter((ele) => ele.client_user_id === clientUserId);
          userComment[0].isUserComment = true;
          const otherComments = result.reviews.filter((ele) => ele.client_user_id !== clientUserId);
          const finalReviewArray = [...userComment, ...otherComments];
          setReviews(finalReviewArray);
        }
      });
    }
  }, [courseId, clientUserId, history]);

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
      } else if (elem.file_type === 'video' && elem.isYoutube) {
        // history.push({
        //   pathname: `/videoplayer/${elem.file_link}`,
        //   state: { videoId: elem.file_id },
        // });
        /* eslint-disable */
        document.body.scrollTop = document.documentElement.scrollTop = 0;
        setNowPlayingVideo(elem);
        setSource(false);
      } else if (elem.file_type === 'video' && !elem.isYoutube) {
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

  const getHistogram = (arr) => {
    const array = [...arr];
    const hist = {};
    array.forEach((elem) => {
      if (elem.file_type === 'image') {
        elem.category = 'Documents';
      } else if (elem.file_type === 'video') {
        elem.category = 'Videos';
      } else if (elem.file_type === 'youtube') {
        elem.category = 'Videos';
      } else if (elem.file_type === '') {
        elem.category = 'Tests';
      } else if (elem.file_type === 'live class') {
        elem.category = 'Live Classes';
      } else {
        elem.category = 'Documents';
      }
      if (Object.keys(hist).includes(elem.category)) {
        hist[elem.category] += 1;
      } else {
        hist[elem.category] = 1;
      }
    });
    return hist;
  };

  const renderContentHistogram = () => {
    return (
      <div className='scrollableContentOfCourses mt-3'>
        {Object.entries(getHistogram(contentArray)).map(([key, val]) => {
          let icon;
          if (key === 'Videos') {
            icon = <VideoIcon style={{ color: '#9f16cf' }} />;
          } else if (key === 'Documents') {
            icon = <DocIcon style={{ color: 'green' }} />;
          } else if (key === 'Live classes') {
            icon = <LiveIcon style={{ color: '#faa300' }} />;
          } else if (key === 'Tests') {
            icon = <TestIcon style={{ color: '#530de1' }} />;
          }
          return (
            <div className='scrollableContentOfCourses_item'>
              {icon}
              <p style={{ fontSize: '10px', fontFamily: 'Montserrat-SemiBold' }}>
                {val > 1 ? key : key.slice(0, key.length - 1)}
              </p>
              <h6 style={{ color: 'rgba(0,0,0,0.54)' }}>{val}</h6>
            </div>
          );
        })}
      </div>
    );
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

  const addReviewHandler = (e) => {
    e.preventDefault();
    // document.getElementById('reviewsIdForScroll').scrollIntoView({ behavior: 'smooth' });
    const payload = {
      rating: addedRating,
      review_text: addedReview,
      client_user_id: clientUserId,
      course_id: courseId,
    };
    if (!addedRating || !addedReview) return;
    setTimeout(() => {
      post(payload, '/addCourseReview').then((res) => {
        console.log(res);
        const userReview = reviews.filter((ele) => ele.client_user_id === clientUserId);
        userReview[0].review_text = addedReview;
        userReview[0].rating = addedRating;
        userReview[0].isUserComment = true;
        const otherReviews = reviews.filter((ele) => ele.client_user_id !== clientUserId);
        const finalReviewArray = [...userReview, ...otherReviews];
        setReviews(finalReviewArray);
        // alert('review added');
        setUserHasCommented(true);
      });
    }, 300);
  };

  const playVideo = () => {
    vidRef.current.play();
  };

  useEffect(() => {
    if (vidRef && vidRef.current) {
      vidRef.current.addEventListener('pause', (event) => {
        setPreviewText(true);
        setVideoIsPlaying(true);
        console.log('paused');
      });
      vidRef.current.addEventListener('play', (event) => {
        setVideoIsPlaying(false);
        setPreviewText(false);
        console.log('playing');
      });
    }
  });

  const scrollingHandler = () => {
    console.log('scrolling handler');
  };

  const editReviewHandler = () => {
    setUserHasCommented(false);
  };
  const starArr = new Array(addedRating).fill(Math.random());
  const borderStarArr = new Array(5 - addedRating).fill(Math.random());

  return (
    <div>
      <PageHeader transparent />
      <div className='backButtonForCoursesPage'> </div>
      <PageHeader iconColor='white' transparent title='' />
      <button className='shareButtonForCourse' type='button' onClick={() => shareCourse()}>
        <ShareIcon style={{ margin: '13px 16px', color: 'white' }} />
      </button>
      {nowPlayingVideo && (
        <div className='mx-auto Courses__lecturevideoplayer'>
          <PlyrComponent
            source={{
              type: 'video',
              sources: [
                {
                  src: nowPlayingVideo.file_link,
                  provider: 'youtube',
                },
              ],
            }}
            options={{ autoplay: false }}
          />
        </div>
      )}
      {source && (
        <>
          <div className='mx-auto Courses__videoplayer'>
            {/* eslint-disable */}
            <video
              ref={vidRef}
              width='100%'
              style={{ borderRadius: '5px' }}
              autoplay='autoplay'
              id='vidElement'
            >
              <source src={source} type='video/mp4' />
              <track src='' kind='subtitles' srcLang='en' label='English' />
            </video>
            <Play
              style={{ opacity: `${videoIsPlaying ? '1' : '0'}` }}
              onClick={playVideo}
              className='playIconCourse'
            />
          </div>
        </>
      )}
      {source ? (
        <p style={{ opacity: previewText ? '1' : '0' }} className='previewVideoTextClass'>
          Preview video
        </p>
      ) : (
        <p style={{ opacity: '0' }} className='previewVideoTextClass'>
          Preview
        </p>
      )}
      {!source && !nowPlayingVideo && (
        <div className='mx-auto Courses__thumbnail mb-2'>
          <img
            src={course.course_display_image ? course.course_display_image : image}
            alt='course'
            className='mx-auto img-fluid courseThumbnailImg'
          />
        </div>
      )}
      {Object.keys(course).length > 0 && (
        <div className='Courses__buycourseContainer'>
          <p className='Courses__courseCardHeading mx-auto mb-0 mt-0 w-90'>{course.course_title}</p>
          <Tabs
            defaultActiveKey='Content'
            className='Courses__Tabs'
            justify
            style={{ marginTop: '1rem', width: '100%' }}
          >
            <Tab
              className={`scrollableTabsForCourses ${isTabScrollable ? 'scrollable' : null}`}
              id='idForScroll2'
              eventKey='Content'
              title='Content'
              style={{
                height: `${tabHeight}px`,
                margin: 'auto 15px',
              }}
            >
              {renderContentHistogram()}
              <hr className='' />

              {course.section_array.map((e, secIndex) => {
                return (
                  <Accordion key={e.section_id}>
                    <Card className='Courses__accordionHeading my-2'>
                      <Accordion.Toggle as='div' eventKey='0'>
                        <Row className='m-2'>
                          <div>
                            <p style={{ fontSize: 'Montserrat-Bold' }} className='mb-0'>
                              Section - {secIndex + 1}
                            </p>
                            <h5 className='courseContentCardHeading'>{e.section_name}</h5>
                            <div className='d-flex'>
                              {Object.entries(getHistogram(e.content_array)).map(([key, val]) => {
                                return (
                                  <div className='d-flex'>
                                    <span className='mr-1 verySmallText'>{val}</span>
                                    <span className='verySmallText mr-4'>
                                      {val > 1 ? key : key.slice(0, key.length - 1)}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                          <span className='ml-auto'>
                            <ExpandMoreIcon />
                          </span>
                        </Row>
                        <div
                          style={{ width: '93%', margin: 'auto 0.5rem' }}
                          className='d-flex align-items-center'
                        >
                          {/* <ProgressBar
                            width={`${70}%`}
                            height='2px'
                            borderRadius='100px'
                            customStyle={{
                              backgroundColor: '#4154cf',
                              borderRadius: '100px',
                            }}
                            myProgressCustomStyle={{
                              width: '89%',
                              margin: '0px 20px 17px 0px',
                              backgroundColor: 'rgba(0,0,0,0.42)',
                            }}
                          /> */}
                          {/* <p className='verySmallText'>70%</p> */}
                        </div>
                      </Accordion.Toggle>
                      <Accordion.Collapse eventKey='0'>
                        <div>
                          {e.content_array.map((elem, i) => {
                            if (elem.file_type === 'youtube') {
                              elem.file_type = 'video';
                              elem.isYoutube = true;
                            }
                            let icon;
                            if (elem.category === 'Videos' && !elem.isYoutube) {
                              icon = (
                                <video className='individualVideoThumbnail' preload='metadata'>
                                  <source src={elem.file_link + '#t=0.1'} />
                                </video>
                              );
                            } else if (elem.category === 'Videos' && elem.isYoutube) {
                              icon = (
                                <img
                                  className='individualVideoThumbnail'
                                  src={`https://img.youtube.com/vi/${elem.file_link}/1.jpg`}
                                  alt='V'
                                />
                              );
                            } else if (elem.category === 'Documents') {
                              icon = <DocIcon style={{ color: 'green' }} />;
                            } else if (elem.category === 'Live classes') {
                              icon = <LiveIcon style={{ color: '#faa300' }} />;
                            } else if (elem.category === 'Tests') {
                              icon = <TestIcon style={{ color: '#530de1' }} />;
                            }
                            return (
                              <Row
                                style={{
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  width: '95%',
                                }}
                                /* eslint-disable */
                                onClick={() => displayContent(elem, elem.content_type)}
                                className='d-flex my-2 mx-auto'
                              >
                                <div style={{ width: '90%' }} className='d-flex align-items-center'>
                                  {elem.category !== 'Videos' ? (
                                    <div className='iconContainerForContents'>{icon}</div>
                                  ) : (
                                    <div className='videoContainerForContents'>{icon}</div>
                                  )}

                                  <div style={{ overflowX: 'hidden', width: '100%' }}>
                                    <p
                                      style={{ fontFamily: 'Montserrat-Bold' }}
                                      className='mx-2 mb-0'
                                      key={elem.name}
                                    >
                                      {elem.name}
                                    </p>
                                    <small className='verySmallText mx-2'>
                                      {elem.file_type
                                        ? elem.file_type.toUpperCase()
                                        : elem.content_type.toUpperCase()}
                                    </small>
                                    {/* <div
                                      style={{ width: '90%' }}
                                      className='d-flex mx-auto align-items-center'
                                    > */}
                                    {/* <ProgressBar
                                      width={`${70}%`}
                                      height='2px'
                                      borderRadius='100px'
                                      customStyle={{
                                        backgroundColor: '#4154cf',
                                        borderRadius: '100px',
                                      }}
                                      myProgressCustomStyle={{
                                        width: '91%',
                                        margin: '5px 8px',
                                        backgroundColor: 'rgba(0,0,0,0.42)',
                                      }}
                                    /> */}
                                    {/* <p className='verySmallText mb-0'>70%</p> */}
                                    {/* </div> */}
                                  </div>
                                </div>
                                {/* <LockIcon style={{ color: 'gray' }} /> */}
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
            <Tab
              className={`scrollableTabsForCourses ${isTabScrollable ? 'scrollable' : null}`}
              eventKey='Details'
              title='Details'
              style={{
                margin: 'auto 15px',
                height: `${tabHeight}px`,
              }}
            >
              <p className='Courses__heading my-2'>What will I learn?</p>
              {course.tag_array
                .filter((e) => e.tag_type === 'learning')
                .map((e) => {
                  return e.tag_name.length ? (
                    <p className='Courses__subHeading mb-2' key={e.course_tag_id}>
                      - {e.tag_name}
                    </p>
                  ) : null;
                })}
              <hr className='' />
              <p className='Courses__heading'>Description</p>
              <p className='Courses__subHeading mb-1'>{course.course_description}</p>
              <hr className='' />
              <p className='Courses__heading my-2'>Requirements</p>
              {course.tag_array
                .filter((e) => e.tag_type === 'prereqisite' || e.tag_type === 'pre_requisite')
                .map((e) => {
                  return e.tag_name.length ? (
                    <p className='Courses__subHeading mb-2' key={e.course_tag_id}>
                      - {e.tag_name}
                    </p>
                  ) : null;
                })}
              <hr className='' />
              <p className='Courses__heading'>This course includes</p>
              <p className='Courses__subHeading mb-2'>- Lifetime access</p>
              <p className='Courses__subHeading mb-2'>- Course completion certificate</p>
              <p className='Courses__subHeading mb-2'>- Access on mobile, laptop and TV</p>
            </Tab>
            {/* <Tab
              style={{
                height: `${tabHeight}px`,
                margin: 'auto 15px',
              }}
              className={`scrollableTabsForCourses ${isTabScrollable ? 'scrollable' : null}`}
              id='ReviewTab'
              title='Reviews'
              eventKey='Review'
            >
              {!userHasCommented && (
                <>
                  <p className='Courses__heading mt-4'>Rate this course</p>

                  <div className='d-flex justify-content-center w-100'>
                    {starArr.map((ele, i) => {
                      return (
                        <StarIcon
                          onClick={() => setAddedRating(i + 1)}
                          key={ele * Math.random()}
                          className='addReviewsBigIcon'
                        />
                      );
                    })}
                    {borderStarArr.map((ele, i) => (
                      <StarBorderIcon
                        onClick={() => setAddedRating(5 - borderStarArr.length + i + 1)}
                        key={ele * Math.random()}
                        className='addReviewsBigIcon'
                      />
                    ))}
                  </div>
                  <Form>
                    <Form.Group className='my-3'>
                      <Form.Control
                        onChange={(e) => setAddedReview(e.target.value)}
                        value={addedReview}
                        as='textarea'
                        placeholder={reviewPlaceholder}
                        rows={3}
                        className='addReviewTextArea'
                      />
                    </Form.Group>
                    <Button
                      onClick={addReviewHandler}
                      style={{
                        width: '100%',
                        color: 'white',
                        outline: 'none',
                        border: 'transparent',
                        fontFamily: 'Montserrat-Regular',
                        fontSize: '14px',
                      }}
                      className='mt-3 mb-2 mx-auto buyCourseBtn postBtnClr'
                    >
                      Post
                    </Button>
                  </Form>
                </>
              )}
              <div
                id='reviewsIdForScroll'
                style={{ marginTop: !userHasCommented ? '50px' : '1.5rem' }}
              >
                <Reviews
                  editClicked={editReviewHandler}
                  displayTwo={false}
                  isFilterVisible
                  reviews={reviews}
                />
              </div>
            </Tab> */}
            {/* <div
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
               */}
          </Tabs>
        </div>
      )}
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
