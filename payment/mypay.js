// Import required packages
const express = require('express');
const Razorpay = require('razorpay');
const dotenv=require('dotenv')
dotenv.config()
// Initialize Express app
const app = express();
const port = process.env.PORT || 4000;

// Initialize Razorpay with your API Key and Secret
const apiKey = 'rzp_test_ttnvmIbSqbVddU';
const apiSecret = '3p9woJSYoQhcNqKL2kBaW9tx';
const razorpay = new Razorpay({
  key_id: apiKey,
  key_secret: apiSecret,
});

// Create a sample order (you should generate this dynamically in a real application)
const createOrder = async (amount) => {
  const orderData = {
    amount: amount * 100, // Amount in paise
    currency: 'INR',
  };

  try {
    const order = await razorpay.orders.create(orderData);
    return order.id;
  } catch (error) {
    throw error;
  }
};

// Define a route to initiate a payment
app.get('/pay', async (req, res) => {
  try {
    // Create an order (replace 100 with the actual amount)
    const orderId = await createOrder(100);

    // Redirect the user to Razorpay's payment page
    res.redirect(`/pay/${orderId}`);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).send('Error creating order');
  }
});

// Define a route to complete the payment
app.get('/pay/:orderId', (req, res) => {
  const orderId = req.params.orderId;

  // Render a payment form (you can create an HTML form for this)
  res.send(`<script src="https://checkout.razorpay.com/v1/checkout.js"></script>
  <script>
  var options = {
    "key":' ${process.env.api}',
    "amount": "4666",
    "currency": "INR",
    "name": "Dummy Academy",
    "description": "Pay & Checkout this Course, Upgrade your DSA Skill",
    "image": "https://media.geeksforgeeks.org/wp-content/uploads/20210806114908/dummy-200x200.png",
    "order_id": "order_MbhiQ6Te9tRhY3",
    "handler": function (response){
      console.log(response)
      alert("This step of Payment Succeeded");
    },
    "prefill": {
      //Here we are prefilling random contact
      "contact":"9876543210",
      //name and email id, so while checkout
      "name": "Twinkle Sharma",
      "email": "smtwinkle@gmail.com"
    },
    "notes" : {
      "description":"Best Course for SDE placements",
      "language":"Available in 4 major Languages JAVA,C/C++, Python, Javascript",
      "access":"This course have Lifetime Access"
    },
    "theme": {
      "color": "#2300a3"
    }
  };
  var razorpayObject = new Razorpay(options);
  console.log(razorpayObject);
  razorpayObject.on('payment.failed', function (response){
      console.log(response);
      alert("This step of Payment Failed");
  });
  
    razorpayObject.open();
    
  </script>
  `);
});

// // Define a route to confirm the payment
// app.post('/confirm-payment/:orderId', (req, res) => {
//   const orderId = req.params.orderId;
//   const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

//   // Verify the payment
//   const expectedSignature = razorpay_order_id + '|' + razorpay_payment_id;
//   const isSignatureValid = razorpay.webhooks.verifySignature(
//     expectedSignature,
//     razorpay_signature
//   );

//   if (isSignatureValid) {
//     // Payment is valid, you can update your database or perform other actions here
//     res.send('Payment successful');
//   } else {
//     // Payment failed or is invalid
//     res.send('Payment failed');
//   }
// });

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
