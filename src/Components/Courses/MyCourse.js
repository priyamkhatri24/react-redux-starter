import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Swal from 'sweetalert2';
// import ReactPlayer from 'react-player';
import fromUnixTime from 'date-fns/fromUnixTime';
import compareAsc from 'date-fns/compareAsc';
import differenceInSeconds from 'date-fns/differenceInSeconds';
import Accordion from 'react-bootstrap/Accordion';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Row from 'react-bootstrap/Row';
import StarBorderIcon from '@material-ui/icons/StarBorderRounded';
import StarIcon from '@material-ui/icons/StarRounded';
import VideoIcon from '@material-ui/icons/VideoLibrary';
import Play from '@material-ui/icons/PlayArrowRounded';
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
import { courseActions } from '../../redux/actions/course.action';
import { getClientId, getClientUserId } from '../../redux/reducers/clientUserId.reducer';
import { getCurrentBranding } from '../../redux/reducers/branding.reducer';
import {
  getCourseId,
  getCourseDocumentToOpen,
  getCourseNowPlayingVideo,
} from '../../redux/reducers/course.reducer';
import checkmark from '../../assets/images/order/icons8-checked.svg';
import { getCurrentDashboardData } from '../../redux/reducers/dashboard.reducer';
import './Courses.scss';

