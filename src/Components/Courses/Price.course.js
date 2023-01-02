import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Swal from 'sweetalert2';
import parse from 'date-fns/parse';
import { connect } from 'react-redux';
import Card from 'react-bootstrap/Card';
import CreateIcon from '@material-ui/icons/Create';
import AddTaskIcon from '@material-ui/icons/SaveOutlined';
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';
import CloseIcon from '@material-ui/icons/Close';
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
    isRegional,
    priceArray,
    courseId,
    clientUserId,
    currencySymbol,
    paymentGateway,
  } = props;
  const [currentCoursePrice, setCurrentPrice] = useState(0);
  const [discountCoursePrice, setDiscountPrice] = useState(0);
  const [coupon, setCoupons] = useState([]);
  const [isNewCoupon, setIsNewCoupon] = useState(false);
  const [newCouponCOde, setNewCouponCode] = useState('');
  const [newCouponType, setNewCouponType] = useState('price');
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
  const [courseIsRegional, setCourseIsRegional] = useState(false);
  const [regionalPriceArray, setRegionalPriceArray] = useState([]);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [isNewPriceSaved, setIsNewPriceSaved] = useState(true);
  const [addMoreClickedStatus, setAddMoreClickedStatus] = useState(0);
  const [validatorSwitch, setValidatorSwitch] = useState(0);
  const [authToken, setAuthToken] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('all states');
  const [selectedCurrencyCode, setSelectedCurrencyCode] = useState('INR');
  const [enteredRegionCoursePrice, setEnteredRegionCoursePrice] = useState('');
  const [enteredRegionDiscountPrice, setEnteredRegionDiscountPrice] = useState('');
  const [newCouponCurrency, setNewCouponCurrency] = useState('INR');
  const [couponPage, setCouponPage] = useState(1);
  const [seeMore, setSeeMore] = useState(true);
  const [codes, setCodes] = useState([]);

  useEffect(() => {
    get(null, '/getAllCurrencyCodesWithNames').then((currency) => {
      const result = apiValidation(currency);
      setCurrencies(result);
      get(null, '/getAllCurrencyCodes').then((codescurrency) => {
        const result2 = apiValidation(codescurrency);
        setCodes(result2);
      });
    });
  }, []);

  console.log(currencies, 'currencies');

  useEffect(() => {
    const headers = {
      Accept: 'application/json',
      'api-token': '9hnzIwdfLG2vUx28TvkEqDRfBDsj4JoKcEkp8i1mRu9XJ8ZKnJ6ZoJo0T-eK_dHa02I',
      'user-email': 'tech@ingeniumedu.com',
    };
    fetch('https://www.universal-tutorial.com/api/getaccesstoken', {
      headers,
    })
      .then((res) => res.json())
      .then((resp) => {
        setAuthToken(resp.auth_token);
        const headerss = {
          Authorization: `Bearer ${resp.auth_token}`, // getting access token from this api
          Accept: 'application/json',
        };
        fetch('https://www.universal-tutorial.com/api/countries', { headers: headerss })
          .then((res) => res.json())
          .then((data) => {
            console.log(data, 'countries'); // print countries data
            setCountries(data || []);
          })
          .catch((err) => console.log(err));
      });
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      const headers = {
        Authorization: `Bearer ${authToken}`,
        Accept: 'application/json',
      };
      fetch(`https://www.universal-tutorial.com/api/states/${selectedCountry}`, {
        headers,
      })
        .then((res) => res.json())
        .then((resp) => {
          setStates(resp);
        });
    }
  }, [selectedCountry]);

  useEffect(() => {
    setCurrentPrice(coursePrice);
    setDiscountPrice(discountPrice);
    setCoupons(coupons);
  }, [coursePrice, discountPrice, coupons]);

  useEffect(() => {
    const filteredPriceArray = priceArray.filter((ele) => ele.country_name !== 'default');
    setRegionalPriceArray(filteredPriceArray);
    setCourseIsRegional(isRegional);
  }, []);

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

  const openCouponInfoModal = () => {
    setCouponModal(true);
    console.log(couponInfo);
  };
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
        get(
          { course_id: courseId, client_id: clientId, limit: couponPage > 1 ? 60 : 30, page: 1 },
          '/getCouponsOfCourseLatest',
        ).then((resp) => {
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
      coupon_type: newCouponType,
      coupon_currency: newCouponCurrency,
    };
    post(payload, '/addCoupon').then((res) => {
      console.log(res);
      setIsNewCoupon(false);
      setCouponOptions('forever');
      setNewCouponAmount(0);
      setNewCouponCode('');
      setNoOfCouponsOptions('unlimited');
      setNewCouponType('price');
      setNewCouponCurrency('INR');
      setNoOfCoupons(0);
      setDateOfCoupon(new Date());
      get(
        { course_id: courseId, client_id: clientId, limit: 30, page: couponPage },
        '/getCouponsOfCourseLatest',
      ).then((resp) => {
        const result = apiValidation(resp);
        setCoupons([...coupon, result[result.length - 1]]);
      });
    });
  };

  const addCourseFee = () => {
    console.log(discountCoursePrice, currentCoursePrice);
    if (!isFree && Number(discountCoursePrice) > Number(currentCoursePrice)) {
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

  const fetchMoreCoupons = () => {
    get(
      { course_id: courseId, client_id: clientId, limit: 30, page: couponPage + 1 },
      '/getCouponsOfCourseLatest',
    ).then((resp) => {
      const result = apiValidation(resp);
      setCoupons([...coupon, ...result]);
      setCouponPage((prev) => prev + 1);
      setSeeMore(result.length >= 30);
    });
  };

  const toggleCourseRegioanlity = () => {
    setCourseIsRegional((prev) => !prev);
  };

  const addMoreClicked = () => {
    setAddMoreClickedStatus(1);
    console.log('updayed!');
  };

  const checkValidationForRegionalArrayObject = () => {
    return (
      selectedCountry &&
      selectedState &&
      !isNaN(enteredRegionCoursePrice) &&
      enteredRegionCoursePrice !== '' &&
      enteredRegionDiscountPrice !== '' &&
      !isNaN(enteredRegionDiscountPrice) &&
      selectedCurrencyCode
    );
  };

  const updatePricesArrayHandler = () => {
    if (!checkValidationForRegionalArrayObject()) {
      setValidatorSwitch(1);
      return;
    }
    const newRegionalPriceArray = [...regionalPriceArray];
    newRegionalPriceArray.push({
      country_name: selectedCountry,
      state_name: selectedState === 'all states' ? '' : selectedState,
      region_course_price: +enteredRegionCoursePrice,
      region_discount_price: +enteredRegionDiscountPrice,
      currency_code: selectedCurrencyCode,
    });
    setRegionalPriceArray(newRegionalPriceArray);
    setAddMoreClickedStatus(0);
    setEnteredRegionCoursePrice('');
    setEnteredRegionDiscountPrice('');
    setSelectedCurrencyCode('');
    setSelectedState('all states');
    setSelectedCountry('');
    setValidatorSwitch(0);
    console.log(newRegionalPriceArray);
  };

  const deletedObjectfromPriceArray = (object) => {
    const newRegionalPriceArray = regionalPriceArray.filter((ele) => {
      return (
        ele.country_name !== object.country_name ||
        ele.state_name !== object.state_name ||
        ele.region_course_price !== object.region_course_price ||
        ele.region_discount_price !== object.region_discount_price ||
        ele.currency_code !== object.currency_code
      );
    });
    setRegionalPriceArray(newRegionalPriceArray);
  };

  const addCourseRegionalPrices = () => {
    const payload = {
      course_id: courseId,
      price_array: JSON.stringify(regionalPriceArray),
      client_id: clientId,
      need_msg: true,
    };
    console.log(regionalPriceArray);
    post(payload, '/addCourseRegionalPrice')
      .then((res) => {
        console.log(res);
        if (res.success) {
          Swal.fire({
            icon: 'success',
            title: 'Updated!',
            text: `You have successfully updated the course's regional prices.`,
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops!',
            text: `Unable to update course regional price.`,
          });
        }
      })
      .catch((err) => console.log(err));
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
        <Row className='m-2 mt-3 justify-content-start'>
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
          <span className='mt-1 Courses__tinySubHeading'>
            This is the price before discount. Not the actual price that user will pay.
          </span>
        </Row>

        <Row className='m-2 mt-3 justify-content-start'>
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
          <span className='mt-1 Courses__tinySubHeading'>
            This is the actual price that user will pay while buying the course.
          </span>
        </Row>
        {paymentGateway === 'razorpay' && (
          <Row className='m-2 mt-3'>
            <div
              onClick={toggleCourseRegioanlity}
              onKeyPress={toggleCourseRegioanlity}
              tabIndex={-1}
              role='button'
              className='Courses__addRegionalPriceButton'
            >
              + Add Course price for different regions.
            </div>
          </Row>
        )}
        {paymentGateway !== 'razorpay' && (
          <Row className='my-3 Courses__createCourse mx-2'>
            <span style={{ fontFamily: 'Montserrat-regular' }} className='my-auto ml-2'>
              You cannot add regional prices to the course. The current payment gateway does not
              support regional prices.
            </span>
          </Row>
        )}
        {courseIsRegional && paymentGateway === 'razorpay' ? (
          <Row className='m-2 mt-3'>
            {regionalPriceArray.map((ele) => {
              return (
                <div className='d-flex mb-3 w-100' style={{ flexFlow: 'wrap' }}>
                  <label className='has-float-label my-auto regionalPriceFormInput'>
                    <input
                      className='form-control'
                      name='Country Name'
                      disabled
                      readOnly
                      type='text'
                      value={ele.country_name}
                      placeholder='Country Name'
                      // onChange={()=>{}}
                    />
                    <span className='smallFont'>Country Name</span>
                  </label>
                  <label className='has-float-label my-auto regionalPriceFormInput'>
                    <input
                      className='form-control'
                      name='State Name'
                      disabled
                      readOnly
                      type='text'
                      value={ele.state_name === '' ? 'all states' : ele.state_name}
                      placeholder='State Name'
                      // onChange={()=>{}}
                    />
                    <span>State name</span>
                  </label>
                  <label className='has-float-label my-auto regionalPriceFormInput'>
                    <input
                      className='form-control'
                      name='Country Price'
                      type='text'
                      disabled
                      readOnly
                      value={ele.region_course_price}
                      placeholder='Country Price'
                    />
                    <span className='smallFont'>Country Price</span>
                  </label>
                  <label className='has-float-label my-auto regionalPriceFormInput'>
                    <input
                      className='form-control'
                      name='Discounted Price'
                      type='text'
                      disabled
                      readOnly
                      value={ele.region_discount_price}
                      placeholder='Discounted Price'
                    />
                    <span className='smallFont'>Discounted Price</span>
                  </label>
                  <label className='has-float-label my-auto regionalPriceFormInput'>
                    <input
                      className='form-control'
                      name='Currency'
                      type='text'
                      disabled
                      readOnly
                      value={ele.currency_code}
                      placeholder='Currency'
                    />
                    <span>Currrency</span>
                  </label>
                  <div style={{ color: 'gray' }} className='d-flex align-items-center mx-2'>
                    saved
                  </div>
                  <div
                    onClick={() => deletedObjectfromPriceArray(ele)}
                    onKeyPress={() => deletedObjectfromPriceArray(ele)}
                    tabIndex={-1}
                    role='button'
                    className='d-flex align-items-center mx-2 saveDelBtns'
                  >
                    <CloseIcon />
                  </div>
                </div>
              );
            })}
            {addMoreClickedStatus === 1 ? (
              <div className='d-flex w-100' style={{ flexFlow: 'wrap' }}>
                <label className='has-float-label my-auto regionalPriceFormInput'>
                  <select
                    className='form-control w-100'
                    name='Country name'
                    onChange={(e) => setSelectedCountry(e.target.value)}
                  >
                    {countries.map((country) => {
                      return <option value={country.country_name}>{country.country_name}</option>;
                    })}
                  </select>
                  <span>Country</span>
                  {validatorSwitch && !selectedCountry ? (
                    <p className='alertTextRegionalPrice'>* Please select a country</p>
                  ) : null}
                </label>
                <label className='has-float-label my-auto regionalPriceFormInput'>
                  <select
                    className='form-control w-100'
                    name='State name'
                    onChange={(e) => setSelectedState(e.target.value)}
                  >
                    <option value='all states' selected>
                      All States
                    </option>
                    {states.map((state) => {
                      return <option value={state.state_name}>{state.state_name}</option>;
                    })}
                  </select>
                  <span>State</span>
                  {validatorSwitch && !selectedState ? (
                    <p className='alertTextRegionalPrice'>* Please select a state</p>
                  ) : null}
                </label>
                <label className='has-float-label my-auto regionalPriceFormInput'>
                  <input
                    className='form-control'
                    name='Country Price'
                    type='text'
                    value={enteredRegionCoursePrice}
                    placeholder='Country Price'
                    onChange={(e) => setEnteredRegionCoursePrice(e.target.value)}
                  />
                  <span className='smallFont'>Country Price</span>
                  {validatorSwitch &&
                  isNaN(enteredRegionCoursePrice) &&
                  enteredRegionCoursePrice !== '' ? (
                    <p className='alertTextRegionalPrice'>* Please enter a valid price</p>
                  ) : null}
                </label>
                <label className='has-float-label my-auto regionalPriceFormInput'>
                  <input
                    className='form-control'
                    name='Discounted Price'
                    type='text'
                    value={enteredRegionDiscountPrice}
                    placeholder='Discounted Price'
                    onChange={(e) => setEnteredRegionDiscountPrice(e.target.value)}
                  />
                  <span className='smallFont'>Discounted Price</span>
                  {validatorSwitch &&
                  isNaN(enteredRegionDiscountPrice) &&
                  enteredRegionDiscountPrice !== '' ? (
                    <p className='alertTextRegionalPrice'>* Please enter a valid price</p>
                  ) : null}
                </label>

                <label className='has-float-label my-auto regionalPriceFormInput'>
                  <select
                    className='form-control w-100'
                    name='Currency'
                    onChange={(e) => setSelectedCurrencyCode(e.target.value)}
                  >
                    <option value='INR'>Indian Rupee (INR ₹)</option>
                    {currencies.map((curr) => {
                      return (
                        <option value={curr.code}>
                          {curr.name} ({curr.code} {curr.symbol})
                        </option>
                      );
                    })}
                  </select>
                  <span>Currrency</span>
                  {validatorSwitch && !selectedCurrencyCode ? (
                    <p className='alertTextRegionalPrice'>* Please select a currency</p>
                  ) : null}
                </label>
                <div
                  onClick={updatePricesArrayHandler}
                  onKeyPress={updatePricesArrayHandler}
                  role='button'
                  tabIndex={-1}
                  className='d-flex align-items-center mx-2 saveDelBtns'
                  style={{ maxHeight: '42px' }}
                >
                  save
                </div>
              </div>
            ) : null}
            <div className='d-flex w-100'>
              <div
                onClick={addMoreClicked}
                onKeyPress={addMoreClicked}
                tabIndex={-1}
                role='button'
                className='Courses__addRegionalPriceButton mt-0'
              >
                + Add More
              </div>
            </div>
            <div className='w-100 d-flex justify-content-end'>
              <div
                onClick={addCourseRegionalPrices}
                onKeyPress={addCourseRegionalPrices}
                tabIndex={-1}
                role='button'
                className='Courses__addRegionalPriceButtonFilled mt-1'
              >
                Save prices
              </div>
            </div>
          </Row>
        ) : null}
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
        <Row className='justify-content-center mx-2'>
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
                      {elem.coupon_type === 'price' ? (
                        <span className='Courses__rupeeAmount'>
                          {`${
                            currencies.find((ele) => ele.code === elem.coupon_currency)?.symbol
                          } ${elem.price}`}
                        </span>
                      ) : (
                        <span className='Courses__rupeeAmount'>{`${elem.price}%`}</span>
                      )}
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
          <Row className='text-right mx-2 w-100'>
            <Col>
              {seeMore ? (
                <Button variant='boldTextSecondary' onClick={fetchMoreCoupons}>
                  See more <KeyboardArrowDown />
                </Button>
              ) : null}
            </Col>
          </Row>
        </Row>

        {!isNewCoupon && (
          <Row className='w-50 m-2'>
            <Button
              variant='courseBlueOnWhite'
              className='p-1 mx-2 my-auto'
              onClick={() => setIsNewCoupon(true)}
            >
              <span style={{ fontSize: '18px' }} className='my-auto'>
                +
              </span>
              <span className='my-auto ml-2'>Add Coupon</span>
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

            <div className='m-2'>
              <p className='mb-0 Courses__tinySubHeading'>Coupon Type:</p>
              <div className='d-block d-sm-flex'>
                <Form.Check
                  type='radio'
                  // defaultChecked
                  className='mr-3'
                  id={newCouponType === 'price' ? 'forever' : 'limited'}
                  label='Price'
                  value='price'
                  checked={newCouponType === 'price'}
                  name='Price'
                  onChange={(e) => setNewCouponType(e.target.value)}
                />
                <Form.Check
                  type='radio'
                  id={newCouponType === 'percent' ? 'forever' : 'limited'}
                  label='Percent'
                  value='percent'
                  checked={newCouponType === 'percent'}
                  name='Percent'
                  onChange={(e) => setNewCouponType(e.target.value)}
                />
              </div>
            </div>
            <Row className='m-2 mt-3 justify-content-center'>
              <Col className='pl-0'>
                {newCouponType === 'price' ? (
                  <label className='has-float-label my-auto w-100'>
                    <select
                      className='form-control w-100'
                      name='Coupon Currency'
                      style={{ maxHeight: '32px' }}
                      onChange={(e) => setNewCouponCurrency(e.target.value)}
                    >
                      <option value='INR'>Indian Rupee (INR ₹)</option>
                      {currencies.map((curr) => {
                        return (
                          <option value={curr.code}>
                            {curr.name} ({curr.code} {curr.symbol})
                          </option>
                        );
                      })}
                    </select>
                    <span>Coupon Currrency</span>
                  </label>
                ) : (
                  <label className='has-float-label my-auto w-100'>
                    <input
                      className='form-control'
                      name='Percent'
                      type='text'
                      readOnly
                      value='Percent (%)'
                      placeholder='Percent (%)'
                      onChange={(e) => setNewCouponAmount(e.target.value)}
                    />
                    <span>Percent</span>
                  </label>
                )}
              </Col>
              <Col className='pr-0'>
                {newCouponType === 'price' ? (
                  <label className='has-float-label my-auto w-100'>
                    <input
                      className='form-control'
                      name='Amount'
                      type='number'
                      value={newCouponAmount}
                      placeholder='Amount'
                      onChange={(e) => setNewCouponAmount(e.target.value)}
                    />
                    <span>Amount</span>
                  </label>
                ) : (
                  <label className='has-float-label my-auto w-100'>
                    <div className='valuePadding'>%</div>
                    <input
                      className='form-control'
                      name='Enter Percentage'
                      type='number'
                      max={100}
                      min={0}
                      value={newCouponAmount}
                      placeholder='percent'
                      onChange={(e) => {
                        setNewCouponAmount(e.target.value);
                      }}
                    />
                    <span>Enter Percentage</span>
                  </label>
                )}
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
                {`${
                  couponInfo.coupon_type === 'price'
                    ? codes.find((ele) => ele.currency_code == couponInfo.coupon_currency)
                        .currency_symbol
                    : ''
                } ${couponInfo.price} ${couponInfo.coupon_type === 'percent' ? '%' : ''}`}
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
  currencySymbol: PropTypes.string.isRequired,
  clientUserId: PropTypes.number.isRequired,
  isRegional: PropTypes.bool.isRequired,
  priceArray: PropTypes.instanceOf(Array).isRequired,
  paymentGateway: PropTypes.string.isRequired,
};

Price.defaultProps = {
  coursePrice: 0,
  discountPrice: 0,
};
