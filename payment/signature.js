const crypto = require('crypto');
const apiSecret = process.env.key_secret; // Replace with my actual API secret
function signature(PayoId,payId,receivedSignature){
function verifyRazorpaySignature(receivedSignature, data) {
  const text = data.order_id + '|' + data.payment_id;

  const expectedSignature = crypto
    .createHmac('sha256', apiSecret)
    .update(text)
    .digest('hex');

  return expectedSignature === receivedSignature;
}

// Data received from Razorpay webhook
const receivedData = {
  order_id: PayoId,
  payment_id: payId,
  // ...other payment-related data
};

// const receivedSignature = 'received_signature'; // Replace with the actual received signature

const isSignatureValid = verifyRazorpaySignature(receivedSignature, receivedData);

if (isSignatureValid) {
  // Signature is valid; you can trust the payment information
  // Process the payment, update your database, send a confirmation, etc.
  return true
} else {
  // Signature is not valid; do not trust the payment information
  // Log the incident, investigate, and consider rejecting the data
  return false
}
}
module.exports= signature