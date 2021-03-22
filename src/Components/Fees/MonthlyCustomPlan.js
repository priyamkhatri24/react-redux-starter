import React, { useCallback, useEffect, useState } from 'react';
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
  } = props;

  const [newFeeArray, setNewFeeArray] = useState([...customFeePlanArray]);

  const generateInstallments = useCallback(() => {
    const tempArray = [...customFeePlanArray];

    if (noOfInstallments >= customFeePlanArray.length) {
      const noOfElems = noOfInstallments - newFeeArray.length;
      let idIndex = newFeeArray.length;
      console.log(idIndex);
      for (let i = 0; i < noOfElems; i++) {
        tempArray.push({ id: idIndex, amount: 0, due_date: '', date: null, isRead: false });
        idIndex += 1;
      }
      tempArray.length = noOfInstallments;
    } else {
      tempArray.length = noOfInstallments;
    }

    setCustomFeePlanArray(tempArray);
    setNewFeeArray(tempArray);
    console.log(tempArray, 'nik rerender');
  }, [setCustomFeePlanArray, noOfInstallments]);

  useEffect(() => {
    generateInstallments();
    console.log(customFeePlanArray);
  }, [generateInstallments]);

  return (
    <Card
      style={{ boxShadow: '0px 1px 3px 0px rgba(0,0,0,0.16)', borderRadius: '10px' }}
      className='m-2 pt-4 px-2'
    >
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
              min={1}
              value={noOfInstallments}
              onChange={(e) => setNoOfInstallments(e.target.value)}
              tooltip='on'
            />
          </div>
          {newFeeArray.map((elem, i) => {
            return (
              <div key={elem.key}>
                <p
                  className='Scrollable__feecardHeading m-2'
                  style={{ fontFamily: 'Montserrat-Regular' }}
                >
                  Installment {i + 1}
                </p>
                <Row>
                  <Col xs={6}>
                    <DatePicker
                      minDate={
                        i === 0 ? addDays(new Date(), 1) : addDays(newFeeArray[i - 1].date, 1)
                      }
                      selected={elem.date}
                      disabled={i === 0 ? false : !newFeeArray[i - 1].isRead}
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
                    <label className='has-float-label mx-2 my-3'>
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
              Total &#8377;{' '}
              <span style={{ color: 'var(--primary-blue)' }}>
                {newFeeArray.reduce((acc, val) => {
                  return acc + parseInt(val.amount, 10);
                }, 0)}
              </span>
            </span>
          </p>
        </Tab>
      </Tabs>
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
  noOfInstallments: PropTypes.string.isRequired,
  setNoOfInstallments: PropTypes.func.isRequired,
  customFeePlanArray: PropTypes.instanceOf(Array).isRequired,
  setCustomFeePlanArray: PropTypes.func.isRequired,
  activeTab: PropTypes.string.isRequired,
  changeTab: PropTypes.func.isRequired,
};
