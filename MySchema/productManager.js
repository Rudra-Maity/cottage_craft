const mongoose=require('mongoose');
// const products=require('./products')

const productManager=new mongoose.Schema({
    admin_name:{
        // required:true,
        fname:String,
        lname:String,
    },
    admin_id:{
        type:String,
        unique:true,
        required:true
    },
    admin_pass:{
        required:true,
        type:String
    },
    notify:[String]
})

module.exports=mongoose.model("productManager",productManager)