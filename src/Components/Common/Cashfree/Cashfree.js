import React, { useState, useEffect, useRef } from 'react';
import crypto from 'crypto';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getUserProfile } from '../../../redux/reducers/userProfile.reducer';
import { getCurrentBranding } from '../../../redux/reducers/branding.reducer';
import { getClientId, getClientUserId } from '../../../redux/reducers/clientUserId.reducer';
import { startCashfree } from '../../../Utilities/Cashfree';
import classes from './cashfree.module.css';

const Cashfree = (props) => {
  const {
    userProfile,
    noDisplay,
    clientId,
    clientUserId,
    paymentSplits,
    notifyUrl,
    orderId,
    orderAmount,
    userFeeId,
    courseOrderId,
    cfType,
    testId,
    getCfRef,
    currentbranding,
  } = props;
  const cfRef = useRef(null);

  useEffect(() => {
    getCfRef(cfRef.current);
  }, []);

  // const testId =
  //   process.env.NODE_ENV === 'development'
  //     ? '7986308f47083d2e4e125efed36897'
  //     : '122277951965233ea251da7c4f772221';
  const [orderCurrency, setOrderCurrency] = useState(currentbranding.branding.currency_code);
  // const [orderAmount, setOrderAmount] = useState(currentPayment.amount);
  const [orderNote, setOrderNote] = useState('test');
  const [customerName, setCustomerName] = useState(
    `${userProfile.firstName} ${userProfile.lastName}`,
  );
  const [customerEmail, setCustomerEmail] = useState(
    userProfile.email || 'cashfreepayment@ingeniumedu.com',
  );
  const [customerContact, setCustomerContact] = useState(userProfile.contact);
  // const [orderId, setOrderId] = useState(currentPayment.order_id);
  // const [signature, setSignature] = useState(null);
  const [returnUrl, setReturnUrl] = useState(
    userFeeId
      ? `${window.location.origin}/ordersummary?oid=${orderId}&cid=${clientId}&ufid=${userFeeId}`
      : courseOrderId
      ? `${window.location.origin}/ordersummary?oid=${orderId}&coid=${courseOrderId}`
      : `${window.location.origin}`,
  );

  const postData = startCashfree(
    orderId,
    orderAmount,
    orderCurrency,
    orderNote,
    customerName,
    customerEmail,
    customerContact,
    returnUrl,
    notifyUrl,
    paymentSplits,
    testId,
    cfType,
  );

  const url =
    process.env.NODE_ENV === 'development'
      ? 'https://test.cashfree.com/billpay/checkout/post/submit'
      : 'https://www.cashfree.com/checkout/post/submit';

  return (
    <form id='redirectForm' method='post' action={url}>
      <input type='hidden' name='appId' value={testId} />
      <input type='hidden' name='orderId' value={orderId} />
      <input type='hidden' name='orderAmount' value={orderAmount} />
      <input type='hidden' name='orderCurrency' value={orderCurrency} />
      <input type='hidden' name='orderNote' value={orderNote} />
      <input type='hidden' name='customerName' value={customerName} />
      <input type='hidden' name='customerEmail' value={customerEmail} />
      <input type='hidden' name='customerPhone' value={customerContact} />
      {/* <input type='hidden' name='merchantData' value={merchantData} /> */}
      <input type='hidden' name='returnUrl' value={returnUrl} />
      <input type='hidden' name='notifyUrl' value={notifyUrl} />
      <input type='hidden' name='paymentSplits' value={paymentSplits} />
      <input type='hidden' name='signature' value={postData.signature} />

      <input
        style={noDisplay ? { opacity: '0' } : {}}
        className={[classes.cashfreeBtn].join(' ')}
        type='submit'
        value='Pay'
        ref={cfRef}
      />
    </form>
  );
};
const mapStateToProps = (state) => ({
  clientUserId: getClientUserId(state),
  clientId: getClientId(state),
  userProfile: getUserProfile(state),
  currentbranding: getCurrentBranding(state),
});

export default connect(mapStateToProps)(Cashfree);

Cashfree.propTypes = {
  clientId: PropTypes.number.isRequired,
  getCfRef: PropTypes.func,
  noDisplay: PropTypes.bool,
  testId: PropTypes.string.isRequired,
  cfType: PropTypes.string.isRequired,
  paymentSplits: PropTypes.string.isRequired,
  notifyUrl: PropTypes.string.isRequired,
  orderId: PropTypes.number.isRequired,
  orderAmount: PropTypes.string.isRequired,
  userFeeId: PropTypes.number.isRequired,
  courseOrderId: PropTypes.number.isRequired,
  clientUserId: PropTypes.number.isRequired,
  userProfile: PropTypes.shape({
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string,
    contact: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
  }),
  currentbranding: PropTypes.instanceOf(Object).isRequired,
};

Cashfree.defaultProps = {
  noDisplay: false,
  getCfRef: () => {},
  userProfile: PropTypes.shape({
    firstName: '',
    lastName: '',
  }),
};
