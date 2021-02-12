import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Swal from 'sweetalert2';
import fromUnixTime from 'date-fns/fromUnixTime';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import { connect } from 'react-redux';
import Card from 'react-bootstrap/Card';
import CreateIcon from '@material-ui/icons/Create';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { courseActions } from '../../redux/actions/course.action';
import { get, apiValidation, post } from '../../Utilities';
import { BatchesSelector } from '../Common';

const Price = (props) => {
  const {
    setCourseCurrentSlideToStore,
    coursePrice,
    discountPrice,
    coupons,
    clientId,
    courseId,
    clientUserId,
  } = props;
  const [currentCoursePrice, setCurrentPrice] = useState(0);
  const [discountCoursePrice, setDiscountPrice] = useState(0);
  const [coupon, setCoupons] = useState([]);
  const [isNewCoupon, setIsNewCoupon] = useState(false);
  const [newCouponCOde, setNewCouponCode] = useState('');
  const [newCouponAmount, setNewCouponAmount] = useState('');
  const [couponInfo, setCouponInfo] = useState({});
  const [couponModal, setCouponModal] = useState(false);
  const [couponAllCourse, setCouponAllCourse] = useState([]);
  const [couponSelectedCourse, setCouponSelectedCourse] = useState([]);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [couponOptions, setCouponOptions] = useState('forever');
  const [noOfCoupons, setNoOfCoupons] = useState(0);
  const [dateOfCoupon, setDateOfCoupon] = useState(new Date());
  const [noOfCouponsOptions, setNoOfCouponsOptions] = useState('unlimited');
  const [isFree, setIsFree] = useState(false);

  useEffect(() => {
    setCurrentPrice(coursePrice);
    setDiscountPrice(discountPrice);
    setCoupons(coupons);
  }, [coursePrice, discountPrice, coupons]);

  const getCouponInfo = (id, status) => {
    get({ client_id: clientId, coupon_id: id }, '/getCouponInformation').then((res) => {
      console.log(res);
      const result = apiValidation(res);
      result.status = status;
      console.log(result);
      setCouponInfo(result);
      const AllCourses = result.final_courses.map((e) => {
        const elem = { ...e, client_batch_id: e.course_id, batch_name: e.course_title };
        return elem;
      });
      setCouponAllCourse(AllCourses);
      const selectedCourses = result.current_courses.map((e) => {
        const elem = { ...e, client_batch_id: e.course_id, batch_name: e.course_title };
        return elem;
      });
      setCouponSelectedCourse(selectedCourses);
      openCouponInfoModal();
    });
  };

  const openCouponInfoModal = () => setCouponModal(true);
  const closeCouponInfoModal = () => setCouponModal(false);
  const openCourseModal = () => setShowCourseModal(true);
  const closeCourseModal = () => setShowCourseModal(false);

  const deleteCoupon = () => {
    post({ coupon_id: couponInfo.coupon_id }, '/deleteCoupon').then((res) => {
      if (res.success) {
        closeCouponInfoModal();
        const newCoupons = coupon.filter((e) => e.coupon_id !== couponInfo.coupon_id);
        setCoupons(newCoupons);
        setCouponInfo({});
      }
    });
  };

  const getSelectedBatches = (allbatches, selectedBatches) => {
    setCouponAllCourse(allbatches);
    setCouponSelectedCourse(selectedBatches);
  };

  const startActivation = () => {
    closeCouponInfoModal();
    openCourseModal();
  };

  const activateCoupon = (allBatches, selectedBatches) => {
    const prunedBatches = allBatches.map((e) => {
      delete e.client_batch_id;
      delete e.batch_name;

      return e;
    });

    const prunedSelectedBatches = selectedBatches.map((e) => {
      delete e.client_batch_id;
      delete e.batch_name;
      return e;
    });
    const payload = {
      coupon_id: couponInfo.coupon_id,
      course_add: JSON.stringify(prunedSelectedBatches),
      course_remove: JSON.stringify(prunedBatches),
    };

    post(payload, '/addCouponToCourse').then((res) => {
      closeCourseModal();

      if (res.success) {
        Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text: `You have successfully updated the course list.`,
        });
        get({ course_id: courseId, client_id: clientId }, '/getCouponsOfCourse').then((resp) => {
          const result = apiValidation(resp);
          setCoupons(result);
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops!',
          text: `Unable to update course list`,
        });
      }
    });
  };

  const addNewCoupon = () => {
    const payload = {
      coupon_code: newCouponCOde,
      price: newCouponAmount,
      valid_till:
        couponOptions === 'forever'
          ? 'forever'
          : parse(dateOfCoupon, 'yyyy-MM-dd', new Date()).getTime(),
      client_user_id: clientUserId,
      no_of_coupon: noOfCouponsOptions === 'unlimited' ? 'unlimited' : noOfCoupons,
    };

    post(payload, '/addCoupon').then((res) => {
      console.log(res);
      setIsNewCoupon(false);
      setCouponOptions('forever');
      setNewCouponAmount(0);
      setNewCouponCode('');
      setNoOfCouponsOptions('unlimited');
      setNoOfCoupons(0);
      setDateOfCoupon(new Date());
      get({ course_id: courseId, client_id: clientId }, '/getCouponsOfCourse').then((resp) => {
        const result = apiValidation(resp);
        setCoupons(result);
      });
    });
  };

  const addCourseFee = () => {
    if (!isFree && discountCoursePrice > currentCoursePrice) {
      Swal.fire({
        icon: 'error',
        title: 'Oops!',
        text: `Discounted Price Must be less than Course Price`,
      });
    } else {
      const payload = {
        course_id: courseId,
        course_price: isFree ? 0 : currentCoursePrice,
        discount_price: isFree ? 0 : discountCoursePrice,
      };
      post(payload, '/addCourseFee').then((res) => {
        if (res.success) {
          setCourseCurrentSlideToStore(5);
        }
      });
    }
  };

  return (
    <div>
      {['Basic Information', 'Create your content', 'Course display page'].map((e, i) => {
        return (
          <Card
            className='m-2 p-2'
            style={{ boxShadow: '0px 1px 3px 0px rgba(0,0,0,0.16)', borderRadius: '10px' }}
            onClick={() => setCourseCurrentSlideToStore(i + 1)}
            key={i} // eslint-disable-line
          >
            <Row className='my-auto Courses__createCourse mx-2'>
              <span className='Courses__coloredNumber mr-2'>{i + 1}</span>{' '}
              <span className='my-auto ml-3'>{e}</span>
              <span className='ml-auto' style={{ color: 'rgba(0, 0, 0, 0.54)' }}>
                <CreateIcon />
              </span>
            </Row>
          </Card>
        );
      })}
      <Card
        className='m-2 p-2'
        style={{ boxShadow: '0px 1px 3px 0px rgba(0,0,0,0.16)', borderRadius: '10px' }}
      >
        <Row className='my-auto Courses__createCourse mx-2'>
          <span className='Courses__coloredNumber mr-2'>4</span>{' '}
          <span className='my-auto ml-3'>Pricing and promotion</span>
        </Row>
        <Row className='m-2 mt-3 justify-content-center'>
          <label className='has-float-label my-auto w-100'>
            <input
              className='form-control'
              name='Course Price'
              type='text'
              value={currentCoursePrice}
              placeholder='Course Price'
              readOnly={isFree}
              onChange={(e) => setCurrentPrice(e.target.value)}
            />
            <span>Course Price</span>
          </label>
        </Row>

        <Row className='m-2 mt-3 justify-content-center'>
          <label className='has-float-label my-auto w-100'>
            <input
              className='form-control'
              name='Discounted Price'
              type='text'
              value={discountCoursePrice}
              placeholder='Discounted Price'
              readOnly={isFree}
              onChange={(e) => setDiscountPrice(e.target.value)}
            />
            <span>Discounted Price</span>
          </label>
        </Row>
        <Row className='m-2 ml-4 p-2'>
          <Form.Check
            style={{ marginRight: 'auto' }}
            type='checkbox'
            label='Free'
            bsPrefix='NoticeBoard__input'
            value={isFree}
            onClick={() => setIsFree(!isFree)}
          />
        </Row>
        <Row className='my-3 Courses__createCourse mx-2'>
          <span className='my-auto ml-2'>Coupons</span>
        </Row>
        <Row className='justify-content-center'>
          {coupon.length > 0 &&
            coupon.map((elem) => {
              return (
                <Col xs={5} key={elem.coupon_id} className='p-0 m-2'>
                  <Card
                    style={
                      elem.status === 'current'
                        ? { border: '2px solid var(--primary-blue)', borderRadius: '5px' }
                        : { border: '1px solid rgba(0, 0, 0, 0.12)', borderRadius: '5px' }
                    }
                    onClick={() => getCouponInfo(elem.coupon_id, elem.status)}
                  >
                    <p className='m-2'>
                      <span className='Courses__rupeeAmount'> &#8377; {elem.price}</span>
                      <span className='Courses__tinySubHeading'> OFF</span>
                    </p>
                    <Row className='justify-content-center m-2'>
                      <Col xs={6} className='p-0'>
                        <p className='mb-0 Courses__tinySubHeading'>Code:</p>
                        <p className='mb-0 Courses__couponSmallColor'>{elem.coupon_code}</p>
                      </Col>
                      <Col xs={6} className='p-0 text-right '>
                        <p className='mb-0 Courses__tinySubHeading'>Valid Till:</p>
                        <p className='mb-0 Courses__couponSmallColor'>
                          {/* {elem.valid_till === 'forever'
                            ? 'Forever'
                            : format(fromUnixTime(parseInt(elem.valid_till, 10)), 'dd/MM/yy')} */}
                          {elem.valid_till}
                        </p>
                      </Col>
                    </Row>
                  </Card>
                </Col>
              );
            })}
        </Row>

        {!isNewCoupon && (
          <Row className='w-50 m-2'>
            <Button
              variant='dashboardBlueOnWhite'
              className='p-1 mx-2'
              onClick={() => setIsNewCoupon(true)}
            >
              Add Coupon
            </Button>
          </Row>
        )}

        {isNewCoupon && (
          <Card>
            <Row className='my-3 Courses__createCourse mx-2'>
              <span className='my-auto ml-2'>Coupons</span>
            </Row>
            <Row className='m-2 mt-3 justify-content-center'>
              <label className='has-float-label my-auto w-100'>
                <input
                  className='form-control'
                  name='Code'
                  type='text'
                  value={newCouponCOde}
                  placeholder='Code'
                  onChange={(e) => setNewCouponCode(e.target.value)}
                />
                <span>Code</span>
              </label>
            </Row>
            <Row className='m-2 mt-3 justify-content-center'>
              <Col className='pl-0'>
                <label className='has-float-label my-auto w-100'>
                  <input
                    className='form-control'
                    name='Discount Type'
                    type='text'
                    value='₹Rupees'
                    placeholder='Discount Type'
                    readOnly
                  />
                  <span>Discount Type</span>
                </label>
              </Col>
              <Col className='pr-0'>
                <label className='has-float-label my-auto w-100'>
                  <input
                    className='form-control'
                    name='Amount'
                    type='text'
                    value={newCouponAmount}
                    placeholder='Amount'
                    onChange={(e) => setNewCouponAmount(e.target.value)}
                  />
                  <span>Amount</span>
                </label>
              </Col>
            </Row>
            <p className='Courses__tinySubHeading mt-3 mb-0 mx-3' style={{ fontSize: '12px' }}>
              Valid Till:
            </p>
            <Form className='Enquiry__form mt-3 mx-2 '>
              <div className='mb-3'>
                <Form.Check
                  defaultChecked
                  type='radio'
                  id={couponOptions === 'forever' ? 'forever' : 'limited'}
                  label='Forever'
                  value='forever'
                  name='valid'
                  onChange={(e) => setCouponOptions(e.target.value)}
                />
                <Row>
                  <Col>
                    <Form.Check
                      type='radio'
                      label='Limited, specify'
                      id={couponOptions === 'limited' ? 'forever' : 'limited'}
                      value='limited'
                      name='valid'
                      onChange={(e) => setCouponOptions(e.target.value)}
                    />
                  </Col>
                  <Col>
                    <label className='has-float-label my-auto w-100'>
                      <input
                        className='form-control'
                        name='Date'
                        type='date'
                        value={dateOfCoupon}
                        placeholder='Date'
                        readOnly={couponOptions === 'forever'}
                        onChange={(e) => setDateOfCoupon(e.target.value)}
                      />
                      <span>Date</span>
                    </label>
                  </Col>
                </Row>
              </div>
            </Form>
            <p className='Courses__tinySubHeading mt-3 mb-0 mx-3' style={{ fontSize: '12px' }}>
              No Of Coupons:
            </p>
            <Form className='Enquiry__form mt-3 mx-2 '>
              <div className='mb-3'>
                <Form.Check
                  defaultChecked
                  type='radio'
                  id={noOfCouponsOptions === 'unlimited' ? 'unlimited' : 'limitedNumber'}
                  label='Unlimited'
                  value='unlimited'
                  name='noOfCoupons'
                  onChange={(e) => setNoOfCouponsOptions(e.target.value)}
                />
                <Row>
                  <Col>
                    <Form.Check
                      type='radio'
                      label='Limited, specify'
                      id={noOfCouponsOptions === 'limitedNumber' ? 'unlimited' : 'limitedNumber'}
                      value='limitedNumber'
                      name='noOfCoupons'
                      onChange={(e) => setNoOfCouponsOptions(e.target.value)}
                    />
                  </Col>
                  <Col>
                    <label className='has-float-label my-auto w-100'>
                      <input
                        className='form-control'
                        name='Number'
                        type='Number'
                        value={noOfCoupons}
                        placeholder='number'
                        readOnly={noOfCouponsOptions === 'unlimited'}
                        onChange={(e) => setNoOfCoupons(e.target.value)}
                      />
                      <span>Number</span>
                    </label>
                  </Col>
                </Row>
              </div>
            </Form>
            <Row className='justify-content-end m-2'>
              <Button variant='boldTextSecondary' onClick={() => setIsNewCoupon(false)}>
                CANCEL
              </Button>
              <Button variant='boldText' onClick={() => addNewCoupon()}>
                ADD
              </Button>
            </Row>
          </Card>
        )}
        <Row className='w-25 justify-content-end ml-auto m-2'>
          <Button variant='customPrimarySmol' onClick={() => addCourseFee()}>
            Continue
          </Button>
        </Row>
        <Modal show={couponModal} centered onHide={closeCouponInfoModal}>
          <Modal.Header closeButton>
            <span className='Scrollable__courseCardHeading my-auto' style={{ fontSize: '14px' }}>
              Coupon Information
            </span>
          </Modal.Header>
          <Modal.Body className='m-2'>
            <p className='m-2'>
              <span className='Courses__rupeeAmount' style={{ fontSize: '18px' }}>
                {' '}
                &#8377; {couponInfo.price}
              </span>
              <span style={{ fontSize: '12px' }} className='Courses__tinySubHeading'>
                {' '}
                OFF
              </span>
            </p>
            <p className='Courses__tinySubHeading m-2'>
              {couponInfo.no_of_coupon === 'unlimited' ? 'Unlimited' : couponInfo.no_of_coupon}{' '}
              Coupons Left
            </p>
            <Row className='justify-content-center m-2'>
              <Col xs={6} className='p-0'>
                <p style={{ fontSize: '14px' }} className='mb-0 Courses__tinySubHeading'>
                  Code:
                </p>
                <p style={{ fontSize: '14px' }} className='mb-0 Courses__couponSmallColor'>
                  {couponInfo.coupon_code}
                </p>
              </Col>
              <Col xs={6} className='p-0 text-right '>
                <p style={{ fontSize: '14px' }} className='mb-0 Courses__tinySubHeading'>
                  Valid Till:
                </p>
                <p style={{ fontSize: '14px' }} className='mb-0 Courses__couponSmallColor'>
                  {/* {couponInfo.valid_till === 'forever'
                    ? 'Forever'
                    : format(fromUnixTime(parseInt(couponInfo.valid_till, 10)), 'dd/MM/yy')} */}
                  {couponInfo.valid_till}
                </p>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant='redOutline' onClick={() => deleteCoupon()}>
              Delete
            </Button>
            <Button variant='primaryOutline' onClick={() => startActivation()}>
              {couponInfo.status === 'current' ? 'Deactivate' : 'Activate'}
            </Button>
          </Modal.Footer>
        </Modal>
        <Modal show={showCourseModal} onHide={closeCourseModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>Select Courses</Modal.Title>
          </Modal.Header>
          <BatchesSelector
            batches={couponAllCourse}
            getSelectedBatches={getSelectedBatches}
            title='Courses'
            selectBatches={couponSelectedCourse}
            sendBoth
          />
          <Modal.Footer>
            <Button
              variant='boldText'
              onClick={() => activateCoupon(couponAllCourse, couponSelectedCourse)}
            >
              Next
            </Button>
          </Modal.Footer>
        </Modal>
      </Card>
      {['Privacy and publish'].map((e, i) => {
        return (
          <Card
            className='m-2 p-2'
            style={{ boxShadow: '0px 1px 3px 0px rgba(0,0,0,0.16)', borderRadius: '10px' }}
            key={i} // eslint-disable-line
          >
            <Row className='my-auto Courses__createCourse mx-2'>
              <span className='Courses__coloredNumber mr-2'>{5}</span>{' '}
              <span className='my-auto ml-3'>{e}</span>
            </Row>
          </Card>
        );
      })}
    </div>
  );
};
const mapDispatchToProps = (dispatch) => {
  return {
    setCourseCurrentSlideToStore: (payload) => {
      dispatch(courseActions.setCourseCurrentSlideToStore(payload));
    },
  };
};

export default connect(null, mapDispatchToProps)(Price);

Price.propTypes = {
  setCourseCurrentSlideToStore: PropTypes.func.isRequired,
  coursePrice: PropTypes.number,
  discountPrice: PropTypes.number,
  coupons: PropTypes.instanceOf(Array).isRequired,
  clientId: PropTypes.number.isRequired,
  courseId: PropTypes.number.isRequired,
  clientUserId: PropTypes.number.isRequired,
};

Price.defaultProps = {
  coursePrice: 0,
  discountPrice: 0,
};
