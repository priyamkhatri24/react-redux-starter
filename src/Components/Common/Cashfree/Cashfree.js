import React, { useState, useEffect } from 'react';
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
    clientId,
    clientUserId,
    currentbranding: {
      branding: {
        client_name: clientName,
        client_contact: clientContact,
        client_email: clientEmail,
      },
    },
    paymentSplits,
    orderId,
    orderAmount,
    userFeeId,
    courseOrderId,
  } = props;
  const testId =
    process.env.NODE_ENV === 'development'
      ? '7986308f47083d2e4e125efed36897'
      : '122277951965233ea251da7c4f772221';
  const [orderCurrency, setOrderCurrency] = useState('INR');
  // const [orderAmount, setOrderAmount] = useState(currentPayment.amount);
  const [orderNote, setOrderNote] = useState('test');
  const [customerName, setCustomerName] = useState(clientName);
  const [customerEmail, setCustomerEmail] = useState(clientEmail);
  const [customerContact, setCustomerContact] = useState(clientContact);
  // const [orderId, setOrderId] = useState(currentPayment.order_id);
  // const [signature, setSignature] = useState(null);
  const [returnUrl, setReturnUrl] = useState(
    userFeeId
      ? `${window.location.origin}/ordersummary?oid=${orderId}&cid=${clientId}&ufid=${userFeeId}`
      : courseOrderId
      ? `${window.location.origin}/ordersummary?oid=${orderId}&coid=${courseOrderId}`
      : `${window.location.origin}`,
  );
  const [notifyUrl, setNotifyUrl] = useState('https://portal.tca.ingeniumedu.com//cashfreeWebhook');

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

      <input className={[classes.cashfreeBtn].join(' ')} type='submit' value='Pay' />
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
  paymentSplits: PropTypes.string.isRequired,
  orderId: PropTypes.number.isRequired,
  orderAmount: PropTypes.string.isRequired,
  userFeeId: PropTypes.number.isRequired,
  courseOrderId: PropTypes.number.isRequired,
  clientUserId: PropTypes.number.isRequired,
  currentbranding: PropTypes.shape({
    branding: PropTypes.shape({
      client_id: PropTypes.number,
      client_logo: PropTypes.string,
      client_color: PropTypes.string,
      client_icon: PropTypes.string,
      client_title: PropTypes.string,
      client_name: PropTypes.string,
      client_address: PropTypes.string,
      client_contact: PropTypes.string,
      client_email: PropTypes.string,
    }),
  }).isRequired,
  userProfile: PropTypes.shape({
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string,
    contact: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
  }),
};

Cashfree.defaultProps = {
  userProfile: PropTypes.shape({
    firstName: '',
    lastName: '',
  }),
};
