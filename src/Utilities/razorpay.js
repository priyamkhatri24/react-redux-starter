/* eslint-disable no-alert */
function loadScript(src) {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
}

export async function displayRazorpay(
  orderId,
  amount,
  currency,
  brandImage,
  brandColor,
  brandName,
  brandAddress,
  brandContact,
  razorSuccess,
  userFeeId,
  clientId,
  RazorpayKeyId,
  accountId,
) {
  const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');

  if (!res) {
    alert('Razorpay SDK failed to load. Are you online?');
    return;
  }

  // // creating a new order
  // const result = await axios.post('http://localhost:5000/payment/orders');

  // if (!result) {
  //   alert('Server error. Are you online?');
  //   return;
  // }

  // // Getting the order details back
  // const { amount, id: order_id, currency } = result.data;

  const options = {
    key: RazorpayKeyId, // Enter the Key ID generated from the Dashboard
    amount: amount.toString(),
    currency,
    name: brandName,
    description: 'Transaction',
    image: brandImage,
    order_id: orderId,
    account_id: accountId,
    async handler(response) {
      const data = {
        orderCreationId: orderId,
        razorpayPaymentId: response.razorpay_payment_id,
        razorpayOrderId: response.razorpay_order_id,
        razorpaySignature: response.razorpay_signature,
      };

      console.log(response, data);

      if (response) {
        razorSuccess({
          user_fee_id: userFeeId,
          client_id: clientId,
          order_id: orderId,
        });
      }
    },
    prefill: {
      name: brandName,
      email: '',
      contact: brandContact,
    },
    notes: {
      address: brandAddress,
    },
    theme: {
      color: brandColor,
    },
  };

  const paymentObject = new window.Razorpay(options);
  paymentObject.on('payment.failed', (response) => {
    alert(`${response.error.code}:- ${response.error.description} due to ${response.error.reason}`);
    //    alert(response.error.source);
    //    alert(response.error.step);
    // alert(response.error.metadata.order_id);
    // alert(response.error.metadata.payment_id);
  });
  paymentObject.open();
}
