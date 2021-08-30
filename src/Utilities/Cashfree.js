import crypto from 'crypto';
import { post, apiValidation } from './index';

const secretKey =
  process.env.NODE_ENV === 'development'
    ? 'e802e96ef246f9a5696f20f1c70a9d9581a4d283'
    : '8c21c14b2990bb15296b1e383593d5b0dd316f19';
const testId =
  process.env.NODE_ENV === 'development'
    ? '7986308f47083d2e4e125efed36897'
    : '122277951965233ea251da7c4f772221';

export const startCashfree = (
  orderId,
  orderAmount,
  orderCurrency,
  orderNote,
  customerName,
  customerEmail,
  customerPhone,
  returnUrl,
  notifyUrl,
  paymentSplits,
) => {
  const postData = {
    appId: testId,
    orderId,
    orderAmount,
    orderCurrency,
    orderNote,
    customerName,
    customerEmail,
    customerPhone,
    returnUrl,
    notifyUrl,
    paymentSplits,
  };

  console.log('timerrr');

  const sortedkeys = Object.keys(postData);

  let signatureData = '';
  sortedkeys.sort();
  for (let i = 0; i < sortedkeys.length; i++) {
    const k = sortedkeys[i];
    signatureData += k + postData[k];
  }
  const signature = crypto.createHmac('sha256', secretKey).update(signatureData).digest('base64');
  postData.signature = signature;
  console.log(postData, 'postttdataa');
  return postData;
};
