const express = require('express');
const Product = require('../MySchema/products')
const User = require('../MySchema/User');
const router = express.Router()
const cors = require("cors");
const session = require('express-session');
// const products = require('../MySchema/products');
router.use(cors())
require('dotenv/config')
const cookieparser = require('cookie-parser')
const myEnv = process.env.API_URL
const isAuthenticated = require('../Password/Admin_Authenticated')
const addproduct = require('../ProductsModule/AddProduct')
const jwt_auth=require('../Password/jwt_auth');
const multerStorage=require('../ProductsModule/multerImage')

router.use((req, res, next) => {
    console.log('Time: ', Date.now())
    next()
})
router.use(cookieparser())
router.use(express.json())



router.use(
    session({
        secret: process.env.auth_secrete, // Replace with a strong secret key in production
        resave: false,
        saveUninitialized: true,
    })
);
router.get(`/`, async (req, res) => {
    // res.setHeader('Content-Type', 'application/json');
    try{

        const decode=jwt_auth.jwtDecode(req.cookies.jwt).userId
        // console.log(decode);
       
        const UserDetail=await User.findOne({umail:decode});
        // console.log('user: ',UserDetail);
        const profileName=UserDetail.uname
        console.log(profileName);
        let filter = {};
        // console.log('vbvcbvcg',req.query.categories);
        if (req.query.categories) {
        //     filter = { category: req.query.categories.split(',') }
        
        // console.log(filter)
        // const productList = await Product.find(filter).populate('category')
        // console.log(req.query.categories)
       const encryptedString = req.query.categories.replace(/%/g, ' ');
    //    console.log('ssdsAS',encryptedString);
            const productList =await Product.find({category:encryptedString})
            .skip((req.query.page - 1) * 2)
      .limit(2);

      
    // const pageLength=Math.ceil(count/perPage);
          const count=await Product.countDocuments({category:req.query.categories})
          console.log(req.query.page);
        //   console.log(count);
          
        //     res.send(productList)
      const pageLength=  Math.ceil(count/2)
    //   console.log(pageLength);
        res.render('category',{doc:productList,profileName:{fname:"",lname:""},pageLength:pageLength,page:req.query.page,query:req.query.categories})
        }
        else{
            const agg = Product.aggregate([
                {$sample: { size : 8 }},
            ])
            const productList = await agg.exec();
            console.log(productList);
            res.render('index',{products:productList,profileName})
        

    }
    }catch(err){
        if (req.query.categories) {
            //     filter = { category: req.query.categories.split(',') }
            
            // console.log(filter)
            // const productList = await Product.find(filter).populate('category')
            console.log(req.query.categories)
           const encryptedString = req.query.categories.replace(/%/g, ' ');
           console.log('ssdsAS',encryptedString);
                const productList =await Product.find({category:encryptedString})
                .skip((req.query.page - 1) * 2)
          .limit(2);
    
          
        // const pageLength=Math.ceil(count/perPage);
              const count=await Product.countDocuments({category:req.query.categories})
              console.log(req.query.page);
            //   console.log(count);
              
            //     res.send(productList)
          const pageLength=  Math.ceil(count/2)
          console.log(pageLength);
            res.render('category',{doc:productList,profileName:{fname:"",lname:""},pageLength:pageLength,page:req.query.page,query:req.query.categories})
            }
            else{
                const agg = Product.aggregate([
                    {$sample: { size : 8 }},
                ])
                const productList = await agg.exec();
                console.log(productList);
                res.render('index',{products:productList,profileName:{fname:'',lname:''}})
            
    
        }
    }
})


// console.log(isAuthenticated)
router.get(`${myEnv}/admin/product/addproduct`, (req, res) => {
    if (isAuthenticated(req)) res.render('add_product')
    else {
        req.session.prev=req.url
        res.redirect(`${myEnv}/admin/signIn`)
    }
})

router.post(`${myEnv}/admin/product/addproduct`,multerStorage().array('images',6), async (req, res) => {
    // res.setHeader('Content-Type', 'application/json');
    console.log(req.files);
    addproduct(myEnv, req, res)
})

router.delete(`${myEnv}/admin/product/:productId`, (req, res) => {
    Product.findByIdAndRemove(req.params.productId)
        .then((doc) => {
            if (doc !== null) { return res.status(200).json({ succed: true, Message: `deleted succesfully` }) }
            else { return res.status(404).json({ succed: false, Message: `deleted unsuccesfully` }) }
        }).catch((err) => res.status(200).json({ succed: false, error: err }))
})

router.get(`${myEnv}/product/:productId`, (req, res) => {
    Product.findOne({pid: req.params.productId})
        .then(async(doc) => {
            if (doc !== null) { 
                try{
                    const userId=jwt_auth.jwtDecode(req.cookies.jwt).userId
                    const UserDetail=await User.findOne({umail:userId,
                        cart: { $elemMatch: { $eq:req.params.productId} }})
                    if(UserDetail){
                        return res.status(200).render('productPage',{doc,addCart:false}) 
                    }
                    else{
                        return res.status(200).render('productPage',{doc,addCart:true}) 

                    }
                    }catch(err){
                 return res.status(200).render('productPage',{doc,addCart:true})
                    }
            }
                    
        }).catch((err) => res.status(200).json({ succed: false, error: err }))
    })


router.get(`${myEnv}/admin/product/viewProduct/:page`, async (req, res,next) => {
   
        const decode=isAuthenticated(req,res,next)
    try {
        if(decode){
            const page = parseInt(req.params.page);
            const perPage = 3;
            console.log(decode.userId);
            const count=await Product.countDocuments({admin_id:decode.userId})

            const products = await Product.find({admin_id:decode.userId})
            .skip((page - 1) * perPage)
      .limit(perPage);
      const pageLength=Math.ceil(count/perPage)
        res.render('adminViewProduct', {doc:products,pageLength,page});
    
        }
        else {
            req.session.prev=req.url
            return  res.redirect(`${myEnv}/admin/signIn`)
        }
    } catch (error) {
        console.error(error);
        res.redirect('*');
    }
});

router.post(`${myEnv}/admin/product/update/:pid`,async(req,res)=>{
    try{
    const decode=isAuthenticated(req,res)
    if(decode){
        const pid=req.params.pid
        const UpdateProducts=req.body
        console.log(UpdateProducts);
        await Product.updateOne({admin_id:decode.userId,pid:pid},{$set:UpdateProducts})
        res.send('success')
    }
}catch(err){
console.log(err);
res.send('faield')
}
})
module.exports = router
