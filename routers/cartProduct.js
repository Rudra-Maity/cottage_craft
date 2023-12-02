const express = require('express');
const router = express.Router();
require('dotenv/config');
const myEnv = process.env.API_URL

const UserCart = require('../MySchema/User');
const productSchema = require('../MySchema/products')
const Decode = require('../Password/jwt_auth');
const products = require('../MySchema/products');
const DeleteCart=require('../ProductsModule/DeleteCartItem');

router.use((req, res, next) => {
    console.log('Time: ', Date.now())
    next()
});

router.get(`${myEnv}/user/viewcart`, (req, res) => {
    try{

        const jwt=Decode.jwtDecode(req.cookies.jwt)
        const userId=jwt.userId
        UserCart.findOne({umail:userId})
        .then((data)=>{
            console.log(data.cart);
            products.find({ pid: { $in: data.cart }})
            .then((doc)=>{
               res.status(200).render('cart',{doc:doc})
            })
        })
        .catch((err)=>{
            console.log(err);
            res.json(err)
        })
    }catch(e){
        res.redirect(`${myEnv}/user/signIn`)
    }
});

router.get(`${myEnv}/user/cart`, (req, res) => {
    try {
        const userId = Decode.jwtDecode(req.cookies.jwt).userId;

        const pid = req.query.cartItem
        console.log(userId);
        const cart = productSchema.findOne({ pid: pid })
            .then((data) => {
                if(!data) return;
              return  UserCart.updateOne({ umail: userId },{$push:{cart:pid}})
            })
            .catch((err) => {
                res.json(err)
            })
            .then((doc)=>{
                if(doc){
                console.log('in cart',doc);
                res.redirect(`${myEnv}/user/viewcart`)
                }
                else res.send("not found")
            })
            .catch((err)=>res.send("Some error"))
    } catch (err) {
        req.session.prev = req.url
        res.redirect(`${myEnv}/user/signIn`)
    }

});

router.get(`${myEnv}/user/cart/remove`,async(req,res)=>{
    try{
        const Item=req.query.pid
    const userId=Decode.jwtDecode (req.cookies.jwt).userId
    
    const cartItem=await DeleteCart(userId,Item)
    console.log(cartItem);

    if(cartItem)  res.redirect(`${myEnv}/user/viewcart`)
    else res.send('some error')
    }catch(err){
        console.log(err);
        res.redirect(`${myEnv}/user/signIn`)
    }
})
module.exports = router