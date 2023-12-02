const express = require('express');
const app = express()
const Razorpay = require('razorpay')
require('dotenv/config')
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const signature = require('./signature')
const products = require('../MySchema/products')
const jwt_auth = require('../Password/jwt_auth')
const OrderCreation = require('./OrderCreation')


// const Orders
// console.log(process.env.key_secret,process.env.apiKey)

const myEnv = process.env.API_URL
const rcp_id = 'rcp_' + Date.now();

const razorpayInstance = new Razorpay({
  key_id: process.env.apiKey,
  key_secret: process.env.key_secret
})
const CreatePayment = async (req, res) => {
  const paramPid = req.params.pid
  console.log("parampid", paramPid);
  try {

    try {
      const jwt_id = jwt_auth.jwtDecode(req.cookies.jwt);
    } catch (e) {
      req.session.prev = req.url
      return res.redirect(`${myEnv}/user/signIn`)
    }
    console.log(req.session.item);
    const item = jwt_auth.jwtDecode(req.session.item);
    const pid = item.pid;
    console.log("item.pid", pid);
    const payMethod = req.params.payMethod
    console.log("paymethod", payMethod);
    if (pid === paramPid) {
      console.log("Mypid", pid);
      const product = products.findOne({ pid: pid })
        .then((doc) => {
          console.log("mydocpid", doc);
          if (doc) return doc
        })
        .catch((err) => res.send("Some Error", err))
        .then(async (doc) => {
          if (payMethod === "online_payment") {
            const payOrder = razorpayInstance.orders.create({
              amount: doc.price*100 ,
              currency: 'INR',
              receipt: rcp_id,
              notes: {
                pid: pid,
                pname: doc.pname,
                email: req.cookies.jwt.userId,
              }

            }).then((data) => {
              console.log(data)
              res.json(data)
            })
              .catch(err => console.log(err))
          }

          else if (payMethod === "COD") {
            try {
              const NewOrder = await OrderCreation(req, res, doc, payMethod)

              if (NewOrder) {
                console.log('oid : ', NewOrder.oid);
                req.session.oid = NewOrder.oid
                console.log("NewOrder: ", NewOrder);
                res.json({ url: '/user/order/result?success=true' })
              }
              else res.json({ url: '/user/order/result?success=false' })
            } catch (err) {
              console.log(err);
            }
          }
        })
    }
    else res.redirect(`${myEnv}/user/orderCheckOut/${paramPid}`)
  } catch (e) {
    console.log(e);
    res.redirect(`${myEnv}/user/orderCheckOut/${paramPid}`)
  }

}



const Signature =async (req, res) => {
  try{
  const { pid, PayoId } = req.params;
  console.log(PayoId, pid)
  const payData = req.body
  console.log("paydata: ",payData)
  // console.log(payData);
  if (signature(PayoId, payData.response.razorpay_payment_id, payData.response.razorpay_signature)) {
    const doc= await products.findOne({pid:pid});

    const NewOrder = await OrderCreation(req, res, doc,'online_payment',payData.response.razorpay_order_id,payData.response.razorpay_payment_id,payData.response.razorpay_signature,payData.rcp_id);
    console.log('valid')
    req.session.oid=NewOrder.oid
    res.json({ url: '/user/order/result?success=true' })
  }
  else console.log('not valid')
}catch(err){
  res.json({ url: '/user/order/result?success=false' })
  console.log(err);
}
}

const Refund = (req, res,paymentId) => {
  // const paymentId = 'pay_MecPSD2uqGN785'
  razorpayInstance.payments.refund(paymentId, {
    "amount": "100",
    "speed": "optimum",
    "receipt": "Receipt No. 31"
  }, (error, refund) => {
    if (error) {
      console.error('Error refunding payment:', error);
      return false
    } else {
      console.log('Refund successful:', refund);
      return refund
    }
  });
}

module.exports = { CreatePayment, Signature, Refund }