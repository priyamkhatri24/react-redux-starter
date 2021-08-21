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
    currentbranding,
    paymentSplits,
    orderId,
    currentPayment: { amount: orderAmount, user_fee_id: userFeeId, status },
  } = props;
  const testId = '7986308f47083d2e4e125efed36897';
  const [orderCurrency, setOrderCurrency] = useState('INR');
  // const [orderAmount, setOrderAmount] = useState(currentPayment.amount);
  const [orderNote, setOrderNote] = useState('test');
  const [customerName, setCustomerName] = useState(
    `${userProfile.firstName} ${userProfile.lastName}`,
  );
  const [customerEmail, setCustomerEmail] = useState(userProfile.email || 'priyam@test.com');
  const [customerContact, setCustomerContact] = useState(userProfile.contact);
  // const [orderId, setOrderId] = useState(currentPayment.order_id);
  // const [signature, setSignature] = useState(null);
  const [returnUrl, setReturnUrl] = useState(window.location.origin);
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

  // }, [apiValidation]);
  // const postHandler = () => {
  //   console.log(fees.fee_data);

  //   // get(payload, '/fetchOrderByIdCasgFree').then((res) => {
  //   //   const result = apiValidation(res);
  //   //   // history.push({ pathname: '/order', state: { order: result } });
  //   // });
  // };

  return (
    <form
      id='redirectForm'
      method='post'
      action='https://test.cashfree.com/billpay/checkout/post/submit'
    >
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
      {status === 'due' ? (
        <input className={[classes.cashfreeBtn, 'mt-4'].join(' ')} type='submit' value='Cashfree' />
      ) : status === 'pending' ? (
        <p>You have a pending payment. Please wait while your bank processes the payment.</p>
      ) : null}
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
  currentPayment: PropTypes.instanceOf(Object).isRequired,
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
