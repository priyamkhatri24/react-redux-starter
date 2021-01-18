import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import fromUnixTime from 'date-fns/fromUnixTime';
import format from 'date-fns/format';
import { connect } from 'react-redux';
import Card from 'react-bootstrap/Card';
import CreateIcon from '@material-ui/icons/Create';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { courseActions } from '../../redux/actions/course.action';

const Price = (props) => {
  const { setCourseCurrentSlideToStore, coursePrice, discountPrice, coupons } = props;
  const [currentCoursePrice, setCurrentPrice] = useState(0);
  const [discountCoursePrice, setDiscountPrice] = useState(0);
  const [coupon, setCoupons] = useState([]);
  const [isNewCoupon, setIsNewCoupon] = useState(false);
  const [newCouponCOde, setNewCouponCode] = useState('');
  const [newCouponAmount, setNewCouponAmount] = useState('');

  useEffect(() => {
    setCurrentPrice(coursePrice);
    setDiscountPrice(discountPrice);
    setCoupons(coupons);
  }, [coursePrice, discountPrice, coupons]);
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
              onChange={(e) => setDiscountPrice(e.target.value)}
            />
            <span>Discounted Price</span>
          </label>
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
                          {format(fromUnixTime(parseInt(elem.valid_till, 10)), 'dd/MM/yy')}
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
              Add Section
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
            <p className='Courses__tinySubHeading m-2'>Valid Till:</p>
          </Card>
        )}
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
              <span className='ml-auto' style={{ color: 'rgba(0, 0, 0, 0.54)' }}>
                <CreateIcon />
              </span>
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
};

Price.defaultProps = {
  coursePrice: 0,
  discountPrice: 0,
};
