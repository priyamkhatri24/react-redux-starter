import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import format from 'date-fns/format';
import fromUnixTime from 'date-fns/fromUnixTime';
import { get, apiValidation } from '../../Utilities';

const FeesCard = (props) => {
  const {
    data: {
      plan_type: PlanType,
      amount,
      status,
      teacher_name: TeacherName,
      name,
      paid_at: paidAt,
      due_date: dueDate,
      user_fee_id: userFeeId,
      order_id: orderId,
    },
    clientId,
    goToOrderDetails,
    studentFeeCard,
  } = props;
  const feesClass = cx({
    Fees__feeCard: true,
    'm-3': true,
    Fees__cardGreen: status === 'marked' || status === 'waived' || status === 'paid',
    Fees__cardRed: status === 'pending' || status === 'due',
    'ml-auto': studentFeeCard
      ? status === 'due' || status === 'pending' || status === 'waived' || status === 'marked'
      : status === 'paid',
    'pt-3': true,
    'text-right': status === 'paid',
  });

  const getOrderDetails = () => {
    const payload = {
      user_fee_id: userFeeId,
      client_id: clientId,
      order_id: orderId,
    };

    get(payload, '/fetchOrderById').then((res) => {
      const result = apiValidation(res);
      goToOrderDetails(result);
    });
  };

  return (
    <div
      className={feesClass}
      onClick={() => getOrderDetails()}
      onKeyDown={() => getOrderDetails()}
      role='button'
      tabIndex='-1'
    >
      <h1 className='Fees__status mb-0 px-3'>
        {status === 'marked'
          ? 'Marked As Paid'
          : status === 'waived'
          ? 'Waived'
          : status === 'paid'
          ? 'Paid'
          : status === 'pending'
          ? 'Pending'
          : 'Due'}
      </h1>
      {(status === 'waived' || status === 'marked') && (
        <h6 className='Fees__teacher px-3'>(by - {TeacherName})</h6>
      )}
      <p className='Fees__amount px-3'> &#x20B9; {amount}</p>
      <p className='Fees__paidAt px-3'>
        {paidAt !== null &&
          `${status}: ${format(fromUnixTime(parseInt(paidAt, 10)), 'HH:mm MMM dd, yyyy')}`}
      </p>
      <div className='text-center Fees__cardFooter w-100 p-1'>
        {dueDate !== null &&
          `${name}${
            PlanType === 'custom' ? format(fromUnixTime(parseInt(dueDate, 10)), 'dd-MMM-yyyy') : ''
          }`}
      </div>
    </div>
  );
};

export default FeesCard;

FeesCard.propTypes = {
  data: PropTypes.instanceOf(Object).isRequired,
  clientId: PropTypes.number.isRequired,
  goToOrderDetails: PropTypes.func.isRequired,
  studentFeeCard: PropTypes.bool,
};

FeesCard.defaultProps = {
  studentFeeCard: false,
};