window.mobileAndTabletCheck = function () {
  let check = false;
  (function (a) {
    /* eslint-disable */
    if (
      /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(
        a,
      ) ||
      /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
        a.substr(0, 4),
      )
    )
      check = true;
  })(navigator.userAgent || navigator.vendor || window.opera);
  return check;
};

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
    courseDocumentToOpen,
    setCourseNowPlayingVideoToStore,
    setCourseDocumentToOpenToStore,
    courseNowPlayingVideo,
    currentbranding: {
      branding: { client_logo: image },
    },
  } = props;
  const options = {
    autoplay: true,
  };
  const [course, setCourse] = useState({});
  const [isDesktop, setIsDesktop] = useState(true);
  const [analysis, setAnalysis] = useState({});
  const [sectionArray, setSectionArray] = useState([]);
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const [isVideo, setVideo] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [imgLink, setImgLink] = useState('');
  const [contentArray, setContentArray] = useState([]);
  const [isTabScrollable, setIsTabScrollable] = useState(true);
  const [currentTab, setCurrentTab] = useState('content');
  const [isReviewing, setIsReviewing] = useState(false);
  const [reviewPlaceholder, setReviewPlaceholder] = useState(
    'Please describe your experience about this course here.',
  );
  const [tabHeight, setTabHeight] = useState(400);
  const [source, setSource] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [addedRating, setAddedRating] = useState(0);
  const [addedReview, setAddedReview] = useState('');
  const [reviews, setReviews] = useState([]);
  const [userHasCommented, setUserHasCommented] = useState(false);
  const [videoIsPlaying, setVideoIsPlaying] = useState(true);
  const [previewText, setPreviewText] = useState(true);
  const [lapseTime, setLapseTime] = useState(0);
  const [nowPlayingVideo, setNowPlayingVideo] = useState(null);
  const [documentToOpen, setDocumentToOpen] = useState(null);
  const [documentOpener, setDocumentOpener] = useState(false);
  const [isBrowserCompatible, setIsBrowserCompatible] = useState(true);
  const vidRef = useRef(null);
  const nowPlayingVideoRef = useRef(null);
  const handleImageOpen = () => setShowImageModal(true);
  const handleImageClose = () => setShowImageModal(false);

  useEffect(() => {
    setNowPlayingVideo(courseNowPlayingVideo);
    setDocumentToOpen(courseDocumentToOpen);
    if (courseDocumentToOpen) setDocumentOpener(true);
    // document.addEventListener('scroll', function (e) {
    //   if (window.innerHeight + window.scrollY >= document.body.clientHeight - 50) {
    //     // setscrolledToBottom(true);
    //     const tabHeightFromTop = document.getElementById('idForScroll2')?.offsetTop;
    //     const tabH = document.body.clientHeight - tabHeightFromTop;
    //     setTabHeight(tabH - 50);
    //     // console.log(document.body.clientHeight, 'CH');
    //     // console.log(tabHeightFromTop, 'HT');
    //     setIsTabScrollable(true);
    //   } else {
    //     // setIsTabScrollable(false);
    //
    //   }
    // });
    // if (window.mobileAndTabletCheck()) {
    //   setIsDesktop(true);
    // } else {
    //   setIsDesktop(false);
    // }
    if (document.body.clientWidth > 575) {
      setIsDesktop(true);
    } else {
      setIsDesktop(false);
    }
    // if (window.mobileAndTabletCheck()) {
    //   setIsDesktop(true);
    // }
  }, []);

  useEffect(() => {
    let timer;
    let time;
    if (nowPlayingVideo) {
      nowPlayingVideoRef.current.plyr.once('play', () => {
        nowPlayingVideoRef.current.plyr.currentTime = +nowPlayingVideo.finishedTime;
        console.log('seeking....', nowPlayingVideo);

        timer = setInterval(() => {
          time = nowPlayingVideoRef.current.plyr.currentTime;
          console.log(time);
          if (isNaN(time)) return;
          const payload = {
            section_has_file_id: nowPlayingVideo.sectionFileId,
            client_user_id: clientUserId,
            finished_time: time,
            total_time: nowPlayingVideo.duration,
          };

          post(payload, '/updateCourseContentViewStatus').then((resp) => {
            console.log(resp);
          });
        }, 5000);
      });
    }

    return () => {
      clearInterval(timer);
      if (nowPlayingVideo) {
        const newContentArray = contentArray.map((elem) => {
          if (elem.id === nowPlayingVideo.id) {
            elem.finished_time = time;
          }
          return elem;
        });
        // console.log(nowPlayingVideo);

        const payload = {
          section_has_file_id: nowPlayingVideo.sectionFileId,
          client_user_id: clientUserId,
          finished_time: isNaN(time) ? 0 : time,
          total_time: nowPlayingVideoRef.current.plyr.duration || nowPlayingVideo.duration,
        };
        console.log(nowPlayingVideoRef.current.plyr);
        post(payload, '/updateCourseContentViewStatus').then((resp) => {
          console.log(resp);
        });
        setContentArray(newContentArray);
        // setLapseTime(0);
      }
    };
  }, [nowPlayingVideo]);

  useEffect(() => {
    if (currentTab === 'reviews') return;
    // setscrolledToBottom(true);
    console.log('changinggg');
    const tabHeightFromTop = document.getElementById('idForScroll2')?.offsetTop;
    const tabH = document.body.clientHeight - tabHeightFromTop;
    setTabHeight(tabH - 50);
  });

  const handleTabHeight = () => {
    const tabHeightFromTop = document.getElementById('idForScroll2')?.offsetTop;
    const tabH = document.body.clientHeight - tabHeightFromTop;
    if (document.body.clientWidth < 575) {
      setTabHeight(tabH - 50);
      setIsTabScrollable(true);
      console.log('tabscrolling');
    } else {
      // console.log('233');
      setTabHeight(tabH - 50);
    }
  };

  useEffect(() => {
    if (!courseId) history.push('/');
    else {
      const payload = {
        client_user_id: clientUserId,
        course_id: courseId,
        client_id: clientId,
      };

      get(payload, '/getCourseDetailsStudent').then((res) => {
        const result = apiValidation(res);
        setCourse(result);
        const newsectionArray = result.section_array;
        newsectionArray.forEach((ele) => {
          let totTime = 0;
          let finTime = 0;
          ele.content_array.forEach((item) => {
            if (!item.finished_time) item.finished_time = 0;
            if (!item.total_time) item.total_time = 0;
            totTime += +item.total_time;
            finTime += +item.finished_time;
          });
          ele.finishedPercentage = !isNaN((finTime * 100) / totTime)
            ? (finTime * 100) / totTime
            : 0;
        });
        console.log(result);
        setSectionArray(newsectionArray);
        if (result.course_preview_vedio) {
          const vidsource = {
            type: 'video',
            sources: [
              {
                src: result.course_preview_vedio,
              },
            ],
          };
          if (!courseDocumentToOpen && !courseNowPlayingVideo) {
            setSource(result.course_preview_vedio);
          }
        }
        const content = [...contentArray];
        result.section_array.forEach((elem) => {
          content.push(...elem.content_array);
        });
        setContentArray(content);
        console.log(content, 'finalContentArray');
      });
    }
  }, [courseId, clientUserId, history]);

  useEffect(() => {
    get({ course_id: courseId }, '/getReviewsOfCourse').then((resp) => {
      const reviewsFetched = apiValidation(resp);
      console.log(reviewsFetched, 'newReviewssss');
      let userComment = [];
      if (reviewsFetched.date_wise.filter((ele) => ele.client_user_id === clientUserId).length) {
        setUserHasCommented(true);
        userComment = reviewsFetched.date_wise.filter((ele) => ele.client_user_id === clientUserId);
        userComment[0].isUserComment = true;
        setAddedReview(userComment[0].review_text);
        setAddedRating(userComment[0].rating);
      }
      const otherComments = reviewsFetched.date_wise.filter(
        (ele) => ele.client_user_id !== clientUserId,
      );
      const finalReviewArray = [...userComment, ...otherComments];
      setReviews(finalReviewArray);
      console.log(userComment, 'userrrrr');
    });
  }, [courseId, clientUserId]);

  useEffect(() => {
    const newsectionArray = [...sectionArray];
    newsectionArray.forEach((ele) => {
      let totTime = 0;
      let finTime = 0;
      ele.content_array.forEach((item) => {
        if (!item.finished_time) item.finished_time = 0;
        if (!item.total_time) item.total_time = 0;
        totTime += +item.total_time;
        finTime += +item.finished_time;
      });
      ele.finishedPercentage = isNaN((finTime * 100) / totTime) ? 0 : (finTime * 100) / totTime;
    });
    setSectionArray(newsectionArray);
  }, [contentArray]);

  const renderReviews = () => {
    get({ course_id: courseId }, '/getReviewsOfCourse').then((resp) => {
      const reviewsFetched = apiValidation(resp);
      console.log(reviewsFetched, 'newReviewssss');
      if (reviewsFetched.date_wise.filter((ele) => ele.client_user_id === clientUserId).length) {
        setUserHasCommented(true);
        const userComment = reviewsFetched.date_wise.filter(
          (ele) => ele.client_user_id === clientUserId,
        );
        userComment[0].isUserComment = true;
        setAddedReview(userComment[0].review_text);
        setAddedRating(userComment[0].rating);

        const otherComments = reviewsFetched.date_wise.filter(
          (ele) => ele.client_user_id !== clientUserId,
        );
        const finalReviewArray = [...userComment, ...otherComments];
        setReviews(finalReviewArray);
        console.log(userComment, 'userrrrr');
      }
    });
  };

  const openImage = () => {
    setImgLink(documentToOpen.file_link);
    handleImageOpen();
  };

  const openDocument = () => {
    if (documentToOpen.file_type === '.pdf') {
      const payload = {
        section_has_file_id: documentToOpen.section_has_file_id,
        client_user_id: clientUserId,
        total_time: documentToOpen.total_time,
        finished_time: nowPlayingVideoRef.current.plyr.duration || nowPlayingVideo.duration,
      };
      post(payload, '/updateCourseContentViewStatus').then((resp) => {
        console.log(resp);
      });
      history.push({
        pathname: '/fileviewer',
        state: { filePath: documentToOpen.file_link },
      });
    } else if (documentToOpen.file_type === 'image') {
      const payload = {
        section_has_file_id: documentToOpen.section_has_file_id,
        client_user_id: clientUserId,
        finished_time: documentToOpen.total_time,
        total_time: documentToOpen.total_time,
      };
      post(payload, '/updateCourseContentViewStatus').then((resp) => {
        console.log(resp);
      });
      openImage();
      const newContentArray = contentArray.map((elem) => {
        if (elem.id === documentToOpen.id) {
          elem.finished_time = elem.total_time;
        }
        return elem;
      });
      setContentArray(newContentArray);
    }
  };

  const displayContent = (elem, type) => {
    // e.content_array.forEach((ele) => (ele.isPlayingNow = false));
    // elem.isPlayingNow = true;
    if (type === 'file') {
      // if (elem.file_type === 'video') {
      //   setVideo(true);
      //   const newSource = JSON.parse(JSON.stringify(source));
      //   newSource.sources = [{ src: elem.file_link }];
      //   setSource(newSource);
      // }
      console.log(elem);
      if (elem.file_type === 'gallery' || elem.file_type === 'image') {
        setSource(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setNowPlayingVideo(false);
        setDocumentOpener(true);
        setDocumentToOpen(elem);
        setCourseDocumentToOpenToStore(elem);
        setCourseNowPlayingVideoToStore(null);
      } else if (elem.file_type === '.pdf') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setNowPlayingVideo(false);
        setSource(false);
        setDocumentOpener(true);
        setDocumentToOpen(elem);
        setCourseDocumentToOpenToStore(elem);
        setCourseNowPlayingVideoToStore(null);
      } else if (elem.file_type === 'video' && elem.isYoutube) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setDocumentToOpen({});
        setDocumentOpener(false);
        setSource(false);
        if (navigator.userAgent.includes('VivoBrowser')) {
          console.log('browserIncompatible');
          setIsBrowserCompatible(false);
          return;
        }
        const playingVid = {
          src: elem.file_link,
          provider: 'youtube',
          id: elem.id,
          name: elem.name,
          duration: elem.total_time,
          finishedTime: elem.finished_time || 0,
          sectionFileId: elem.section_has_file_id,
        };
        setNowPlayingVideo(playingVid);
        setCourseDocumentToOpenToStore(null);
        setCourseNowPlayingVideoToStore(playingVid);
      } else if (elem.file_type === 'video' && !elem.isYoutube) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setDocumentOpener(false);
        setSource(false);
        console.log(elem, 'videoooooele');
        console.log(navigator.userAgent);
        setDocumentToOpen({});
        if (navigator.userAgent.includes('VivoBrowser')) {
          console.log('browserIncompatible');
          setIsBrowserCompatible(false);
          return;
        }
        // startVidTimer();
        const playingVid = {
          src: elem.file_link,
          id: elem.id,
          name: elem.name,
          finishedTime: elem.finished_time || 0,
          duration: elem.total_time,
          sectionFileId: elem.section_has_file_id,
        };
        setNowPlayingVideo(playingVid);
        setCourseDocumentToOpenToStore(null);
        setCourseNowPlayingVideoToStore(playingVid);
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
            title: 'Welcome back',
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
      if (document.body.clientWidth < 575) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      post(payload, '/addCourseReview').then((res) => {
        console.log(res);
        if (userHasCommented) {
          const userReview = reviews.filter((ele) => ele.client_user_id === clientUserId);
          userReview[0].review_text = addedReview;
          userReview[0].rating = addedRating;
          userReview[0].isUserComment = true;
          const otherReviews = reviews.filter((ele) => ele.client_user_id !== clientUserId);
          const finalReviewArray = [...userReview, ...otherReviews];
          setReviews(finalReviewArray);
          setUserHasCommented(true);
        } else {
          renderReviews();
          setUserHasCommented(true);
        }
        // alert('review added');
      });
      setIsReviewing(false);
      setTimeout(() => {
        handleTabHeight();
      }, 600);
    }, 300);
  };

  const playVideo = () => {
    vidRef.current.play();
  };

  const formatDurationFromSeconds = (duration) => {
    if (!duration) return null;
    let returnValue;
    if (+duration < 3600) {
      returnValue = new Date(+duration * 1000).toISOString().substr(14, 5);
    } else {
      returnValue = new Date(+duration * 1000).toISOString().substr(11, 8);
    }

    return returnValue;
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

  // const controlPreview = () => {
  //   if (vidRef && vidRef.current) {
  //     if (videoIsPlaying) {
  //       vidRef.current.pause();
  //       console.log('kia');
  //     }
  //     if (!videoIsPlaying) {
  //       console.log('kia');
  //       vidRef.current.play();
  //     }
  //   }
  // };

  const renderVideoPlayer = useMemo(() => {
    return (
      <div className='mx-auto Courses__lecturevideoplayer'>
        <PlyrComponent
          ref={nowPlayingVideoRef}
          source={{
            type: 'video',
            sources: [nowPlayingVideo],
          }}
          options={{ autoplay: false }}
        />
      </div>
    );
  }, [nowPlayingVideo]);

  useEffect(() => {
    if (nowPlayingVideo) {
      // nowPlayingVideoRef.current.plyr.once('play', () => {
      //   nowPlayingVideoRef.current.plyr.currentTime = nowPlayingVideo.finishedTime;
      //   console.log('seeking....');
      // });
    }
  }, [nowPlayingVideo]);

  const editReviewHandler = useCallback(() => {
    setUserHasCommented(false);
    setIsReviewing(true);
  }, []);
  const starArr = new Array(+addedRating).fill(Math.random());
  const borderStarArr = new Array(5 - +addedRating).fill(Math.random());

  const calculateIndividualItemPercentage = (elem) => {
    if (elem.content_type === 'test') elem.total_time = 0;

    const percentage = (+elem.finished_time * 100) / +elem.total_time;
    // if (isNaN(percentage)) percentage = 1800;
    return !isNaN(percentage) ? percentage : 0;
  };

  return (
    <div className={`${isReviewing ? null : 'unscrollableOnMobile'}`}>
      <div className='desktopContainerMyCource'>
        <div className='fgrow2'>
          <div className='backButtonForCoursesPage'> </div>
          <PageHeader
            width={isDesktop ? '66.66%' : '100%'}
            iconColor='white'
            transparent
            title=''
          />
          <button className='shareButtonForCourse' type='button' onClick={() => shareCourse()}>
            <ShareIcon style={{ margin: '13px 16px', color: 'white' }} />
          </button>
          {nowPlayingVideo && renderVideoPlayer}
          {/* {nowPlayingVideo && (
        <div className='mx-auto Courses__lecturevideoplayer'>
          <div className='backdropOnPlayer'> </div>
          <ReactPlayer
            className='Courses__lecturevideoplayer'
            url={`https://www.youtube.com/watch?v=${nowPlayingVideo.src}`}
            controls
          />
        </div>
      )} */}
          {source && (
            <>
              <div className='mx-auto Courses__mycoursesvideoplayer'>
                {/* eslint-disable */}
                <video
                  ref={vidRef}
                  // onClick={controlPreview}
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
          ) : null}
          {!source && !nowPlayingVideo && !documentOpener && (
            <div className='mx-auto Courses__mycoursethumbnail mb-2'>
              <img
                src={course.course_display_image ? course.course_display_image : image}
                alt='course'
                className='mx-auto img-fluid courseThumbnailImg'
              />
            </div>
          )}
          {!source && !nowPlayingVideo && documentOpener && (
            <div className='mx-auto Courses__docOpener mb-2'>
              <div className='TextOnImage'>
                <p>{documentToOpen.name}</p>
                <button className='openDocumentBtn' onClick={openDocument}>
                  Open file
                </button>
              </div>
              <img
                src={course.course_display_image ? course.course_display_image : image}
                alt='course'
                className='mx-auto courseDocumentOpenerImg'
              />
            </div>
          )}
          {isDesktop ? (
            <>
              <p className='Courses__courseCardHeading mx-auto mb-0 mt-3 w-90'>
                {course.course_title}
              </p>
              <p
                style={{ fontFamily: 'Montserrat-Regular' }}
                className='Courses__courseCardHeading mx-auto mb-0 mt-3 w-90'
              >
                {nowPlayingVideo ? 'NOW PLAYING: ' : documentToOpen ? 'NOW SHOWING: ' : ''}
                {nowPlayingVideo?.name || documentToOpen?.name || ''}
              </p>
            </>
          ) : null}
        </div>
        {Object.keys(course).length > 0 && (
          <div className='Courses__mycourseContainer fgrow1'>
            {!isDesktop ? (
              <p
                className={`Courses__courseCardHeading mx-auto mb-0 mt-${source ? '0' : '4'} w-90`}
              >
                {nowPlayingVideo?.name || documentToOpen?.name || course.course_title}
              </p>
            ) : null}
            <Tabs
              defaultActiveKey='Content'
              className='Courses__Tabs'
              justify
              style={{ marginTop: '1rem', width: '100%' }}
            >
              <Tab
                className={`scrollableTabsForCourses ${
                  isTabScrollable ? 'scrollable' : 'unscrollable'
                }`}
                id='idForScroll2'
                onScroll={handleTabHeight}
                onClick={() => setCurrentTab('content')}
                eventKey='Content'
                title='Content'
                style={{
                  height: `${tabHeight}px`,
                  margin: 'auto 15px',
                }}
              >
                {renderContentHistogram()}
                <hr className='' />

                {sectionArray.map((e, secIndex) => {
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
                            <ProgressBar
                              width={`${e.finishedPercentage}%`}
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
                            />
                            <p className='verySmallText'>{e.finishedPercentage.toFixed(0)}%</p>
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
                                  <div style={{ width: '90%' }} className='d-flex align-items-top'>
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
                                      <div>
                                        <small className='verySmallText mx-2'>
                                          {elem.file_type
                                            ? elem.file_type.toUpperCase()
                                            : elem.content_type.toUpperCase()}
                                        </small>
                                        {elem.content_type !== 'test' ? (
                                          <small className='verySmallText'>
                                            {formatDurationFromSeconds(elem.total_time)}
                                          </small>
                                        ) : null}
                                      </div>
                                      {/* <div
                                      style={{ width: '90%' }}
                                      className='d-flex mx-auto align-items-center'
                                    > */}
                                      {elem.id === nowPlayingVideo?.id ||
                                      elem.id === documentToOpen?.id ? (
                                        <p className='nowPlayingText mx-2'>
                                          Now{' '}
                                          {nowPlayingVideo
                                            ? 'Playing'
                                            : documentToOpen
                                            ? 'Showing'
                                            : null}
                                        </p>
                                      ) : (
                                        <div className='d-flex align-items-center'>
                                          {elem.content_type !== 'test' ? (
                                            <>
                                              <ProgressBar
                                                width={`${calculateIndividualItemPercentage(
                                                  elem,
                                                )}%`}
                                                height='2px'
                                                borderRadius='100px'
                                                customStyle={{
                                                  backgroundColor: '#4154cf',
                                                  borderRadius: '100px',
                                                  height: '2px',
                                                }}
                                                myProgressCustomStyle={{
                                                  width: '91%',
                                                  height: '2px',
                                                  margin: '5px 8px',
                                                  backgroundColor: 'rgba(0,0,0,0.42)',
                                                }}
                                              />
                                              <span className='verySmallText mx-2'>
                                                {calculateIndividualItemPercentage(elem).toFixed(0)}
                                                %
                                              </span>
                                            </>
                                          ) : null}
                                        </div>
                                      )}
                                    </div>
                                    {/* {elem.id === nowPlayingVideo?.id ||
                                  elem.id === documentToOpen?.id ? (
                                    <p>now playing</p>
                                    ) : null} */}
                                  </div>
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
                onScroll={handleTabHeight}
                onClick={() => setCurrentTab('details')}
                id='detailTab'
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
              <Tab
                style={{
                  height: `${tabHeight}px`,
                  margin: 'auto 15px',
                }}
                className={`scrollableTabsForCourses ${isTabScrollable ? 'scrollable' : null}`}
                id='ReviewTab'
                // onScroll={handleTabHeight}
                onClick={() => setCurrentTab('reviews')}
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
              </Tab>
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
          <Modal.Title>
            {documentToOpen ? documentToOpen.name?.slice(0, documentToOpen.name?.length - 4) : ''}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className='mx-auto'>
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
  courseNowPlayingVideo: getCourseNowPlayingVideo(state),
  courseDocumentToOpen: getCourseDocumentToOpen(state),
});

const mapDispatchToProps = (dispatch) => {
  return {
    setTestIdToStore: (payload) => {
      dispatch(testsActions.setTestIdToStore(payload));
    },
    setCourseNowPlayingVideoToStore: (payload) => {
      dispatch(courseActions.setCourseNowPlayingVideoToStore(payload));
    },
    setCourseDocumentToOpenToStore: (payload) => {
      dispatch(courseActions.setCourseDocumentToOpenToStore(payload));
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
  courseNowPlayingVideo: PropTypes.instanceOf(Object).isRequired,
  courseDocumentToOpen: PropTypes.instanceOf(Object).isRequired,
};
