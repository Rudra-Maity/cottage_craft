const express = require('express');
const router = express.Router()
const productManager = require('../MySchema/productManager');
const Userpass = require('../Password/encryptpass')
require('dotenv/config')
// const cookie_crypt = require('../Password/cookie-encrypt');
// const cookieparser=require('cookie-parser')
const adminSignIn = require('../Password/adminSignIn')
const myEnv = process.env.API_URL;
const session=require('express-session')
const admin_auth=require('../Password/jwt_auth');

router.use(
    session({
      secret: process.env.auth_secrete, // Replace with a strong secret key in production
      resave: false,
      saveUninitialized: true,
    })
  );

router.use((req, res, next) => {
    console.log('Time: ', Date.now())
    next()
})

router.get(`${myEnv}/admin/signup`, async (req, res) => {
    if (req.session.admin_id) res.send('you already LogedIn')
    else res.render('adminSignUp')
})

router.post(`${myEnv}/admin/signup`, async (req, res) => {
    const admin_pass = await Userpass(req.body.admin_pass)
    console.log(req.body.admin_pass)
    const name = await { fname: req.body.fname, lname: req.body.lname }
    console.log(name)
    const adminSignUp = new productManager({
        admin_name: name,
        admin_id: req.body.admin_id,
        admin_pass: admin_pass
    })
        .save()
        .then(async (result) => {
            // res.cookie('admin_id',req.body.admin_id)
            // var farFuture = new Date(new Date().getTime() + (1000 * 60 * 60 * 24 * 365)); // ~10y
            req.session.admin_id=admin_auth.jwtSign( req.body.admin_id,'1d');
            res.status(200).json({
                url:req.session.prev || '/api/v1/admin'
            })
            delete req.session.prev
        })
        .catch((err) => { 
            if(err.code===11000) return res.json({url:""})
            res.status(500).json({
                error: err,
                succed: false
            });
        });

});

router.get(`${myEnv}/admin/signIn`, async (req, res) => {
        if(req.session.admin_id){
        console.log('userid : ',req.session.admin_id);
        try{
        console.log('jwt : ',admin_auth.jwtDecode(req.session.admin_id));
        if(admin_auth.jwtDecode(req.session.admin_id)) {res.send('You already logedIn')}
        }catch(e){
      res.render('adminLogin')
    }
        }
       else{res.render('adminLogin')}
    });

router.post(`${myEnv}/admin/signIn`, adminSignIn);

router.get(`${myEnv}/admin/logOut`, async (req, res) => {
    if (req.session.admin_id) {
        req.session.destroy((err)=>{
            if(err){}
            else {res.redirect(`${myEnv}/admin/signIn`)}
        })
        res.redirect(`${myEnv}/admin/signIn`)
    }
    
})
module.exports = router