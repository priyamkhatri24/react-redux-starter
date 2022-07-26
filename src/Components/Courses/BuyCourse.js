import React, { useEffect, useState, useRef, useMemo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import cx from 'classnames';
import format from 'date-fns/format';
import fromUnixTime from 'date-fns/fromUnixTime';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Toast from 'react-bootstrap/Toast';
import Card from 'react-bootstrap/Card';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Accordion from 'react-bootstrap/Accordion';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Swal from 'sweetalert2';
import PlyrComponent from 'plyr-react';
import 'plyr-react/dist/plyr.css';
import StarIcon from '@material-ui/icons/StarRounded';
import LockIcon from '@material-ui/icons/Lock';
import VideoIcon from '@material-ui/icons/VideoLibrary';
import Play from '@material-ui/icons/PlayArrowRounded';
import LiveIcon from '@material-ui/icons/LiveTv';
import DocIcon from '@material-ui/icons/Description';
import TestIcon from '@material-ui/icons/LiveHelp';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import StarBorderIcon from '@material-ui/icons/StarBorderRounded';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ShareIcon from '@material-ui/icons/Share';
// import freeIcon from '../../assets/images/Courses/freeIcon.svg';
import { apiValidation, get, post, displayRazorpay, shareThis } from '../../Utilities';
import { PageHeader } from '../Common';
import Cashfree from '../Common/Cashfree/Cashfree';
import sampleReviews from './courseReviewsSample';
import ViewCoursesList from './CoursesListComponent';
import Reviews from './CourseReviews';
import './Courses.scss';
import {
  getClientId,
  getClientUserId,
  getRoleArray,
} from '../../redux/reducers/clientUserId.reducer';
import { getCurrentBranding } from '../../redux/reducers/branding.reducer';
import {
  getCurrentDashboardData,
  getCurrentLocationData,
} from '../../redux/reducers/dashboard.reducer';
import YCIcon from '../../assets/images/ycIcon.png';
import checkmark from '../../assets/images/order/icons8-checked.svg';
import caution from '../../assets/images/order/icons8-medium-risk-50.png';
import { dashboardActions } from '../../redux/actions/dashboard.action';
import { brandingActions } from '../../redux/actions/branding.action';

const BuyCourse = (props) => {
  const {
    history: { location, push },
    match,
    clientId,
    clientUserId,
    dashboardData,
    locationData,
    currentbranding: {
      branding: {
        client_color: clientColor,
        client_name: clientName,
        client_logo: clientLogo,
        client_address: clientAddress,
        client_contact: clientContact,
        currency_code: currencyCode,
        currency_symbol: currencySymbol,
      },
    },
    setRedirectPathToStore,
    setCurrentComponentToStore,
    roleArray,
  } = props;
  const [course, setCourse] = useState({});
  const [paymentGateway, setPaymentGateway] = useState(null);
  const [courseVideo, setCourseVideo] = useState(null);
  const [source, setSource] = useState(null);
  const [courseImage, setCourseImage] = useState(null);
  const [coursePrice, setCoursePrice] = useState(0);
  const [whiteStarArray, setWhiteStarArray] = useState([]);
  const [starArray, setStarArray] = useState([]);
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [showFeeModal, setShowFeeModal] = useState(false);
  const [coupon, setCoupon] = useState('');
  const [couponId, setCouponId] = useState('');
  const [couponState, setCouponState] = useState('removed');
  const [couponPrice, setCouponPrice] = useState(0);
  const [couponMessage, setCouponMessage] = useState('');
  const [order, setOrder] = useState({});
  const [showToast, setShowToast] = useState(false);
  const [paymentSplits, setPaymentSplits] = useState(null);
  const [appId, setAppid] = useState('');
  const [ntfurl, setntfurl] = useState(null);
  const [newOrderId, setNewOrderId] = useState(null);
  const [courseOrderId, setCourseOrderId] = useState(null);
  const [contentArray, setContentArray] = useState([]);
  const [tabHeight, setTabHeight] = useState(500);
  const [isTabScrollable, setIsTabScrollable] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [previewText, setPreviewText] = useState(true);
  const [videoIsPlaying, setVideoIsPlaying] = useState(true);
  const [reference, setReference] = useState(null);
  const [nowPlayingVideo, setNowPlayingVideo] = useState(null);
  const [documentToOpen, setDocumentToOpen] = useState(null);
  const [documentOpener, setDocumentOpener] = useState(false);
  const [isBrowserCompatible, setIsBrowserCompatible] = useState(true);
  const nowPlayingVideoRef = useRef(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [finalCurrencyCode, setFinalCurrencyCode] = useState(currencyCode);
  const [currencyCodes, setCurrencyCodes] = useState([]);

  const vidRef2 = useRef(null);
  const mainCRef = useRef(null);
  // const cfRef = useRef(null);
  const getCfRef = (cfref) => {
    setReference(cfref);
    console.log(cfref);
  };

  useEffect(() => {
    get(null, '/getAllCurrencyCodes').then((res) => {
      const result = apiValidation(res);
      result.forEach((ele) => (ele.currencySymbol = ele.currency_symbol));
      setCurrencyCodes(result);
    });
  }, []);

  const statusClass = cx({
    Fees__orderStatus: true,
    Fees__orderGreen:
      order.status === 'marked' || order.status === 'waived' || order.status === 'paid',
    Fees__orderRed: order.status === 'pending' || order.status === 'due',
  });

  useEffect(() => {
    document.addEventListener('scroll', function (e) {
      const tab = document.getElementById('idForScroll');
      if (window.innerHeight + window.scrollY >= document.body.clientHeight - 50) {
        // setscrolledToBottom(true);

        const tabHeightFromTop = tab?.offsetTop;
        const tabH = document.body.clientHeight - tabHeightFromTop;
        setTabHeight(tabH - 50);
        // console.log(tabH, 'scrolled');
        setIsTabScrollable(true);
        if (vidRef2 && vidRef2.current) {
          vidRef2.current.pause();
        }
      } else {
        setIsTabScrollable(false);
        // console.log('scrolling');
      }
    });
  }, []);

  useEffect(() => {
    setRedirectPathToStore(null);
    setCurrentComponentToStore('Welcome');
  }, [setCurrentComponentToStore, setRedirectPathToStore]);

  useEffect(() => {
    const cid = !isNaN(+match.params.clientId)
      ? match.params.clientId
      : +window.atob(match.params.clientId);

    const coid = !isNaN(+match.params.courseId)
      ? match.params.courseId
      : +window.atob(match.params.courseId);

    const payload = {
      client_id: cid,
      course_id: coid,
    };

    get(payload, '/getCourseDetailsStudent').then((res) => {
      console.log(res, 'course details');
      const result = apiValidation(res);

      setPaymentGateway(result.payment_gateway);
      setReviews(result.reviews);
      // regioanl courses check
      // checkCourseRegionalityAndUpdateCourseObject();////////////////////////////////////////////////
      if (result.is_regional) {
        const countryFilteredPrices = result.regional_prices.filter(
          (ele) => ele.country_name === locationData.country,
        );
        const checkForAllStates = countryFilteredPrices.find((ele) => ele.state_name === '');
        const checkForCurrentState = countryFilteredPrices.find(
          (ele) => ele.state_name === locationData.state,
        );
        if (checkForAllStates) {
          result.course_price = checkForAllStates.region_course_price;
          result.discount_price = checkForAllStates.region_discount_price;
          result.inducedCurrencySymbol = currencyCodes.find(
            (ele) => ele.currency_code === checkForAllStates.currency_code,
          )?.currencySymbol;
          setFinalCurrencyCode(checkForAllStates.currency_code);
        }
        if (checkForCurrentState) {
          result.course_price = checkForCurrentState.region_course_price;
          result.discount_price = checkForCurrentState.region_discount_price;
          result.inducedCurrencySymbol = currencyCodes.find(
            (ele) => ele.currency_code === checkForCurrentState.currency_code,
          )?.currencySymbol;
          setFinalCurrencyCode(checkForCurrentState.currency_code);
        }
        console.log(countryFilteredPrices, 'countryFilteredPrices');
      }
      // //////////////////////////////////////////////////////////////////////////////////////////////
      setCourse(result);
      setCoursePrice(result.discount_price);
      setCourseImage(result.course_display_image);
      if (result.course_preview_vedio) {
        const src = {
          type: 'video',
          sources: [
            {
              src: result.course_preview_vedio,
            },
          ],
        };

        setCourseVideo(src);
        setSource(result.course_preview_vedio);
      }

      const numberOfStars = Math.round(parseInt(result.course_rating, 10));
      setStarArray(
        [...Array(numberOfStars)].map((e, i) => (
          /* eslint-disable-next-line */
          <span role='img' aria-label='emoji' key={i}>
            <StarIcon className='Courses__emoji' />
          </span>
        )),
      );

      const normalStars = 5 - numberOfStars;

      setWhiteStarArray(
        [...Array(normalStars)].map((e, i) => (
          /* eslint-disable-next-line */
          <span role='img' aria-label='emoji' key={i}>
            <StarBorderIcon className='Courses__emoji' />
          </span>
        )),
      );
      const content = [...contentArray];
      result.section_array.forEach((elem) => {
        content.push(...elem.content_array);
      });
      setContentArray(content);
      console.log(content, 'finalContentArray');
    });
  }, [match, currencyCodes, location]);

  const subscribeOrBuy = () => {
    if (roleArray.includes(3) || roleArray.includes(4)) {
      push('/');
    }
    if (+coursePrice === 0) {
      const payload = {
        client_user_id: clientUserId,
        course_id: !isNaN(+match.params.courseId)
          ? match.params.courseId
          : +window.atob(match.params.courseId),
      };
      post(payload, '/subscribeStudentToCourse').then((res) => {
        if (res.success === 1) {
          Swal.fire({
            icon: 'success',
            title: 'Subscribed!',
            text: `You have successfully subscribed to ${course.course_title}.`,
          });
          push('/');
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops!',
            text: `Unable to subscribe to this course`,
          });
        }
      });
    } else {
      openCouponModal();
    }
  };

  const startCashfreePayment = () => {
    if (paymentGateway.includes('cashfree') && +coursePrice > 0) {
      const cashfreePayload = {
        client_user_id: clientUserId,
        client_id: clientId,
        course_id: !isNaN(+match.params.courseId)
          ? match.params.courseId
          : +window.atob(match.params.courseId),
        orderAmount: coursePrice,
        orderCurrency: currencyCode,
        coupon_id: couponId,
        type: process.env.NODE_ENV === 'development' ? 'Development' : 'Production',
      };
      post(cashfreePayload, '/genrateTokenForCourseOrder').then((res) => {
        const result = apiValidation(res);
        console.log(result, 'resss');
        setPaymentSplits(result.paymentSplits);
        setntfurl(result.notifyUrl);
        setNewOrderId(result.order_id);
        setCourseOrderId(result.course_order_id);
        // setCfSecret(result.secret);
        // setAppId(result.appId);
        setShowCouponModal(true);
        setAppid(result.appId);
        // console.log(cfRef);
        setTimeout(() => {
          reference.click();
        }, 1500);
      });
    }
  };

  const openCouponModal = () => {
    if (paymentGateway === 'razorpay') {
      setShowCouponModal(true);
    } else {
      setShowCouponModal(true);
    }
  };
  const closeCouponModal = () => setShowCouponModal(false);

  const openFeeModal = () => setShowFeeModal(true);

  const startCashfree = () => {
    console.log('paid by cf');
  };

  const closeFeeModal = () => {
    setShowFeeModal(false);
    if (order.status === 'marked' || order.status === 'waived' || order.status === 'paid') {
      push({
        pathname: '/courses/mycourse',
        state: {
          id: !isNaN(+match.params.courseId)
            ? match.params.courseId
            : +window.atob(match.params.courseId),
          clientUserId,
        },
      });
    }
  };

  const applyCoupon = () => {
    const payload = {
      client_user_id: clientUserId,
      course_id: !isNaN(+match.params.courseId)
        ? match.params.courseId
        : +window.atob(match.params.courseId),
      client_id: clientId,
      coupon_code: coupon,
    };
    console.log(payload, 'checkCouponCodePayload');
    get(payload, '/checkCouponCode').then((res) => {
      const result = apiValidation(res);
      if (result.coupon_status === 'true') {
        let newPrice = coursePrice - result.price;
        if (newPrice <= 0) newPrice = 0;
        setCoursePrice(newPrice);
        setCouponPrice(result.price);
        setCouponState('applied');
        setCouponId(result.coupon_id);
        setCouponMessage(result.message);
      } else {
        setCouponMessage(result.message);
        setCouponId(result.coupon_id);
      }
    });
  };

  const removeCoupon = () => {
    const newPrice = coursePrice + +couponPrice;
    setCoursePrice(newPrice);
    setCouponId('');
    setCouponMessage('');
    setCouponPrice(0);
    setCouponState('removed');
  };

  const payToRazorBaba = () => {
    const orderPayload = {
      client_user_id: clientUserId,
      course_id: !isNaN(+match.params.courseId)
        ? match.params.courseId
        : +window.atob(match.params.courseId),
      amount: coursePrice,
      coupon_id: couponId,
    };

    const razorPayload = {
      status: process.env.NODE_ENV === 'development' ? 'Development' : 'Production',
      client_id: clientId,
    };

    const getCredentials = get(razorPayload, '/getRazorPayCredentials');
    const postRazorCourseId = post(orderPayload, '/createRazorPayCourseOrder');

    Promise.all([getCredentials, postRazorCourseId]).then((res) => {
      console.log(res);
      const credentials = apiValidation(res[0]);
      const orderDetails = apiValidation(res[1]);
      console.log(finalCurrencyCode);
      displayRazorpay(
        orderDetails.order_id,
        coursePrice * 100,
        finalCurrencyCode,
        clientLogo,
        clientColor,
        clientName,
        clientAddress,
        clientContact,
        razorSuccess,
        orderDetails.course_order_id,
        clientId,
        credentials.key_id,
        credentials.fee_account_id,
      ).then((resp) => console.log(resp, 'razor'));
    });
  };

  const razorSuccess = (payload) => {
    const verifyPayload = {
      order_id: payload.order_id,
      course_order_id: payload.user_fee_id,
    };

    get(verifyPayload, '/fetchOrderByIDForCourse').then((res) => {
      console.log(res);
      // alert('payment successful');
      const result = apiValidation(res);
      setOrder(result);
      openFeeModal();
    });
  };

  const basSubscribe = () => {
    const payload = {
      client_user_id: clientUserId,
      course_id: !isNaN(+match.params.courseId)
        ? match.params.courseId
        : +window.atob(match.params.courseId),
      coupon_id: couponId,
    };
    post(payload, '/subscribeStudentToCourse').then((res) => {
      if (res.success === 1) {
        Swal.fire({
          icon: 'success',
          title: 'Subscribed!',
          text: `You have successfully subscribed to ${course.course_title}.`,
        });
        push('/');
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops!',
          text: `Unable to subscribe to this course`,
        });
      }
    });
  };

  const goToLogin = () => {
    setRedirectPathToStore(window.location.pathname);
    setCurrentComponentToStore('PhoneNo');
    push('/preload');
  };

  const shareCourse = () => {
    // eslint-disable-next-line
    const url = window.location.href;
    console.log(course.template);
    const hasShared = shareThis(url, course.template);
    if (hasShared === 'clipboard') setShowToast(true);
  };

  const initPayment = () => {
    if (+coursePrice > 0) {
      payToRazorBaba();
    } else {
      basSubscribe();
    }
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
      const freeContentArray = course.course_content.filter(
        (ele) =>
          (ele.url =
            '"https://s3.ap-south-1.amazonaws.com/question-images-ingenium/1632724891457.png"'),
      );
      if (freeContentArray.length && freeContentArray[0].count > 0) {
        hist['Free Content'] = freeContentArray[0].count;
      }
    });
    return hist;
  };

  const renderContentHistogram = () => {
    const renderedHist = getHistogram(contentArray);
    return (
      <div className='scrollableContentOfCourses mt-3'>
        {Object.entries(renderedHist).map(([key, val]) => {
          let icon;
          if (key === 'Videos') {
            icon = <VideoIcon style={{ color: '#9f16cf', marginBottom: '9px' }} />;
          } else if (key === 'Documents') {
            icon = <DocIcon style={{ color: 'green', marginBottom: '9px' }} />;
          } else if (key === 'Live classes') {
            icon = <LiveIcon style={{ color: '#faa300', marginBottom: '9px' }} />;
          } else if (key === 'Tests') {
            icon = <TestIcon style={{ color: '#530de1', marginBottom: '9px' }} />;
          } else if (key === 'Free Content') {
            icon = (
              <img
                className='freeIcon'
                src='https://s3.ap-south-1.amazonaws.com/question-images-ingenium/1632724891457.png'
                alt='free'
              />
            );
          }
          return (
            <div className='scrollableContentOfCourses_item'>
              {icon}
              <p style={{ fontSize: '10px', fontFamily: 'Montserrat-SemiBold' }}>
                {key === 'Free Content' || val > 1 ? key : key.slice(0, key.length - 1)}
              </p>
              <h6 style={{ color: 'rgba(0,0,0,0.54)' }}>{val}</h6>
            </div>
          );
        })}
      </div>
    );
  };

  const goToCourse = (courseId) => {
    // console.log('gotocourse', history);
    // const { push } = history;
    setCourse({});
    setContentArray([]);
    setCourseImage(null);
    setCourseVideo(null);
    setIsTabScrollable(false);
    setSource(null);
    push(`/courses/buyCourse/${window.btoa(clientId)}/${window.btoa(courseId)}`);
  };
  const playVideo = () => {
    vidRef2.current.play();
  };

  const pauseVideo = () => {
    vidRef2.current.pause();
  };

  useEffect(() => {
    if (vidRef2 && vidRef2.current) {
      vidRef2.current.addEventListener('pause', (event) => {
        setVideoIsPlaying(true);
        setPreviewText(true);
        console.log('paused');
      });
      vidRef2.current.addEventListener('play', (event) => {
        setVideoIsPlaying(false);
        setPreviewText(false);
        console.log('playing');
      });
    }
  });

  const displayContent = (elem) => {
    if (elem.is_free === 'false') return;
    const type = elem.content_type;
    console.log(elem);
    if (type === 'file') {
      if (elem.file_type === 'gallery' || elem.file_type === 'image') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setSource(false);
        setNowPlayingVideo(false);
        setDocumentOpener(true);
        setDocumentToOpen(elem);
      } else if (elem.file_type === '.pdf') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setNowPlayingVideo(false);
        setSource(false);
        setDocumentOpener(true);
        setDocumentToOpen(elem);
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
      } else if (elem.file_type === 'video' && !elem.isYoutube) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setDocumentOpener(false);
        setSource(false);
        setDocumentToOpen({});
        if (navigator.userAgent.includes('VivoBrowser')) {
          console.log('browserIncompatible');
          setIsBrowserCompatible(false);
          return;
        }
        const playingVid = {
          src: elem.file_link_array[0],
          linkArray: elem.file_link_array,
          id: elem.id,
          name: elem.name,
          finishedTime: elem.finished_time || 0,
          duration: elem.total_time,
          sectionFileId: elem.section_has_file_id,
        };
        setNowPlayingVideo(playingVid);
      } else {
        push({
          pathname: '/otherfileviewer',
          state: { filePath: elem.file_link },
        });
      }
    } else if (type === 'test') {
      Swal.fire({
        title: 'Good day!',
        text: 'Free test content is coming soon.',
        confirmButtonText: 'OK',
      });
    }
  };

  const renderVideoPlayer = useMemo(() => {
    return (
      <div className='mx-auto Courses__lecturevideoplayer'>
        <PlyrComponent
          ref={nowPlayingVideoRef}
          source={{
            type: 'video',
            sources: [nowPlayingVideo],
          }}
          options={{ autoplay: true }}
        />
      </div>
    );
  }, [nowPlayingVideo, nowPlayingVideoRef?.current]);

  const openImage = () => setShowImageModal(true);

  const handleImageClose = () => setShowImageModal(false);

  const openDocument = () => {
    if (documentToOpen.file_type === '.pdf') {
      push({
        pathname: '/fileviewer',
        state: { filePath: documentToOpen.file_link },
      });
    } else if (documentToOpen.file_type === 'image') {
      openImage();
    }
  };

  return (
    <div ref={mainCRef}>
      <div className='backButtonForCoursesPage'> </div>
      <PageHeader iconColor='white' transparent title='' />
      <button className='shareButtonForbuyCourse' type='button' onClick={() => shareCourse()}>
        <ShareIcon style={{ margin: '13px 16px', color: 'white' }} />
      </button>
      {nowPlayingVideo && renderVideoPlayer}
      {!nowPlayingVideo && documentOpener && (
        <div className='mx-auto Courses__docOpener mb-2'>
          <div className='TextOnImage'>
            <p>{documentToOpen.name}</p>
            <button type='button' className='openDocumentBtn' onClick={openDocument}>
              Open file
            </button>
          </div>
          <img
            src={course.course_display_image || clientLogo || YCIcon}
            alt='course'
            className='mx-auto courseDocumentOpenerImg'
          />
        </div>
      )}
      {!nowPlayingVideo && !documentOpener && source && (
        <>
          <div className='mx-auto Courses__videoplayer'>
            {/* eslint-disable */}
            <video
              ref={vidRef2}
              width='100%'
              style={{ borderRadius: '5px' }}
              autoplay='autoplay'
              id='vidElement2'
            >
              <source src={source} type='video/mp4' />
              <track src='' kind='subtitles' srcLang='en' label='English' />
            </video>
            {videoIsPlaying ? (
              <Play
                style={{ opacity: `${videoIsPlaying ? '1' : '0'}` }}
                onClick={playVideo}
                className='playIconCourse'
              />
            ) : (
              <Play style={{ opacity: '0' }} onClick={pauseVideo} className='playIconCourse' />
            )}
          </div>
        </>
      )}
      {!nowPlayingVideo && !documentOpener && !courseVideo && courseImage ? (
        <div className='mx-auto Courses__thumbnail'>
          <img src={courseImage} alt='course' className='mx-auto img-fluid courseThumbnailImg' />
        </div>
      ) : null}
      {!nowPlayingVideo && !documentOpener && !courseVideo && !courseImage ? (
        <div className='mx-auto Courses__thumbnail'>
          <img
            src={clientLogo ? clientLogo : YCIcon}
            alt='course'
            className='mx-auto img-fluid courseThumbnailImg'
          />
        </div>
      ) : null}
      {!nowPlayingVideo && !documentOpener && courseVideo ? (
        <p style={{ opacity: previewText ? '1' : '0' }} className='previewVideoTextClass'>
          Preview video
        </p>
      ) : (
        <p style={{ opacity: '0' }} className='previewVideoTextClass'>
          Preview
        </p>
      )}
      {Object.keys(course).length > 0 && (
        <div className='Courses__buycourseContainer' style={{ marginTop: '0px' }}>
          <div className='courseNameContainer'>
            <div>
              <p className='Courses__courseCardHeading mb-0'>{course.course_title}</p>
              <div className='d-flex align-items-center w-100 mx-auto'>
                {starArray.map((e) => {
                  return e;
                })}
                {whiteStarArray.map((e) => {
                  return e;
                })}
                <p
                  className='Scrollable__smallText mt-1 mb-0 ml-1'
                  style={{ color: 'rgba(0, 0, 0, 0.87)', fontSize: '10px' }}
                >
                  {course.course_rating}
                </p>
                <p
                  className='Scrollable__smallText mt-1 mb-0'
                  style={{ color: 'rgba(0, 0, 0, 0.87)', fontSize: '10px' }}
                >
                  ({course.total_votes})
                </p>
              </div>
              <div className='d-flex align-items-center justify-content-between'>
                <div>
                  {course.inducedCurrencySymbol ? (
                    <span className='mx-1 Courses__Price my-auto'>{`${course.inducedCurrencySymbol} ${coursePrice}`}</span>
                  ) : (
                    <span className='mx-1 Courses__Price my-auto'>{`${currencySymbol} ${coursePrice}`}</span>
                  )}
                  <span className='my-auto'>
                    {course.inducedCurrencySymbol ? (
                      <del className='verySmallText'>
                        {' '}
                        {`${course.inducedCurrencySymbol} ${course.course_price}`}
                      </del>
                    ) : (
                      <del className='verySmallText'>
                        {' '}
                        {`${currencySymbol} ${course.course_price}`}
                      </del>
                    )}
                  </span>
                </div>
                <div>
                  {course.bestseller_tag && (
                    <div
                      style={{ fontSize: '12px' }}
                      className='Scrollable__bestSeller mx-0 p-1 my-auto'
                    >
                      Bestseller
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className='mx-auto d-flex'>
            <Button
              className='mt-3 mb-2 mx-auto w-90 buyCourseBtn'
              variant='greenButtonLong'
              onClick={
                localStorage.getItem('state') &&
                JSON.parse(localStorage.getItem('state')).userProfile.token
                  ? () => subscribeOrBuy()
                  : () => goToLogin()
              }
            >
              {+coursePrice === 0 ? 'Subscribe' : 'Buy Now'}
            </Button>
          </div>
          <Tabs
            style={{ marginTop: '1rem' }}
            defaultActiveKey='Details'
            justify
            className='Courses__Tabs'
          >
            <Tab
              id='idForScroll'
              className={`scrollableTabsForCourses ${
                isTabScrollable ? 'scrollable' : 'unscrollable'
              }`}
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
              {course.course_includes.map((ele) => {
                return <p className='Courses__subHeading mb-2'>- {ele}</p>;
              })}
              <hr className='' />
              <p className='Courses__heading'>Course content</p>

              {renderContentHistogram()}

              <Button
                onClick={() => {
                  document.getElementById('contentTab').click();
                }}
                style={{
                  width: '100%',
                  color: 'white',
                  backgroundColor: 'black',
                  outline: 'none',
                  border: 'transparent',
                  fontFamily: 'Montserrat-Regular',
                  fontSize: '14px',
                }}
                className='mt-3 mb-2 mx-auto buyCourseBtn'
              >
                View all content
                <ChevronRightIcon />
              </Button>
              <hr className='' />

              {/* <Reviews displayTwo isFilterVisible={false} reviews={reviews} />
              <Button
                onClick={() => {
                  document.getElementById('ReviewTab').click();
                }}
                style={{
                  width: '100%',
                  color: 'white',
                  backgroundColor: 'black',
                  outline: 'none',
                  border: 'transparent',
                  fontFamily: 'Montserrat-Regular',
                  fontSize: '14px',
                }}
                className='mt-3 mb-2 mx-auto buyCourseBtn'
              >
                View all Reviews
                <ChevronRightIcon />
              </Button> */}
              <p className='Courses__heading mt-4'>People also viewed</p>

              <ViewCoursesList
                currencySymbol={currencySymbol}
                clientId={clientId}
                clicked={goToCourse}
              />
              <Button
                onClick={
                  localStorage.getItem('state') &&
                  JSON.parse(localStorage.getItem('state')).userProfile.token
                    ? () => push({ pathname: '/courses', state: { type: 'allCourses' } })
                    : () => goToLogin()
                }
                style={{
                  width: '100%',
                  color: 'white',
                  backgroundColor: 'black',
                  outline: 'none',
                  border: 'transparent',
                  fontFamily: 'Montserrat-Regular',
                  fontSize: '14px',
                }}
                className='mt-3 mb-2 mx-auto buyCourseBtn'
              >
                View all courses
                <ChevronRightIcon />
              </Button>
              <Button
                onClick={() => {
                  push('/');
                }}
                style={{
                  width: '100%',
                  color: 'black',
                  backgroundColor: 'transparent',
                  outline: 'none',
                  border: '1px solid black',
                  fontFamily: 'Montserrat-Regular',
                  fontSize: '14px',
                }}
                className='mt-3 mb-2 mx-auto buyCourseBtn d-flex align-items-center justify-content-center topMargin'
              >
                GO TO HOMEPAGE
                <ChevronRightIcon />
              </Button>
            </Tab>
            <Tab
              className={`scrollableTabsForCourses ${
                isTabScrollable ? 'scrollable' : 'unscrollable'
              }`}
              id='contentTab'
              eventKey='Content'
              title='Content'
              style={{
                margin: 'auto 15px',
                height: `${tabHeight}px`,
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
                              <div
                                onClick={() => displayContent(elem)}
                                style={{
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  width: '95%',
                                }}
                                className='d-flex my-2 mx-auto'
                              >
                                <div
                                  style={{ maxWidth: '90%' }}
                                  className='d-flex align-items-center'
                                >
                                  {elem.category !== 'Videos' ? (
                                    <div className='iconContainerForContents'>{icon}</div>
                                  ) : (
                                    <div className='videoContainerForContents'>{icon}</div>
                                  )}
                                  <div style={{ overflowX: 'hidden' }}>
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
                                    <p
                                      style={{ fontSize: '12px', color: '#fbfbfb' }}
                                      className='mb-0 ml-2'
                                    >
                                      {elem.category.slice(0, elem.category.length - 1)}
                                    </p>
                                  </div>
                                </div>
                                {elem.is_free === 'true' ? (
                                  <img
                                    className='freeIcon'
                                    src='https://s3.ap-south-1.amazonaws.com/question-images-ingenium/1632724891457.png'
                                    alt='free'
                                  />
                                ) : (
                                  <LockIcon style={{ color: 'gray' }} />
                                )}
                              </div>
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
              style={{
                margin: 'auto 15px',
                height: `${tabHeight}px`,
              }}
              className={`scrollableTabsForCourses ${
                isTabScrollable ? 'scrollable' : 'unscrollable'
              }`}
              id='ReviewTab'
              title='Reviews'
              eventKey='Review'
            >
              <div style={{ marginTop: '1.2rem' }}>
                <Reviews displayTwo={false} isFilterVisible reviews={reviews} />
              </div>
            </Tab>
          </Tabs>

          {/* <hr className='' /> */}
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

      <Modal show={showCouponModal} centered onHide={closeCouponModal}>
        <Modal.Header closeButton>
          <span className='Scrollable__courseCardHeading my-auto' style={{ fontSize: '14px' }}>
            Payment Summary
          </span>
        </Modal.Header>
        <Modal.Body>
          <Card style={{ borderRadius: '10px' }}>
            <Row className='p-2 m-0'>
              <span className='my-auto Courses__couponHeading'>{course.course_title}</span>
              <span
                className='ml-auto my-auto'
                style={{
                  color: 'var(--primary-blue)',
                  fontSize: '12px',
                  fontFamily: 'MontSerrat-Medium',
                }}
              >
                {course.inducedCurrencySymbol
                  ? `${course.inducedCurrencySymbol} ${coursePrice}`
                  : `${currencySymbol} ${coursePrice}`}
              </span>
            </Row>
          </Card>
          {course.is_coupon_available === 'true' ? (
            <>
              <p className='Scrollable__courseCardHeading mt-3' style={{ fontSize: '14px' }}>
                Coupon:
              </p>
              <Row className='m-0'>
                <Col xs={8} className='my-auto'>
                  <label className='has-float-label my-auto'>
                    <input
                      className='form-control'
                      name='Enter Code'
                      type='text'
                      placeholder='Enter Code'
                      onChange={(e) => setCoupon(e.target.value)}
                    />
                    <span>Enter Code</span>
                  </label>
                </Col>
                <Col xs={4}>
                  <Button
                    variant='dashboardBlueOnWhite'
                    onClick={() => (couponState === 'removed' ? applyCoupon() : removeCoupon())}
                  >
                    {couponState === 'removed' ? 'Apply' : 'Remove'}
                  </Button>
                </Col>
              </Row>
              <p className='m-2'>
                <small className='text-center text-danger'>{couponMessage}</small>
              </p>
            </>
          ) : null}
        </Modal.Body>
        <Modal.Footer>
          <Button variant='boldTextSecondary' onClick={() => closeCouponModal()}>
            Cancel
          </Button>
          {+coursePrice > 0 ? (
            <>
              {paymentGateway === 'razorpay' ? (
                <Button variant='boldText' onClick={initPayment}>
                  Pay
                </Button>
              ) : paymentGateway.includes('cashfree') ? (
                <Button variant='boldText' onClick={startCashfreePayment}>
                  Pay
                </Button>
              ) : (
                <p>Payments not available</p>
              )}
            </>
          ) : (
            <Button variant='boldText' onClick={initPayment}>
              Pay
            </Button>
          )}
        </Modal.Footer>
      </Modal>

      <Modal show={showFeeModal} centered onHide={closeFeeModal}>
        <Modal.Header closeButton>
          <span className='Scrollable__courseCardHeading my-auto' style={{ fontSize: '14px' }}>
            Payment Summary
          </span>
        </Modal.Header>
        <Modal.Body>
          <div className='text-center'>
            <img
              src={order.status === 'due' || order.status === 'pending' ? caution : checkmark}
              alt='caution'
              className='img-fluid'
            />
            <h1 className='Fees__orderAmount mt-3'>
              {course.inducedCurrencySymbol
                ? `${course.inducedCurrencySymbol} ${order.amount}`
                : `${currencySymbol} ${order.amount}`}
            </h1>
            <p className='Fees__orderDescription'>{order.description}</p>
            <h3 className={statusClass}>
              {order.status === 'due'
                ? 'Payment Due'
                : order.status === 'pending'
                ? 'Payment Pending'
                : order.status === 'paid'
                ? 'Payment Successful'
                : order.status === 'waived'
                ? 'Payment Waived'
                : 'Payment Marked'}
            </h3>

            <p className='Fees__orderSummary m-2'>
              {order.status === 'due'
                ? 'Your payment is due. Please complete your payment before the due date given below.'
                : order.status === 'pending'
                ? 'Your payment is pending. PLease wait while your payment is processed.'
                : order.status === 'waived'
                ? 'The payment has been been waived off.'
                : order.status === 'marked'
                ? 'Your payment has been marked as paid.'
                : 'Congrats. The payment of fees was successfully processed. Happy learning!'}
            </p>
          </div>
          <p className='Fees__orderDetailHeading mb-0 ml-3 mt-4'>DUE DATE</p>
          <p className='Fees_orderDetails ml-3'>
            {order.due_date
              ? format(fromUnixTime(parseInt(order.due_date, 10)), 'dd-MMM-yyyy')
              : 'Immediately'}
          </p>
          <p className='Fees__orderDetailHeading mb-0'>TO: {order.coaching_name}</p>
          <p className='Fees_orderDetails'>{order.coaching_email}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='boldText' onClick={() => closeFeeModal()}>
            {order.status === 'marked' || order.status === 'waived' || order.status === 'paid'
              ? 'Go To Course'
              : 'Please Try Again'}
          </Button>
        </Modal.Footer>
      </Modal>

      <Cashfree
        noDisplay
        getCfRef={getCfRef}
        orderAmount={coursePrice}
        courseOrderId={courseOrderId}
        paymentSplits={paymentSplits}
        orderId={newOrderId}
        notifyUrl={ntfurl}
        testId={appId}
        cfType={paymentGateway}
      />

      <Modal show={showImageModal} onHide={handleImageClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {documentToOpen ? documentToOpen.name?.slice(0, documentToOpen.name?.length - 4) : ''}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className='mx-auto'>
          <img src={documentToOpen?.file_link} alt='img' className='img-fluid' />
        </Modal.Body>
      </Modal>
    </div>
  );
};

const mapStateToProps = (state) => ({
  clientId: getClientId(state),
  clientUserId: getClientUserId(state),
  currentbranding: getCurrentBranding(state),
  dashboardData: getCurrentDashboardData(state),
  locationData: getCurrentLocationData(state),
  roleArray: getRoleArray(state),
});

const mapDispatchToProps = (dispatch) => ({
  setRedirectPathToStore: (payload) => dispatch(dashboardActions.setRedirectPathToStore(payload)),
  setCurrentComponentToStore: (payload) =>
    dispatch(brandingActions.setCurrentComponentToStore(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(BuyCourse);

BuyCourse.propTypes = {
  // history: PropTypes.instanceOf(Object).isRequired,
  clientId: PropTypes.number.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
    location: PropTypes.instanceOf(Object).isRequired,
  }).isRequired,
  clientUserId: PropTypes.number.isRequired,
  dashboardData: PropTypes.instanceOf(Object).isRequired,
  locationData: PropTypes.instanceOf(Object).isRequired,
  currentbranding: PropTypes.shape({
    branding: PropTypes.shape({
      client_logo: PropTypes.string,
      client_color: PropTypes.string,
      client_icon: PropTypes.string,
      client_title: PropTypes.string,
      client_name: PropTypes.string,
      client_address: PropTypes.string,
      client_contact: PropTypes.string,
      currency_symbol: PropTypes.string,
      currency_code: PropTypes.string,
    }),
  }).isRequired,
  match: PropTypes.instanceOf(Object).isRequired,
  setRedirectPathToStore: PropTypes.func.isRequired,
  setCurrentComponentToStore: PropTypes.func.isRequired,
  roleArray: PropTypes.instanceOf(Array).isRequired,
};
