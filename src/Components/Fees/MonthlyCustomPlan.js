import React, { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import Card from 'react-bootstrap/Card';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import ErrorIcon from '@material-ui/icons/Error';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import addDays from 'date-fns/addDays';
import DatePicker from 'react-datepicker';
import '../Live Classes/LiveClasses.scss';
import '../Common/ScrollableCards/ScrollableCards.scss';
import RangeSlider from 'react-bootstrap-range-slider';
import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css';
import './Fees.scss';
import DeleteIcon from '@material-ui/icons/Delete';

const CustomInput = ({ value, onClick }) => (
  <Row className='mx-auto'>
    <label className='w-100 has-float-label  mx-2 my-3'>
      <input
        className='form-control'
        name='Select Date'
        type='text'
        placeholder='Select Date'
        onClick={onClick}
        value={value}
      />
      <span>Select Date</span>
      {/* <i className='LiveClasses__show'>
        <ExpandMoreIcon />
      </i> */}
    </label>
  </Row>
);

const MonthlyCustomPlan = (props) => {
  const {
    monthlyFeeAmount,
    setMonthlyFeeAmount,
    monthlyFeeDate,
    setMonthlyFeeDate,
    noOfInstallments,
    setNoOfInstallments,
    customFeePlanArray,
    setCustomFeePlanArray,
    activeTab,
    changeTab,
    EditFeePlan,
    minNoOfInstallments,
    currencySymbol,
    planDeleted,
  } = props;

  const generateInstallments = useCallback(() => {
    const tempArray = [...customFeePlanArray];

    if (noOfInstallments >= customFeePlanArray.length) {
      const noOfElems = noOfInstallments - customFeePlanArray.length;
      let idIndex = customFeePlanArray.length;
      for (let i = 0; i < noOfElems; i++) {
        tempArray.push({
          id: idIndex,
          amount: 0,
          due_date: customFeePlanArray[customFeePlanArray.length - 1].due_date,
          date: customFeePlanArray[customFeePlanArray.length - 1].date,
          isRead: false,
          status: 'due',
        });
        idIndex += 1;
      }
      tempArray.length = noOfInstallments;
    } else {
      tempArray.length = noOfInstallments;
    }

    setCustomFeePlanArray(tempArray);
  }, [setCustomFeePlanArray, noOfInstallments]);

  useEffect(() => {
    generateInstallments();
  }, [generateInstallments]);

  return (
    <Card
      style={{ boxShadow: '0px 1px 3px 0px rgba(0,0,0,0.16)', borderRadius: '10px' }}
      className='m-2 pt-4 px-2'
    >
      <h4 style={{ fontFamily: 'Montserrat-Medium' }} className='w-100 text-center mb-3'>
        Create a new plan
      </h4>
      <Tabs
        defaultActiveKey={activeTab}
        activeKey={activeTab}
        justify
        style={{ fontSize: '12px' }}
        bsPrefix='nav feeNav'
        onSelect={changeTab}
      >
        <Tab eventKey='Monthly' title='Monthly' onClick={() => changeTab('Monthly')}>
          <div className='my-5'>
            <label className='has-float-label mx-2 my-3'>
              <input
                className='form-control'
                name='Enter amount'
                type='number'
                placeholder='Enter amount'
                value={monthlyFeeAmount}
                onChange={(e) => setMonthlyFeeAmount(e.target.value)}
              />
              <span>Enter amount</span>
            </label>
            <Row className='mx-auto w-100 Fees__datePicker'>
              <DatePicker
                minDate={addDays(new Date(), 1)}
                selected={monthlyFeeDate}
                dateFormat='dd/MM/yyyy'
                onChange={(date) => {
                  setMonthlyFeeDate(date);
                }}
                customInput={<CustomInput />}
                className='w-100'
              />
            </Row>
            <p className='Fees__smallNotification text-center my-auto'>
              <ErrorIcon style={{ fontSize: '10px' }} /> Student will be notified on this date of
              every month
            </p>
          </div>
        </Tab>
        <Tab eventKey='Custom' title='Custom' className='mt-5' onClick={() => changeTab('Custom')}>
          <p
            className='Scrollable__feecardHeading m-2 text-center'
            style={{ fontFamily: 'Montserrat-Regular' }}
          >
            Select number of installments
          </p>
          <div className='m-2 p-4'>
            <RangeSlider
              max={11}
              min={minNoOfInstallments}
              value={noOfInstallments}
              onChange={(e) => setNoOfInstallments(e.target.value)}
              tooltip='on'
            />
          </div>
          {customFeePlanArray.map((elem, i) => {
            return (
              <div key={elem.key}>
                <p
                  className='Scrollable__feecardHeading m-2'
                  style={{ fontFamily: 'Montserrat-Regular' }}
                >
                  Installment {i + 1}
                </p>
                <Row
                  style={
                    EditFeePlan && elem.status !== 'due'
                      ? {
                          pointerEvents: 'none',
                          backgroundColor: '#3AFF00',
                          opacity: '0.26',
                          margin: 0,
                        }
                      : {}
                  }
                >
                  <Col xs={6} className='Fees__datePickerCol'>
                    <DatePicker
                      minDate={
                        i === 0
                          ? addDays(new Date(), 1)
                          : addDays(customFeePlanArray[i - 1].date, 1)
                      }
                      selected={elem.date}
                      disabled={i === 0 ? false : !customFeePlanArray[i - 1].isRead}
                      dateFormat='dd/MM/yyyy'
                      onChange={(currdate) => {
                        const newFeeAmount = customFeePlanArray.map((element) => {
                          if (element.id === elem.id) {
                            element.date = currdate;
                            element.due_date = parseInt(
                              (new Date().getTime() / 1000).toFixed(0),
                              10,
                            );
                            elem.isRead = true;
                          }
                          return element;
                        });
                        setCustomFeePlanArray(newFeeAmount);
                      }}
                      customInput={<CustomInput />}
                      className='w-100'
                    />
                  </Col>
                  <Col xs={6}>
                    <label
                      className='has-float-label mx-2 my-3 Fees__planAmount'
                      style={{ width: 'fit-content' }}
                    >
                      <input
                        className='form-control'
                        name='Enter amount'
                        type='number'
                        placeholder='Enter amount'
                        value={elem.amount}
                        onChange={(e) => {
                          const newFeeAmount = customFeePlanArray.map((element) => {
                            if (element.id === elem.id) element.amount = e.target.value;
                            return element;
                          });
                          setCustomFeePlanArray(newFeeAmount);
                        }}
                      />
                      <span>Enter amount</span>
                    </label>
                  </Col>
                </Row>
              </div>
            );
          })}
          <p
            className='p-2'
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.05)',
              fontFamily: 'Montserrat-Medium',
              lineHeight: '20px',
              fontSize: '14px',
              color: 'rgba(0, 0, 0, 0.87)',
              textAlign: 'right',
            }}
          >
            <span className='ml-auto'>
              {`Total ${currencySymbol} `}
              <span style={{ color: 'var(--primary-blue)' }}>
                {customFeePlanArray.reduce((acc, val) => {
                  return acc + parseInt(val.amount, 10);
                }, 0)}
              </span>
            </span>
          </p>
        </Tab>
      </Tabs>
      {EditFeePlan && (
        <Row
          style={{ color: 'rgba(255, 0, 0, 0.87)', fontFamily: 'Montserrat-SemiBold' }}
          className='m-2'
        >
          <span
            onClick={() => planDeleted()}
            onKeyDown={() => planDeleted()}
            role='button'
            tabIndex='-1'
          >
            <DeleteIcon /> <span className='my-auto'>Delete</span>
          </span>
        </Row>
      )}
    </Card>
  );
};

export default MonthlyCustomPlan;

CustomInput.propTypes = {
  value: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired,
};

MonthlyCustomPlan.propTypes = {
  setMonthlyFeeAmount: PropTypes.func.isRequired,
  monthlyFeeAmount: PropTypes.string.isRequired,
  monthlyFeeDate: PropTypes.instanceOf(Date).isRequired,
  setMonthlyFeeDate: PropTypes.func.isRequired,
  noOfInstallments: PropTypes.number.isRequired,
  setNoOfInstallments: PropTypes.func.isRequired,
  customFeePlanArray: PropTypes.instanceOf(Array).isRequired,
  setCustomFeePlanArray: PropTypes.func.isRequired,
  activeTab: PropTypes.string.isRequired,
  changeTab: PropTypes.func.isRequired,
  EditFeePlan: PropTypes.bool,
  minNoOfInstallments: PropTypes.number,
  currencySymbol: PropTypes.string.isRequired,
  planDeleted: PropTypes.func,
};

MonthlyCustomPlan.defaultProps = {
  EditFeePlan: false,
  minNoOfInstallments: 1,
  planDeleted: () => {},
};
