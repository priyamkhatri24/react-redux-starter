import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import PhoneIcon from '@material-ui/icons/Phone';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import EditIcon from '@material-ui/icons/Edit';
import Button from 'react-bootstrap/Button';
import format from 'date-fns/format';
import fromUnixTime from 'date-fns/fromUnixTime';
import { apiValidation, get, post } from '../../Utilities';
import { BackButton } from '../Common';
import avatarImage from '../../assets/images/avatarImage.jpg';
import FeesCard from './FeesCard';
import './Fees.scss';
import '../Common/ScrollableCards/ScrollableCards.scss';
import { getClientUserId, getClientId } from '../../redux/reducers/clientUserId.reducer';
import { feeActions } from '../../redux/actions/fees.actions';

const StudentFee = (props) => {
  const {
    history,
    clientId,
    clientUserId,
    setFeeStudentClientUserIdToStore,
    setFeePlanTypeToStore,
    setFeeMonthlyPlanArrayToStore,
    setFeeCustomPlanArrayToStore,
    setFeeOneTimePlanArrayToStore,
  } = props;
  const [fees, setFees] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const [showRecordPaymentModal, setShowRecordPaymentModal] = useState(false);
  const [replaceOptions, setOptions] = useState('');
  const [paymentsummary, setPaymentSummary] = useState({});
  const handleRecordPaymentClose = () => setShowRecordPaymentModal(false);
  const handleRecordPaymentOpen = () => setShowRecordPaymentModal(true);

  const getFeeData = useCallback(() => {
    get(
      { client_user_id: history.location.state.studentData.client_user_id },
      '/getFeeDataForStudent',
    ).then((res) => {
      const result = apiValidation(res);
      setFees(result);
      console.log(result, 'feeresult');
      setFeePlanTypeToStore(result.plan_type === 'custom' ? 'Custom' : 'Monthly');
      console.log('wtf');
      setFeeOneTimePlanArrayToStore(result.one_time_plan_array);
      if (result.plan_type === 'custom') {
        setFeeCustomPlanArrayToStore(result.plan_array);
      } else {
        setFeeMonthlyPlanArrayToStore(result.plan_array);
        console.log('ghia');
      }
      setFeeStudentClientUserIdToStore(history.location.state.studentData.client_user_id);
    });
  }, [
    history,
    setFeeStudentClientUserIdToStore,
    setFeeCustomPlanArrayToStore,
    setFeePlanTypeToStore,
    setFeeMonthlyPlanArrayToStore,
    setFeeOneTimePlanArrayToStore,
  ]);

  useEffect(() => {
    getFeeData();
  }, [getFeeData]);

  const goToOrderDetails = (order) => {
    history.push({ pathname: '/order', state: { order } });
  };

  const recordPayment = () => {
    const result = fees.fee_data.find((e) => e.status === 'due');
    setPaymentSummary(result);
    handleRecordPaymentOpen();
  };

  const makePayment = () => {
    const payload = {
      user_fee_id: paymentsummary.user_fee_id,
      fee_order_id: paymentsummary.fee_order_id,
      client_user_id: clientUserId,
      status: replaceOptions,
    };

    post(payload, '/waiveFeeOfStudent').then((res) => {
      if (res.success) {
        getFeeData();
        handleRecordPaymentClose();
      }
    });
  };

  const goToEditFeePlan = () => {
    // eslint-disable-next-line max-len
    history.push({
      pathname: '/fees/edit/studentfeeplan',
      state: { client_user_id: history.location.state.studentData.client_user_id },
    });
  };

  return (
    <div className='Fees'>
      <div className='Fees__nav'>
        <Row className=' m-0 px-4 pt-3 '>
          <div className='mt-2 mx-1 mx-lg-4'>
            <BackButton />
          </div>
          <div className='m-1 '>
            <img
              src={
                history.location.state.studentData.profile_image
                  ? history.location.state.studentData.profile_image
                  : avatarImage
              }
              alt='avatar'
              height='38'
              width='38'
              className='Fees__avatar'
            />
          </div>
          <div className='p-0'>
            <p className='Fees__avatarHeading mb-0 mt-2 ml-2'>
              {`${history.location.state.studentData.first_name}
             ${history.location.state.studentData.last_name}`}
            </p>
            <p className='Fees__avatarStatus'>
              <PhoneIcon className='Fees__onlineIcon' />
              +91-{history.location.state.studentData.contact}
            </p>
          </div>
          <div className='ml-auto'>
            <MoreVertIcon />
          </div>
        </Row>
        <div className='Fees_navStatusContainer'>
          <Row className='mx-2 px-4 Fees__navStatus'>
            Status:
            <span className='ml-1'>{fees.fee_status}</span>
            <Button variant='customSecondary' className='ml-auto' onClick={() => handleShow()}>
              Plan Info
            </Button>
          </Row>
          <p className='Fees__navStatus mx-2 px-4'>
            <span>Due Amount: {fees.due_amount}</span>
          </p>
        </div>
        <div className='Fees__overlay'>
          {Object.keys(fees).length > 0 &&
            fees.fee_data.map((elem) => {
              return (
                <FeesCard
                  data={elem}
                  key={elem.user_fee_id}
                  clientId={clientId}
                  goToOrderDetails={goToOrderDetails}
                  studentFeeCard
                />
              );
            })}
        </div>
        <footer className='Fees__footer text-center'>
          {fees.due_amount > 0 ? (
            <Button
              variant='customPrimary'
              className='mt-4 Fees__PayButton'
              onClick={() => recordPayment()}
            >
              Record Payment
            </Button>
          ) : (
            <p className='text-center'>No dues</p>
          )}
        </footer>
      </div>

      <Modal show={showModal} onHide={handleClose} centered keyboard={false}>
        <Modal.Header>
          <Modal.Title>Plan Summary</Modal.Title>
          <span
            className='ml-auto my-auto'
            onClick={() => goToEditFeePlan()}
            onKeyDown={() => goToEditFeePlan()}
            role='button'
            tabIndex='-1'
          >
            <EditIcon />
          </span>
        </Modal.Header>
        <Modal.Body>
          <Card>
            <Row className='mx-0 my-3'>
              <Col className='Fees__planInfoHeading p-0 text-center' xs={3} />
              <Col className='Fees__planInfoHeading p-0 text-center' xs={3}>
                Due Date
              </Col>
              <Col className='Fees__planInfoHeading p-0 text-center' xs={3}>
                Installment
              </Col>
              <Col className='Fees__planInfoHeading p-0 text-center' xs={3} />
              {Object.keys(fees).length &&
                fees.plan_array.map((elem, i) => {
                  return (
                    <Row key={elem.user_fee_id} className='mx-0 w-100 my-2'>
                      <Col className='Fees__planInfoDetails p-0 text-center'>{i + 1}</Col>
                      <Col className='Fees__planInfoDetails p-0 text-center'>
                        {format(fromUnixTime(parseInt(elem.due_date, 10)), 'dd-MMM-yyyy')}
                      </Col>
                      <Col className='Fees__planInfoDetails p-0 text-center'>
                        &#x20b9; {elem.amount}
                      </Col>
                      <Col
                        className='Fees__planInfoDetails p-0 text-center'
                        style={
                          elem.status === 'due'
                            ? { color: ' rgba(255, 0, 0, 0.87)' }
                            : { color: ' rgba(58, 255, 0, 0.87)' }
                        }
                      >
                        {elem.status.toUpperCase()}
                      </Col>
                    </Row>
                  );
                })}
            </Row>
            <Row className='justify-content-end p-3 mx-0' style={{ background: '#F3F3F3' }}>
              <span className='Fees__planInfoTotal mr-2'>Total</span>
              <span className='Fees__planInfoTotalFees'>&#x20b9; {fees.due_amount}</span>
            </Row>

            <p className='Fees__planInfoHeading mt-4 ml-4'>Add-on:</p>
            <Row className='mx-0 my-2'>
              {Object.keys(fees).length &&
                fees.one_time_plan_array.map((elem, i) => {
                  return (
                    <Row key={elem.user_fee_id} className='mx-0 w-100 my-2'>
                      <Col className='Fees__planInfoDetails p-0 text-center'>{i + 1}</Col>
                      <Col className='Fees__planInfoDetails p-0 text-center'>{elem.fee_tag}</Col>
                      <Col className='Fees__planInfoDetails p-0 text-center'>
                        &#x20b9; {elem.amount}
                      </Col>
                      <Col
                        className='Fees__planInfoDetails p-0 text-center'
                        style={
                          elem.status === 'due'
                            ? { color: ' rgba(255, 0, 0, 0.87)' }
                            : { color: ' rgba(58, 255, 0, 0.87)' }
                        }
                      >
                        {elem.status.toUpperCase()}
                      </Col>
                    </Row>
                  );
                })}
            </Row>
          </Card>
        </Modal.Body>
      </Modal>

      <Modal show={showRecordPaymentModal} onHide={handleRecordPaymentClose} centered>
        <Modal.Body>
          <p className='Scrollable__recentlyUsed m-2'>Payment Summary:</p>
          <Card>
            <Row className='m-2'>
              <span className='Scrollable__feecardHeading m-2 mb-0'>{paymentsummary.fee_tag}</span>{' '}
              <span
                className='ml-auto Scrollable__feecardHeading mx-2 mt-2 mb-0 '
                style={{ color: 'var(--primary-blue)' }}
              >
                &#8377; {paymentsummary.amount}
              </span>
            </Row>
          </Card>

          <p className='Scrollable__recentlyUsed m-2'>Record Payment:</p>
          <Form className='Enquiry__form mt-3 mr-4 '>
            <div className='mb-3'>
              <Form.Check
                type='radio'
                id='feePlanReplace'
                label='Mark as paid'
                value='marked'
                name='feePlan'
                onChange={(e) => setOptions(e.target.value)}
              />

              <Form.Check
                type='radio'
                label='Mark as waived'
                id='feePlanNoReplace'
                value='waived'
                name='feePlan'
                onChange={(e) => setOptions(e.target.value)}
              />
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='boldTextSecondary' onClick={() => handleRecordPaymentClose()}>
            Cancel
          </Button>
          <Button variant='boldText' onClick={() => makePayment()}>
            Record
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

const mapStateToProps = (state) => ({
  clientId: getClientId(state),
  clientUserId: getClientUserId(state),
});

const mapDispatchToProps = (dispatch) => {
  return {
    setFeeStudentClientUserIdToStore: (payload) => {
      dispatch(feeActions.setFeeStudentClientUserIdToStore(payload));
    },
    setFeeMonthlyPlanArrayToStore: (payload) => {
      dispatch(feeActions.setFeeMonthlyPlanArrayToStore(payload));
    },
    setFeeCustomPlanArrayToStore: (payload) => {
      dispatch(feeActions.setFeeCustomPlanArrayToStore(payload));
    },
    setFeeOneTimePlanArrayToStore: (payload) => {
      dispatch(feeActions.setFeeOneTimePlanArrayToStore(payload));
    },
    setFeePlanTypeToStore: (payload) => {
      dispatch(feeActions.setFeePlanTypeToStore(payload));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(StudentFee);

StudentFee.propTypes = {
  history: PropTypes.instanceOf(Object).isRequired,
  clientId: PropTypes.number.isRequired,
  clientUserId: PropTypes.number.isRequired,
  setFeeOneTimePlanArrayToStore: PropTypes.func.isRequired,
  setFeeCustomPlanArrayToStore: PropTypes.func.isRequired,
  setFeeMonthlyPlanArrayToStore: PropTypes.func.isRequired,
  setFeePlanTypeToStore: PropTypes.func.isRequired,
  setFeeStudentClientUserIdToStore: PropTypes.func.isRequired,
};
