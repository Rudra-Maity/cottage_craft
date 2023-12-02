// Inside app.js
const express = require('express');
const Razorpay = require('razorpay');
const bodyParser = require('body-parser')

// This razorpayInstance will be used to
// access any resource from razorpay
const razorpayInstance = new Razorpay({
    key_id: 'rzp_test_ttnvmIbSqbVddU',
    key_secret: '3p9woJSYoQhcNqKL2kBaW9tx'
});

const app = express();
const PORT = process.env.PORT || '5000';
app.use(bodyParser())
//Inside app.js
app.post('/createOrder', (req, res) => {

    // STEP 1:
    // const amount = req.body.amount
    // const currency = req.body.currency
    // const receipt = req.body.receipt
    // const notes = req.body.notes

    // STEP 2:	
    console.log("erwerfewrf")
    razorpayInstance.orders.create({
        amount: req.body.amount,
        currency: req.body.currency,
        receipt: req.body.receipt,
        notes: req.body.notes

    },
        (err, order) => {

            //STEP 3 & 4:
            if (!err) {
                res.send( `` )
            }
            else
                res.send(err);
        }
    )
});


app.listen(PORT, () => {
    console.log("Server is Listening on Port ", PORT);
});
