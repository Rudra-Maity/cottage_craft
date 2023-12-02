const express = require('express');
const axios = require('axios');
const Razorpay = require('razorpay');

const app = express();
// const port = process.env.PORT || 3000;

// Replace with your Razorpay API key and secret
const key_id = 'rzp_test_ttnvmIbSqbVddU';
const key_secret = '3p9woJSYoQhcNqKL2kBaW9tx';

const razorpay = new Razorpay({
  key_id,
  key_secret,
});

app.use(express.json());

// Route to create a Razorpay order
app.post('/create-order', async (req, res) => {
  const amount = 50000; // Amount in paise (e.g., 50000 paise = 500 INR)

  const options = {
    amount,
    currency: 'INR',
  };

  try {
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    res.status(500).json({ error: 'An error occurred while creating the order' });
  }
});

// Route to initiate the payment
app.get('/initiate-payment', (req, res) => {
  const orderId = req.query.order_id;

  if (!orderId) {
    return res.status(400).json({ error: 'Order ID is missing' });
  }

  // Replace 'YOUR_RAZORPAY_KEY_ID' with your actual Razorpay API key ID
//   const key_id = 'rzp_test_ttnvmIbSqbVddU';

  const options = {
    key_id:key_id,
    order_id: orderId,
    name: 'Your Company Name',
    description: 'Purchase Description',
    image: 'URL_to_Your_Logo.png',
    prefill: {
      name: 'Customer Name',
      email: 'customer@example.com',
      contact: '1234567890',
    },
    theme: {
      color: '#F37254',
    },
  };
// console.log
  const rzp = new Razorpay(options);
//   rzp.on('payment.failed', (response) => {
//     console.error('Payment failed:', response.error.description);
//     res.status(400).json({ error: 'Payment failed' });
//   });
razorpay.payments.transfer()

  rzp.open({
    options
  }, function (response) {
    // This callback function will be called when the payment is complete,
    // whether it's successful or failed.
    if (response.razorpay_payment_id) {
      // Payment successful
      alert('Payment successful: ' + response.razorpay_payment_id);
    } else {
      // Payment failed
      alert('Payment failed: ' + response.error.description);
    }
})
});

app.listen(3000);
