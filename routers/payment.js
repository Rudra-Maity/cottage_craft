const express = require('express');
const router = express.Router();
const path = require('path')
require('dotenv/config')
const myEnv = process.env.API_URL;

const paymentOption = require('../payment/reactpay');
const Decode = require('../Password/jwt_auth');
const filepath = path.join(__dirname, '../payment/my-app/build')
router.use(express.static(filepath))

router.get('/user/payment/:pid', (req, res) => {
    try {
        try {
            const jwt_id = req.cookies.jwt;
            Decode.jwtDecode(jwt_id)

        } catch (e) {
            console.log('in user');
            req.session.prev=req.url
            return res.redirect(`${myEnv}/user/signIn`)
        }
        const paramPid = req.params.pid
        const item = Decode.jwtDecode(req.session.item);
        const pid = item.pid;
        if(pid===paramPid) res.sendFile(filepath + '/index.html')
        else {
    console.log('in small catch');
    res.redirect(`${myEnv}/user/orderCheckOut/:pid`)}
    } catch (err) {
        console.log('in catch');
        return res.redirect(`${myEnv}/user/orderCheckOut/:pid`)
    }
})


router.get('/user/payment/pay/:pid/:payMethod', paymentOption.CreatePayment)

router.post('/user/payment/pay/result/:pid/:PayoId', paymentOption.Signature)

router.get('/payment/refund', paymentOption.Refund)
module.exports = router