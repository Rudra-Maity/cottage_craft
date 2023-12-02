const mongoose=require('mongoose');

const User=new mongoose.Schema({
    uname:{
        fname:String,
        lname:String,
    },
    umail:{unique:true,type:String},
    upass:String,
    address:{
        phno:{type: [Number],required:true},
        state:{type: String,required:true},
        district:{type: String,required:true},
        pincode:{type: Number,required:true},
        street:{type: String},
        landmark:{type:String,required:true}
    },
    cart:[String]
})

module.exports=mongoose.model("User",User);