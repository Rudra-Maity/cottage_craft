const express = require('express');
const router = express.Router()
require('dotenv/config')
// const jwt = require('jsonwebtoken')
const jwt_auth=require('../Password/jwt_auth');
const OrderChecked=require('../checkedOrders/viewOrders');
const Orders=require('../MySchema/orders');
const orders = require('../MySchema/orders');

const myEnv = process.env.API_URL
router.use((req, res, next) => {
    console.log('Time: ', Date.now())
    next()
});

router.get(`${myEnv}/admin`,(req,res)=>{
    if(req.session.admin_id) res.render('AdminHomePage')
    else res.redirect(`${myEnv}/admin/signIn`)
});

router.get(`${myEnv}/admin/home/checkOrders/:page`,async(req,res)=>{
    const view=req.query.view;
    const page = parseInt(req.params.page);
    const perPage = 6;
    //   const  query  = req.query.q;
    try{
        jwt_auth.jwtDecode(req.session.admin_id)
    }catch(e){
        req.session.prev=req.url;
     return  res.redirect(`${myEnv}/admin/signIn`)
    }
    console.log(jwt_auth.jwtDecode(req.session.admin_id).userId);
    const doc=await OrderChecked.CheckedOrder(req,jwt_auth.jwtDecode(req.session.admin_id).userId,view,page,perPage)
    // console.log("doc: ",doc);
    console.log(view);
    if(view==='confirm'){
        res.status(200).render('adminViewConfirmOrders',{doc:doc[0],page,pageLength:doc[1]})
    }
    else if(view==='shipped'){
        res.status(200).render('adminShippedOrders',{doc:doc[0],page,pageLength:doc[1]})
    }
  else if(view==='deliverd'){
    console.log('oid',doc[0][0].oid);
        res.status(200).render('adminDeliverd',{doc:doc[0],page,pageLength:doc[1]})
    }
    else if(view==='canceled'){
        res.status(200).render('adminCancelOrders',{doc:doc[0],page,pageLength:doc[1]})
    }
    else res.send('Some error')
});

// router.get(`${myEnv}/admin/shipping`,(req,res)=>{
//     try{
//       const admin_id=  jwt_auth.jwtDecode(req.session.admin_id)
//       res.send('shipping file form')
//     }catch(err){
//         req.session.prev=req.url
//         res.redirect(`${myEnv}/admin/signIn`)
//     }
// })
router.post(`${myEnv}/admin/shipping/:oid`,(req,res)=>{
    try{
        const oid=req.params.oid
        const admin_id=  jwt_auth.jwtDecode(req.session.admin_id).userId
        console.log(req.body.shippadd);
        Orders.findOneAndUpdate({admin_id:admin_id,'deleivery.delstatus':'confirm',oid:oid},{$set:{'deleivery.delstatus':'shipped','deleivery.shippadd':req.body.shippadd}})
        .then((doc)=>{
            if(doc){
                res.send('succed')
            }
            else {
                res.send('some error')}
        })
        .catch((err)=>{
            console.log(err);
            res.send('Error')
        });
    }catch(err){
        res.redirect(`${myEnv}/admin/signIn`)
    }
})


router.get(`${myEnv}/admin/deliverd/:oid`,(req,res)=>{
    try{
        const admin_id=  jwt_auth.jwtDecode(req.session.admin_id).userId
        const oid=req.params.oid
        Orders.findOneAndUpdate({admin_id:admin_id,'deleivery.delstatus':'shipped',oid:oid},{$set:{'deleivery.delstatus':'deliverd'}})
        .then((doc)=>{
            if(doc){
                res.send('Order has Deliverd')
            }
            else {
                res.send('some error')}
        })
        .catch((err)=>{
            console.log(err);
            res.send('Error')
        });
    }catch(err){
        res.redirect(`${myEnv}/admin/signIn`)
    }
})

router.get(`${myEnv}/admin/orderDetails/:oid`,(req,res)=>{
    try{
        const admin_id=jwt_auth.jwtDecode(req.session.admin_id).userId
        const oid=req.params.oid
        orders.findOne({admin_id:admin_id,oid:oid})
        .then((doc)=>{
            console.log(doc);
            if(doc) res.render('adminviewOrderDetail',{doc:doc})
            else res.json({err:'product not found'})
        })
        .catch((e)=>{
            console.log(e);
            res.send("Some Error")
        })
    }catch(err){
        req.session.prev=req.url
        res.redirect(`${myEnv}/admin/signIn`)
    }
})

module.exports=router