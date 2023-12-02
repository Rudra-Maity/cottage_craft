const Razorpay = require('razorpay');
const express=require('express')
const app=express()

const razorpay = new Razorpay({
  key_id: 'rzp_test_ttnvmIbSqbVddU',
  key_secret: '3p9woJSYoQhcNqKL2kBaW9tx',
});

const orderData = {
    amount: 1000, // Replace with the actual amount in paisa (e.g., 1000 paisa = ₹10)
    currency: 'INR',
  };
 
  app.get('/',(req,res)=>{
  razorpay.orders.create(orderData, (err, order) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log('Razorpay Order:', order);
    
  });
  })
  
  
  
  app.get('/pay',(req,res)=>{
    const orderId = 'order_McDGcmHLEU2TxX'; // 
  
  const paymentData = {
    order_id: orderId,
    payment_method: 'upi',
  };
    
razorpay.payments.createUpi(paymentData, (err, payment) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log('Razorpay Payment:', payment);

  // Redirect the user to the UPI payment link
  const upiLink = payment.entity.upi_link;
  console.log('UPI Payment Link:', upiLink);

});
})



app.listen(3000)