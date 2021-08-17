import crypto from 'crypto';

const secretKey = 'e802e96ef246f9a5696f20f1c70a9d9581a4d283';
const testId = '7986308f47083d2e4e125efed36897';

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
  };

  const sortedkeys = Object.keys(postData);

  let signatureData = '';
  sortedkeys.sort();
  for (let i = 0; i < sortedkeys.length; i++) {
    const k = sortedkeys[i];
    signatureData += k + postData[k];
  }
  const signature = crypto.createHmac('sha256', secretKey).update(signatureData).digest('base64');
  postData.signature = signature;
  return postData;
};

export const url =
  process.env.NODE_ENV == 'production'
    ? 'https://www.cashfree.com/checkout/post/submit'
    : 'https://test.cashfree.com/billpay/checkout/post/submit';
