import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import format from 'date-fns/format';
import fromUnixTime from 'date-fns/fromUnixTime';
import cx from 'classnames';
import { PageHeader } from '../Common';
import checkmark from '../../assets/images/order/icons8-checked.svg';
import caution from '../../assets/images/order/icons8-medium-risk-50.png';
import './Fees.scss';

const FeesOrder = (props) => {
  const {
    history: {
      location: {
        state: { order },
      },
    },
  } = props;

  const statusClass = cx({
    Fees__orderStatus: true,
    Fees__orderGreen:
      order.status === 'marked' || order.status === 'waived' || order.status === 'paid',
    Fees__orderRed: order.status === 'pending' || order.status === 'due',
  });

  return (
    <>
      <PageHeader title='Order Details' />
      {Object.keys(order).length > 0 && (
        <>
          <div style={{ marginTop: '5rem' }} className='text-center'>
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
                : order.status === 'PAID'
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
          <div className='Fees__orderDetailsContainer'>
            <p className='Fees__orderDetailHeading mb-0 ml-3 mt-4'>
              {order.status === 'PAID' ? 'DATE OF PAYMENT' : 'DUE DATE'}
            </p>
            <p className='Fees_orderDetails ml-3'>
              {order.due_date
                ? format(fromUnixTime(parseInt(order.due_date, 10)), 'dd-MMM-yyyy')
                : order.paid_at
                ? format(fromUnixTime(parseInt(order.paid_at, 10)), 'dd-MMM-yyyy')
                : ''}
            </p>
            {order.status === 'PAID' ? (
              <>
                <p className='Fees__orderDetailHeading mb-0 ml-3'>Payment Method:</p>
                <p className='Fees_orderDetails ml-3'>{order.payment_method}</p>
              </>
            ) : null}
            <p className='Fees__orderDetailHeading mb-0 ml-3'>
              TO: {order.coaching_name.toUpperCase()}
            </p>
            <p className='Fees_orderDetails ml-3'>{order.coaching_email}</p>
            {order.status === 'PAID' ? (
              <>
                <p className='Fees__orderDetailHeading mb-0 ml-3'>
                  FROM: {order.student_name.toUpperCase()}
                </p>
                <p className='Fees_orderDetails ml-3'>{order.student_email}</p>
              </>
            ) : null}
          </div>
          {order.status === 'PAID' ? (
            <div className='Fees__footnoteContainer'>
              <p>
                Payments may take upto 3 working days to be reflected in your account. Check your or
                your recipient&apos;s bank statement for the latest status of your transaction.
              </p>
            </div>
          ) : null}
        </>
      )}
    </>
  );
};

export default FeesOrder;

FeesOrder.propTypes = {
  history: PropTypes.shape({
    location: PropTypes.shape({
      state: PropTypes.shape({
        order: PropTypes.instanceOf(Object).isRequired,
      }),
    }),
  }).isRequired,
};
