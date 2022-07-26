import React, { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import fromUnixTime from 'date-fns/fromUnixTime';
import AddIcon from '@material-ui/icons/Add';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import format from 'date-fns/format';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import {
  getfeeOneTimePlanArray,
  getfeeMonthlyPlanArray,
  getfeeCustomPlanArray,
  getfeePlanType,
  getFeeClientUserId,
} from '../../redux/reducers/fees.reducer';
import { getCurrentBranding } from '../../redux/reducers/branding.reducer';
import { getClientUserId } from '../../redux/reducers/clientUserId.reducer';
import { PageHeader } from '../Common';
import MonthlyCustomPlan from './MonthlyCustomPlan';
import { feeActions } from '../../redux/actions/fees.actions';
import './Fees.scss';
import { apiValidation, get, post } from '../../Utilities';
import OneTimeCharge from './OneTimeCharge';

const EditFeePlan = (props) => {
  const {
    feePlanType,
    feeMonthlyPlanArray,
    feeCustomPlanArray,
    feeOneTimePlanArray,
    setFeeStudentClientUserIdToStore,
    setFeeCustomPlanArrayToStore,
    setFeeMonthlyPlanArrayToStore,
    setFeeOneTimePlanArrayToStore,
    clientUserID,
    feeStudentCLientUserID,
    history,
    currentbranding: {
      branding: { currency_code: currencyCode, currency_symbol: currencySymbol },
    },
  } = props;
  const [noOfInstallments, setNoOfInstallments] = useState(feeCustomPlanArray.length);
  const [oneTimePlanArray, setOneTimePlanArray] = useState([...feeOneTimePlanArray]);
  const [monthlyOrCustom, setMonthlyOrCustom] = useState(feePlanType);
  const [feeTags, setFeeTags] = useState([]);
  const [monthlyFeeAmount, setMonthlyFeeAmount] = useState(0);
  const [monthlyFeeDate, setMonthlyFeeDate] = useState(new Date());
  const [customFeePlanArray, setCustomFeePlanArray] = useState(
    feeCustomPlanArray.length === 0
      ? [
          {
            id: 0,
            amount: 0,
            due_date: parseInt((new Date().getTime() / 1000).toFixed(0), 10),
            date: new Date(),
            isRead: true,
            status: 'due',
          },
        ]
      : [...feeCustomPlanArray],
  );
  const [minNoOfInstallments, setMinNoOfInstallments] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const handlePlanSummaryShow = () => setShowModal(true);
  const handlePlanSummaryClose = () => setShowModal(false);

  useEffect(() => {
    console.log(history.location.state.client_user_id, 'history bro');
    get({ client_user_id: history.location.state.client_user_id }, '/getFeeDataForStudent').then(
      (res) => {
        const result = apiValidation(res);
        console.log(result, 'safdfafafsgs');
      },
    );
  }, []);

  useEffect(() => {
    console.log(feeCustomPlanArray, 'custom');
    console.log(feeMonthlyPlanArray, 'month');
    console.log(feeOneTimePlanArray, 'onetime');
    const minInstallments = feeCustomPlanArray.filter((e) => e.status !== 'due').length;
    setMinNoOfInstallments(minInstallments);
    if (feePlanType === 'Custom') {
      const modCustomPlan = feeCustomPlanArray.map((e, i) => {
        e.id = i;
        e.date = fromUnixTime(parseInt(e.due_date, 10));
        e.isRead = true;
        return e;
      });

      setCustomFeePlanArray(modCustomPlan);
    } else if (feeMonthlyPlanArray.length > 0) {
      setMonthlyFeeAmount(feeMonthlyPlanArray[0].amount);
      setMonthlyFeeDate(fromUnixTime(parseInt(feeMonthlyPlanArray[0].due_date, 10)));
    }

    const newOnetimeArray = feeOneTimePlanArray.map((e) => {
      delete e.due_date;
      return e;
    });
    setOneTimePlanArray(newOnetimeArray);
  }, [feeCustomPlanArray, feeMonthlyPlanArray, feePlanType, feeOneTimePlanArray, clientUserID]);

  useEffect(() => {
    console.log(history, 'history');
    get(null, '/getFeeTags').then((res) => {
      console.log(res);
      const result = apiValidation(res);
      setFeeTags(result);
    });
  }, [history]);

  const planDeleted = () => {
    console.log('lulz');
    setMonthlyFeeAmount(0);
    setMonthlyFeeDate(new Date());
    setCustomFeePlanArray([]);
  };

  const addFeePlan = () => {
    setCustomFeePlanArray([
      {
        id: 0,
        amount: 0,
        due_date: parseInt((new Date().getTime() / 1000).toFixed(0), 10),
        date: new Date(),
        isRead: true,
        status: 'due',
      },
    ]);
    setMonthlyOrCustom('Custom');
    setMinNoOfInstallments(1);
    setNoOfInstallments(1);
  };

  const editTagName = (id, value) => {
    const updatedAmount = oneTimePlanArray.map((e) => {
      if (e.user_fee_id === id) {
        e.fee_tag = value;
        e.name = value;
      }
      return e;
    });

    setOneTimePlanArray(updatedAmount);
  };

  const editTagAmount = (id, value) => {
    const updatedAmount = oneTimePlanArray.map((e) => {
      if (e.user_fee_id === id) {
        e.amount = value;
      }
      return e;
    });

    setOneTimePlanArray(updatedAmount);
  };

  const addOneTimeCharge = () => {
    const addOneTimeChargeArray = [...oneTimePlanArray];

    addOneTimeChargeArray.push({
      status: 'due',
      amount: 0,
      user_fee_id: oneTimePlanArray.length,
      fee_tag: 'Registration',
    });

    setOneTimePlanArray(addOneTimeChargeArray);
  };

  const saveChanges = () => {
    const planArray =
      monthlyOrCustom === 'Custom'
        ? customFeePlanArray
        : [
            {
              amount: monthlyFeeAmount,
              due_date: Math.round(monthlyFeeDate.getTime() / 1000),
              status: 'due',
            },
          ];
    const payload = {
      client_user_id: feeStudentCLientUserID,
      plan_array: JSON.stringify(planArray),
      one_time_array: JSON.stringify(oneTimePlanArray),
      plan_type: monthlyOrCustom === 'Monthly' ? 'monthly' : 'custom',
    };
    console.log(oneTimePlanArray);
    console.log(customFeePlanArray, 'fkfgjk');
    console.log(payload, 'payload');
    history.push('/teacherfees');
    post(payload, '/editFeeDataOfUser').then((res) => {
      console.log(res);
    });
  };

  const removeDefaultRegistration = () => {
    setOneTimePlanArray([]);
  };
  return (
    <>
      <PageHeader title='Edit Fee Plans' />
      <div style={{ marginTop: '4rem' }}>
        {customFeePlanArray.length > 0 || parseInt(monthlyFeeAmount, 10) > 0 ? (
          <MonthlyCustomPlan
            monthlyFeeAmount={monthlyFeeAmount}
            currencySymbol={currencySymbol}
            setMonthlyFeeAmount={setMonthlyFeeAmount}
            monthlyFeeDate={monthlyFeeDate}
            setMonthlyFeeDate={setMonthlyFeeDate}
            noOfInstallments={noOfInstallments}
            setNoOfInstallments={setNoOfInstallments}
            customFeePlanArray={customFeePlanArray}
            setCustomFeePlanArray={setCustomFeePlanArray}
            activeTab={monthlyOrCustom}
            changeTab={setMonthlyOrCustom}
            minNoOfInstallments={minNoOfInstallments}
            EditFeePlan
            planDeleted={planDeleted}
          />
        ) : (
          <Card
            style={{ boxShadow: '0px 1px 3px 0px rgba(0,0,0,0.16)', borderRadius: '10px' }}
            className='m-2 p-2 d-flex'
            onClick={() => addFeePlan()}
          >
            <p className='mb-0'>
              <span style={{ verticalAlign: 'middle' }}>
                <AddIcon />
              </span>{' '}
              <span style={{ verticalAlign: 'bottom', fontFamily: 'Montserrat-Regular' }}>
                Add Fee Plan
              </span>
            </p>
          </Card>
        )}

        <p
          style={{
            fontFamily: 'Montserrat-Medium',
            fontSize: '10px',
            lineHeight: '13px',
            color: 'rgba(0, 0, 0, 0.54)',
            textAlign: 'center',
          }}
          className='m-3'
        >
          One time charges
        </p>

        {oneTimePlanArray.map((elem) => {
          return (
            <OneTimeCharge
              tagAmount={elem.amount}
              tagName={elem.fee_tag}
              tags={feeTags}
              EditFeePlan
              status={elem.status}
              setTagAmount={editTagAmount}
              setTagName={editTagName}
              id={elem.user_fee_id}
              removeDefaultRegistration={removeDefaultRegistration}
            />
          );
        })}

        <Card
          style={{ boxShadow: '0px 1px 3px 0px rgba(0,0,0,0.16)', borderRadius: '10px' }}
          className='m-2 p-2 d-flex'
          onClick={() => addOneTimeCharge()}
        >
          <p className='mb-0'>
            <span style={{ verticalAlign: 'middle' }}>
              <AddIcon />
            </span>{' '}
            <span style={{ verticalAlign: 'bottom', fontFamily: 'Montserrat-Regular' }}>
              Add One Time Charge
            </span>
          </p>
        </Card>
        <Row className='m-2 py-3 justify-content-center'>
          <Button variant='customPrimary' onClick={() => handlePlanSummaryShow()}>
            Next
          </Button>
        </Row>
      </div>

      <Modal show={showModal} onHide={handlePlanSummaryClose} centered keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>Plan Summary</Modal.Title>
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
              {monthlyOrCustom === 'Custom' ? (
                customFeePlanArray.map((elem, i) => {
                  return (
                    <Row key={elem.user_fee_id} className='mx-0 w-100 my-2'>
                      <Col className='Fees__planInfoDetails p-0 text-center'>{i + 1}</Col>
                      <Col className='Fees__planInfoDetails p-0 text-center'>
                        {elem.due_date
                          ? format(fromUnixTime(parseInt(elem.due_date, 10)), 'dd-MMM-yyyy')
                          : '-'}
                      </Col>
                      <Col className='Fees__planInfoDetails p-0 text-center'>
                        {`${currencySymbol} ${elem.amount}`}
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
                })
              ) : (
                <Row className='mx-0 w-100 my-2'>
                  <Col className='Fees__planInfoDetails p-0 text-center'>1</Col>
                  <Col className='Fees__planInfoDetails p-0 text-center'>
                    {format(monthlyFeeDate, 'dd-MMM-yyyy')}
                  </Col>
                  <Col className='Fees__planInfoDetails p-0 text-center'>
                    {`${currencySymbol} ${monthlyFeeAmount}`}
                  </Col>
                  <Col
                    className='Fees__planInfoDetails p-0 text-center'
                    style={{ color: ' rgba(255, 0, 0, 0.87)' }}
                  >
                    DUE
                  </Col>
                </Row>
              )}
            </Row>
            <Row className='justify-content-end p-3 mx-0' style={{ background: '#F3F3F3' }}>
              <span className='Fees__planInfoTotal mr-2'>Total</span>
              <span className='Fees__planInfoTotalFees'>
                {`${currencySymbol} `}
                {monthlyOrCustom === 'Custom'
                  ? customFeePlanArray.reduce((acc, val) => {
                      return acc + parseInt(val.amount, 10);
                    }, 0)
                  : monthlyFeeAmount}
              </span>
            </Row>

            <p className='Fees__planInfoHeading mt-4 ml-4'>Add-on:</p>
            <Row className='mx-0 my-2'>
              {oneTimePlanArray.map((elem, i) => {
                return (
                  <Row key={elem.user_fee_id} className='mx-0 w-100 my-2'>
                    <Col className='Fees__planInfoDetails p-0 text-center'>{i + 1}</Col>
                    <Col className='Fees__planInfoDetails p-0 text-center'>{elem.fee_tag}</Col>
                    <Col className='Fees__planInfoDetails p-0 text-center'>
                      {`${currencySymbol} ${elem.amount}`}
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
            <Row className='m-2 justify-content-center'>
              <Button variant='customPrimarySmol' onClick={saveChanges}>
                Save Changes
              </Button>
            </Row>
          </Card>
        </Modal.Body>
      </Modal>
    </>
  );
};

const mapStateToProps = (state) => ({
  feePlanType: getfeePlanType(state),
  feeMonthlyPlanArray: getfeeMonthlyPlanArray(state),
  feeCustomPlanArray: getfeeCustomPlanArray(state),
  feeOneTimePlanArray: getfeeOneTimePlanArray(state),
  currentbranding: getCurrentBranding(state),
  clientUserID: getClientUserId(state),
  feeStudentCLientUserID: getFeeClientUserId(state),
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

export default connect(mapStateToProps, mapDispatchToProps)(EditFeePlan);

EditFeePlan.propTypes = {
  feeMonthlyPlanArray: PropTypes.instanceOf(Array).isRequired,
  feeCustomPlanArray: PropTypes.instanceOf(Array).isRequired,
  feeOneTimePlanArray: PropTypes.instanceOf(Array).isRequired,
  feePlanType: PropTypes.string.isRequired,
  setFeeOneTimePlanArrayToStore: PropTypes.func.isRequired,
  setFeeMonthlyPlanArrayToStore: PropTypes.func.isRequired,
  setFeeCustomPlanArrayToStore: PropTypes.func.isRequired,
  setFeeStudentClientUserIdToStore: PropTypes.func.isRequired,
  clientUserID: PropTypes.number.isRequired,
  history: PropTypes.instanceOf(Object).isRequired,
  feeStudentCLientUserID: PropTypes.number.isRequired,
  currentbranding: PropTypes.shape({
    branding: PropTypes.shape({
      currency_code: PropTypes.string,
      currency_symbol: PropTypes.string,
    }),
  }).isRequired,
};
