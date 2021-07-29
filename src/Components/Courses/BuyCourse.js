import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import cx from 'classnames';
import format from 'date-fns/format';
import fromUnixTime from 'date-fns/fromUnixTime';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Toast from 'react-bootstrap/Toast';
import Card from 'react-bootstrap/Card';
import Accordion from 'react-bootstrap/Accordion';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Swal from 'sweetalert2';
import PlyrComponent from 'plyr-react';
import 'plyr-react/dist/plyr.css';
import StarIcon from '@material-ui/icons/Star';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import rupee from '../../assets/images/Courses/rupee.svg';
import { apiValidation, get, post, displayRazorpay, shareThis } from '../../Utilities';
import { PageHeader } from '../Common';
import './Courses.scss';
import {
  getClientId,
  getClientUserId,
  getRoleArray,
} from '../../redux/reducers/clientUserId.reducer';
import { getCurrentBranding } from '../../redux/reducers/branding.reducer';
import YCIcon from '../../assets/images/ycIcon.png';
import checkmark from '../../assets/images/order/icons8-checked.svg';
import caution from '../../assets/images/order/icons8-medium-risk-50.png';
import { dashboardActions } from '../../redux/actions/dashboard.action';
import { brandingActions } from '../../redux/actions/branding.action';

const BuyCourse = (props) => {
  const {
    history,
    match,
    clientId,
    clientUserId,
    currentbranding: {
      branding: {
        client_color: clientColor,
        client_name: clientName,
        client_logo: clientLogo,
        client_address: clientAddress,
        client_contact: clientContact,
      },
    },
    setRedirectPathToStore,
    setCurrentComponentToStore,
    roleArray,
  } = props;
  const [course, setCourse] = useState({});
  const [courseVideo, setCourseVideo] = useState({});
  const [coursePrice, setCoursePrice] = useState(0);
  const [whiteStarArray, setWhiteStarArray] = useState([]);
  const [starArray, setStarArray] = useState([]);
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [showFeeModal, setShowFeeModal] = useState(false);
  const [coupon, setCoupon] = useState('');
  const [couponId, setCouponId] = useState('');
  const [couponMessage, setCouponMessage] = useState('');
  const [order, setOrder] = useState({});
  const [showToast, setShowToast] = useState(false);

  const statusClass = cx({
    Fees__orderStatus: true,
    Fees__orderGreen:
      order.status === 'marked' || order.status === 'waived' || order.status === 'paid',
    Fees__orderRed: order.status === 'pending' || order.status === 'due',
  });

  const options = {
    autoplay: true,
  };

  useEffect(() => {
    setRedirectPathToStore(null);
    setCurrentComponentToStore('Welcome');
  }, [setCurrentComponentToStore, setRedirectPathToStore]);

  useEffect(() => {
    const payload = {
      client_id: match.params.clientId,
      course_id: match.params.courseId,
    };

    get(payload, '/getCourseDetails').then((res) => {
      console.log(res, 'course details');
      const result = apiValidation(res);
      setCourse(result);
      if (result.course_preview_vedio) {
        const source = {
          type: 'video',
          sources: [
            {
              src: result.course_preview_vedio,
            },
          ],
        };

        setCourseVideo(source);
      }
      setCoursePrice(result.discount_price);
      const numberOfStars = Math.round(parseInt(result.course_rating, 10));
      setStarArray(
        [...Array(numberOfStars)].map((e, i) => (
          /* eslint-disable-next-line */
          <span role='img' aria-label='emoji' key={i}>
            <StarIcon className='Scrollable__emoji' />
          </span>
        )),
      );

      const normalStars = 5 - numberOfStars;

      setWhiteStarArray(
        [...Array(normalStars)].map((e, i) => (
          /* eslint-disable-next-line */
          <span role='img' aria-label='emoji' key={i}>
            <StarBorderIcon className='Scrollable__emoji' />
          </span>
        )),
      );
    });
  }, [match]);

  const subscribeOrBuy = () => {
    if (roleArray.includes(3) || roleArray.includes(4)) {
      history.push('/');
    }
    if (course.course_type === 'free') {
      const payload = {
        client_user_id: clientUserId,
        course_id: match.params.courseId,
      };
      post(payload, '/subscribeStudentToCourse').then((res) => {
        if (res.success === 1) {
          Swal.fire({
            icon: 'success',
            title: 'Subscribed!',
            text: `You have successfully subscribed to ${course.course_title}.`,
          });
          history.push('/');
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

  const openCouponModal = () => setShowCouponModal(true);
  const closeCouponModal = () => setShowCouponModal(false);

  const openFeeModal = () => setShowFeeModal(true);
  const closeFeeModal = () => {
    setShowFeeModal(false);
    if (order.status === 'marked' || order.status === 'waived' || order.status === 'paid') {
      history.push({
        pathname: '/courses/mycourse',
        state: { id: match.params.courseId, clientUserId },
      });
    }
  };

  const applyCoupon = () => {
    const payload = {
      client_user_id: clientUserId,
      course_id: match.params.courseId,
      client_id: clientId,
      coupon_code: coupon,
    };

    get(payload, '/checkCouponCode').then((res) => {
      const result = apiValidation(res);
      if (result.coupon_status === 'true') {
        let newPrice = coursePrice - result.price;
        if (newPrice <= 0) newPrice = 0;
        setCoursePrice(newPrice);
        setCouponId(result.coupon_id);
        setCouponMessage(result.message);
      } else {
        setCouponMessage(result.message);
        setCouponId(result.coupon_id);
      }
    });
  };

  const payToRazorBaba = () => {
    const orderPayload = {
      client_user_id: clientUserId,
      course_id: match.params.courseId,
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

      displayRazorpay(
        orderDetails.order_id,
        coursePrice * 100,
        'INR',
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
      course_id: match.params.courseId,
      coupon_id: couponId,
    };
    post(payload, '/subscribeStudentToCourse').then((res) => {
      if (res.success === 1) {
        Swal.fire({
          icon: 'success',
          title: 'Subscribed!',
          text: `You have successfully subscribed to ${course.course_title}.`,
        });
        history.push('/');
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
    history.push('/preload');
  };

  const shareCourse = () => {
    // eslint-disable-next-line
    const url = window.location.href;
    console.log(url);
    const hasShared = shareThis(url, window.location.host.split('.')[0]);
    if (hasShared === 'clipboard') setShowToast(true);
  };

  return (
    <div>
      <PageHeader title='Buy Course' />
      {Object.keys(course).length > 0 && (
        <div className='Courses__buycourseContainer' style={{ marginTop: '5rem' }}>
          <Row className='mx-3'>
            <Col xs={5} sm={3} className='Courses__imageRow'>
              <img
                src={course.course_display_image ? course.course_display_image : YCIcon}
                alt='course'
                className='mx-auto img-fluid Courses__displayImage'
              />
            </Col>
            <Col xs={7} sm={9} className='p-0'>
              <p className='Scrollable__courseCardHeading mb-0 mx-2'>{course.course_title}</p>
              <Row className='mx-2'>
                {starArray.map((e) => {
                  return e;
                })}
                {whiteStarArray.map((e) => {
                  return e;
                })}
                <span
                  className='Scrollable__smallText my-auto'
                  style={{ color: 'rgba(0, 0, 0, 0.87)' }}
                >
                  {course.course_rating}
                </span>
                <span
                  className='Scrollable__smallText my-auto'
                  style={{ color: 'rgba(0, 0, 0, 0.87)' }}
                >
                  ({course.total_votes})
                </span>
              </Row>
              <Row className='Scrollable__courseCardSubHeading text-left mx-2'>
                <img src={rupee} alt='rupee' height='10' width='10' className='my-auto' />
                <span className='mx-1 Scrollable__courseCardHeading my-auto'>{coursePrice}</span>
                <span className='my-auto'>
                  <del>{course.course_price}</del>
                </span>
                {course.bestseller_tag && (
                  <div className='Scrollable__bestSeller m-2 p-1 ml-auto my-auto'>Bestseller</div>
                )}
              </Row>
            </Col>
          </Row>
          <Row className='Courses__buyButton'>
            <Button
              className='mt-3 mx-auto'
              variant='greenButtonLong'
              onClick={
                localStorage.getItem('state') &&
                JSON.parse(localStorage.getItem('state')).userProfile.token
                  ? () => subscribeOrBuy()
                  : () => goToLogin()
              }
            >
              {course.course_type === 'free' ? 'Subscribe' : 'Buy Now'}
            </Button>
            <Button
              className='mt-3 mx-auto'
              variant='greenButtonLong'
              onClick={() => shareCourse()}
            >
              Share
            </Button>
          </Row>
          <div className='mx-auto my-4 Courses__videoplayer'>
            {courseVideo && <PlyrComponent source={courseVideo} options={options} />}
          </div>
          <p className='Courses__heading m-3'>What will I learn?</p>
          {course.tag_array
            .filter((e) => e.tag_type === 'learning')
            .map((e) => {
              return (
                <p className='Courses__subHeading mb-0 mx-3' key={e.course_tag_id}>
                  - {e.tag_name}
                </p>
              );
            })}
          <hr className='mx-3' />
          <p className='Courses__heading m-3'>Description</p>
          <p className='Courses__subHeading mb-0 mx-3'>{course.course_description}</p>
          <hr className='mx-3' />
          <p className='Courses__heading m-3'>Requirements</p>
          {course.tag_array
            .filter((e) => e.tag_type === 'prerequisite' || e.tag_type === 'pre_requisite')
            .map((e) => {
              return (
                <p className='Courses__subHeading mb-0 mx-3' key={e.course_tag_id}>
                  - {e.tag_name}
                </p>
              );
            })}
          <hr className='mx-3' />
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
                          <p className='mx-2' key={elem.name}>
                            {i + 1}. {elem.name}
                          </p>
                        );
                      })}
                    </div>
                  </Accordion.Collapse>
                </Card>
              </Accordion>
            );
          })}
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
              <span className='my-auto Courses__couponHeading'>Registration</span>
              <span
                className='ml-auto my-auto'
                style={{
                  color: 'var(--primary-blue)',
                  fontSize: '12px',
                  fontFamily: 'MontSerrat-Medium',
                }}
              >
                &#8377; {coursePrice}
              </span>
            </Row>
          </Card>
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
              <Button variant='dashboardBlueOnWhite' onClick={() => applyCoupon()}>
                Apply
              </Button>
            </Col>
          </Row>
          <p className='m-2'>
            <small className='text-center text-danger'>{couponMessage}</small>
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='boldTextSecondary' onClick={() => closeCouponModal()}>
            Cancel
          </Button>
          <Button
            variant='boldText'
            onClick={coursePrice ? () => payToRazorBaba() : () => basSubscribe()}
          >
            Pay
          </Button>
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
            <h1 className='Fees__orderAmount mt-3'>&#x20B9; {order.amount}</h1>
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
    </div>
  );
};

const mapStateToProps = (state) => ({
  clientId: getClientId(state),
  clientUserId: getClientUserId(state),
  currentbranding: getCurrentBranding(state),
  roleArray: getRoleArray(state),
});

const mapDispatchToProps = (dispatch) => ({
  setRedirectPathToStore: (payload) => dispatch(dashboardActions.setRedirectPathToStore(payload)),
  setCurrentComponentToStore: (payload) =>
    dispatch(brandingActions.setCurrentComponentToStore(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(BuyCourse);

BuyCourse.propTypes = {
  history: PropTypes.instanceOf(Object).isRequired,
  clientId: PropTypes.number.isRequired,
  clientUserId: PropTypes.number.isRequired,
  currentbranding: PropTypes.shape({
    branding: PropTypes.shape({
      client_logo: PropTypes.string,
      client_color: PropTypes.string,
      client_icon: PropTypes.string,
      client_title: PropTypes.string,
      client_name: PropTypes.string,
      client_address: PropTypes.string,
      client_contact: PropTypes.string,
    }),
  }).isRequired,
  match: PropTypes.instanceOf(Object).isRequired,
  setRedirectPathToStore: PropTypes.func.isRequired,
  setCurrentComponentToStore: PropTypes.func.isRequired,
  roleArray: PropTypes.instanceOf(Array).isRequired,
};
