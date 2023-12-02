const express = require('express');
const jwt = require('jsonwebtoken')
const router = express.Router()
require('dotenv/config')
const myEnv = process.env.API_URL

const jwt_auth = require('../Password/jwt_auth')
const isAvilable = require('../ProductsModule/isProductavilable')
const userOrders=require('../checkedOrders/userOrder')

router.use((req, res, next) => {
    console.log('Time: ', Date.now())
    next()
});

router.get(`${myEnv}/user/orderCheckOut`,async (req, res) => {
    const pid = req.query.pid
    try {
        jwt_auth.jwtDecode(req.cookies.jwt)
    } catch (er) {
        req.session.prev = req.url
        return res.redirect(`${myEnv}/user/signIn`)
    }
    const result =await isAvilable(pid)
    if (result) {
        console.log("mnmdn",result);
        try {
            const token = jwt.sign({ pid: pid }, process.env.auth_secrete, { expiresIn: '1d' });
            req.session.item = token;
            res.render("orderCheckOut",{result})
        } catch (err) {
            res.redirect('/')
        }
    }

    else if (result === false) res.send('some error')
});

router.get(`${myEnv}/user/order`,async(req,res)=>{
    try{
        const userId=jwt_auth.jwtDecode(req.cookies.jwt).userId
        console.log(userId,req.query.oid);
       const doc=await userOrders.viewOrders(userId,req.query.oid)
       console.log("doc: ",doc);
    if(req.query.oid) return res.render('UserOrdeerDetails',{doc:doc})
       res.render('UserOrders',{doc:doc})
    }catch(er){
        req.session.prev=req.url
        return res.redirect(`${myEnv}/user/signIn`)
    }
}) 

router.get(`${myEnv}/user/order/cancel/:oid`,async(req,res)=>{
    try{
        const userId=jwt_auth.jwtDecode( req.cookies.jwt).userId
        const oid=req.params.oid
        // console.log(oid);
        
       const doc=await userOrders.cancelOrder(userId,oid)
     console.log(doc);
       if (doc && doc.deleivery.delstatus!=='canceled') return res.render('OrderCancel');
       return res.send('Not found')
    }catch(err){
        req.session.prev=req.url
        return res.redirect(`${myEnv}/user/signIn`)
    }
})


module.exports = router