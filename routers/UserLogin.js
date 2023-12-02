const express = require('express');
require('dotenv/config')
const router = express.Router()
const cookieparser = require('cookie-parser')

const User = require('../MySchema/User');
const Userpass = require('../Password/encryptpass')
const userSignIn = require('../Password/userSignin')
const user_auth = require('../Password/jwt_auth');
const myEnv = process.env.API_URL;

router.use((req, res, next) => {
    console.log('Time: ', Date.now())
    next()
})
router.use(cookieparser())

router.get(`${myEnv}/user/signup`, async (req, res) => {
    try {
        if (user_auth.jwtDecode(req.cookies.jwt)) {
            res.send('you already LogedIn')
        }
    } catch (er) {
        res.render('UserSignUp')
    }
    // return res.redirect(`${myEnv}/user/signIn`)
})

router.post(`${myEnv}/user/signup`, async (req, res) => {
    const uname = {
        fname: req.body.fname,
        lname: req.body.lname,
    }
    const address = {
        phno: req.body.phno,
        state: req.body.state,
        district: req.body.district,
        pincode: req.body.pincode,
        street: req.body.street,
        landmark: req.body.landmark,
    }
    const upass = await Userpass(req.body.upass)
    const UserSignUp = new User({
        uname: uname,
        umail: req.body.umail,
        upass: upass,
        address: address,

    })
        .save()
        .then((result) => {
            const farFuture = new Date(new Date().getTime() + (1000 * 60 * 60 * 24 * 365));
            const jwt = user_auth.jwtSign(req.body.umail, '1y')
            console.log(jwt)
            res.cookie('jwt', jwt, { expires: farFuture, httpOnly: true, secure: true })
            res.redirect(req.session.prev || '/')
            delete req.session.prev
        })
        .catch((err) => {
            if (err.code === 11000) { res.send("email already exist") }
            else {
                console.log(err)
                res.status(500).json({
                    error: err,
                    succed: false
                });
            }
        });

});

router.get(`${myEnv}/user/signIn`, async (req, res) => {
    try {
        // console.log('userid : ', req.cookies.jwt);
        // console.log('jwt : ', user_auth.jwtDecode(req.cookies.jwt));
        if (user_auth.jwtDecode(req.cookies.jwt)) {
            res.send('You already logedIn')
        }
        else res.render('signInPage', { mailerr: "", passerr: "" })
        // admin_auth.jwtDecode( req.session.userId)
    } catch (error) {
        res.render('signInPage', { mailerr: "", passerr: "" })
        // res.redirect(`${myEnv}/user/signIn`)
    }
});

router.post(`${myEnv}/user/signIn`, userSignIn);

router.get(`${myEnv}/user/logOut`, async (req, res) => {
    if (req.cookies.jwt) {
        res.clearCookie('jwt')
    }
    res.redirect(`${myEnv}/user/signIn`)

})

router.get(`${myEnv}/user/profile`, async (req, res) => {
    try {
        const jwt = user_auth.jwtDecode(req.cookies.jwt)
        console.log('jwt',jwt)
        if (jwt) {
            try {
                const profile = await User.findOne({ umail: jwt.userId })
                if (profile) res.status(200).render('profile', {doc:profile})
            } catch (e) {
                res.send('some error')
            }
        }
        else res.redirect(`${myEnv}/user/signIn`)
    } catch (err) {
        req.session.prev=req.url
        res.redirect(`${myEnv}/user/signIn`)
        
    }
})

router.get(`${myEnv}/user/forgetPass`,(req,res)=>{
    try{
        // const qurey=req.params.update
       
            const userId=user_auth.jwtDecode(req.cookies.jwt)
            res.send("You are already logged in")
        
    }catch(err){
        // req.session.prev=req.url
    res.render('forgetPass')
    }
})

router.post(`${myEnv}/user/update/:upadate`,async(req,res)=>{
    try{
        const qurey=req.params.upadate
        if(qurey==='forgetPass'){
            const encryptPass=await Userpass(req.body.upass)
            console.log(encryptPass);
            await User.updateOne({umail:req.body.umail},{$set:{upass:encryptPass}})
            console.log('work');
            res.redirect(`${myEnv}/user/signIn`)
        }
        else if(qurey==='updateDetails'){
            console.log(qurey);
            const userId=user_auth.jwtDecode(req.cookies.jwt).userId
            console.log(req.body);
           await User.updateOne({umail:userId},{$set:req.body})
           res.clearCookie('jwt')
           res.json({url:'http://localhost:2000/api/v1/user/signIn'})
        }

    }catch(err){
        res.send("Some error")
    }
})
module.exports = router