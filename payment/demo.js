const express = require('express');
const app = express();
const Razorpay = require('razorpay');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const axios=require('axios')
// Load environment variables
dotenv.config();

// Load your Razorpay API Key and Secret from environment variables
const razorpay = new Razorpay({
  key_id: 'rzp_test_ttnvmIbSqbVddU',
  key_secret: '3p9woJSYoQhcNqKL2kBaW9tx',
});

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
// app.use(express.static('public')); // Serve static files from the 'public' directory
app.use(bodyParser.json());

// Render the payment form
app.get('/', (req, res) => {
  res.render('payment');
});

// Handle form submission and create a Razorpay order
app.get('/get-order/:orderId', async (req, res) => {
    const orderId = req.params.orderId;
  
    try {
      const response = await axios.get(
        `https://api.razorpay.com/v1/orders/${orderId}`,
        {
          auth: {
            username: 'rzp_test_ttnvmIbSqbVddU',
            password: '3p9woJSYoQhcNqKL2kBaW9tx',
          },
        }
      );
  
      const orderData = response.data;
      res.json(orderData);
    } catch (error) {
      console.error('Error fetching order details:', error);
      res.status(500).json({ error: 'Error fetching order details' });
    }
  });
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});