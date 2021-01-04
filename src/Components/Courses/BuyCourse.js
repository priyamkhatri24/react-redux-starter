import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Accordion from 'react-bootstrap/Accordion';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Swal from 'sweetalert2';
import StarIcon from '@material-ui/icons/Star';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import rupee from '../../assets/images/Courses/rupee.svg';
import { apiValidation, get, post, displayRazorpay } from '../../Utilities';
import { PageHeader } from '../Common';
import './Courses.scss';
import { getClientId } from '../../redux/reducers/clientUserId.reducer';
import { getCurrentBranding } from '../../redux/reducers/branding.reducer';

const BuyCourse = (props) => {
  const {
    history,
    clientId,
    currentbranding: {
      branding: {
        client_color: clientColor,
        client_name: clientName,
        client_logo: clientLogo,
        client_address: clientAddress,
        client_contact: clientContact,
      },
    },
  } = props;
  const [course, setCourse] = useState({});
  const [coursePrice, setCoursePrice] = useState(0);
  const [whiteStarArray, setWhiteStarArray] = useState([]);
  const [starArray, setStarArray] = useState([]);
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [coupon, setCoupon] = useState('');
  const [couponId, setCouponId] = useState(0);
  const [couponMessage, setCouponMessage] = useState('');

  useEffect(() => {
    const payload = {
      client_user_id: history.location.state.clientUserId,
      course_id: history.location.state.id,
    };

    get(payload, '/getCourseDetails').then((res) => {
      console.log(res);
      const result = apiValidation(res);
      setCourse(result);
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
  }, [history.location.state.id, history.location.state.clientUserId]);

  const subscribeOrBuy = () => {
    if (course.course_type === 'free') {
      const payload = {
        client_user_id: history.location.state.clientUserId,
        course_id: history.location.state.id,
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

  const applyCoupon = () => {
    const payload = {
      client_user_id: history.location.state.clientUserId,
      course_id: history.location.state.id,
      client_id: clientId,
      coupon_code: coupon,
    };

    get(payload, '/checkCouponCode').then((res) => {
      const result = apiValidation(res);
      if (result.coupon_status === 'true') {
        setCoursePrice(result.price);
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
      client_user_id: history.location.state.clientUserId,
      course_id: history.location.state.id,
      amount: coursePrice,
      coupon_id: couponId,
    };

    const razorPayload = {
      status: process.env.NODE_ENV === 'development' ? 'Development' : 'Production',
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
      ).then((resp) => console.log(resp, 'razor'));
    });
  };

  const razorSuccess = (payload) => {
    const verifyPayload = {
      order_id: payload.order_id,
      course_order_id: payload.user_fee_id,
    };

    get(verifyPayload, '/fetchOrderByIDForCourse').then((res) => console.log(res));
  };

  return (
    <div>
      <PageHeader title='Buy Course' />
      {Object.keys(course).length > 0 && (
        <div className='Course' style={{ marginTop: '5rem' }}>
          <Row className='mx-3'>
            <Col xs={4} className=''>
              <img
                src={course.course_display_image}
                alt='course'
                className='mx-auto
              img-fluid'
              />
            </Col>
            <Col xs={8} className='p-0'>
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
          <Row>
            <Button
              className='mt-3 mx-auto'
              variant='greenButtonLong'
              onClick={() => subscribeOrBuy()}
            >
              {course.course_type === 'free' ? 'Subscribe' : 'Buy Now'}
            </Button>
          </Row>
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
                          <p className='mx-2'>
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
          <Button variant='boldText' onClick={() => payToRazorBaba()}>
            Pay
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

const mapStateToProps = (state) => ({
  clientId: getClientId(state),
  currentbranding: getCurrentBranding(state),
});

export default connect(mapStateToProps)(BuyCourse);

BuyCourse.propTypes = {
  history: PropTypes.instanceOf(Object).isRequired,
  clientId: PropTypes.number.isRequired,
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
};
