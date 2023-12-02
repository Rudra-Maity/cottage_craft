const express=require('express');
const router=express.Router();

router.use((req, res, next) => {
    console.log('Time: ', Date.now())
    next()
})

router.get('/user/order/result',(req,res)=>{
    console.log(req.session.oid);
    if(req.query.success && req.session.oid){
        res.render('OrderResult',{success:true})
        req.session.destroy((err)=>console.log(err))
    }
    else if(req.query.success===false){
        res.render('OrderResult',{success:false})
    }
    else res.redirect('*')
})

router.get('/admin/product/upload',(req,res)=>{
    res.send('Product has uploaded successfully')
})

router.get('/about',(req,res)=>{
    res.render('About')
})

router.get('/contact',(req,res)=>{
    res.render('contact')
})
router.get('*',(req,res)=>{
    res.render('BadRequest')
})

module.exports=router