const express=require('express')
const router=express.Router()

require('dotenv/config')

// const jwt = require('jsonwebtoken')
const userOrders=require('../checkedOrders/userOrder')
const jwt_auth=require('../Password/jwt_auth');
const Refund=require('../payment/reactpay').Refund

const myEnv = process.env.API_URL
router.use((req, res, next) => {
    console.log('Time: ', Date.now())
    next()
});


router.get(`${myEnv}/user/order`,(req,res)=>{
    try{
        const userId=jwt_auth.jwtDecode( req.cookies.jwt).userId
       const doc= userOrders.viewOrders(userId,req.query.oid)
       res.render('UserOrders',{doc:doc})
    }catch(er){
        req.session.prev=req.url
        return res.redirect(`${myEnv}/user/signIn`)
    }
}) 

router.put(`${myEnv}/user/order/cancel/:oid`,async(req,res)=>{
    try{
        const userId=jwt_auth.jwtDecode( req.cookies.jwt).userId
        const oid=req.params.oid
       const doc=await userOrders.cancelOrder(userId,oid)
       if (doc) {
        if(doc.paymethod.paymethod==='COD')  return res.json(doc);
        else if(doc.paymethod.paymethod==='online_payment'){
          const refund=  Refund(req,res,doc.paymethod.paydetails.payid)
          if(refund) res.json({refund:true,doc})

        }
        else res.json({refund:false})
    }
       return res.send('Not found')
    }catch(err){
        req.session.prev=req.url
        return res.redirect(`${myEnv}/user/signIn`)
    }
})

module.exports=router