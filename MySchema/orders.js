const mongoose = require('mongoose');


// https://stackoverflow.com/questions/61987806/how-do-i-post-to-a-nested-field-in-a-complex-mongodb-schema
const OrderSchema = new mongoose.Schema({
    title: String,
    oid: { type: String, required: true, unique: true },
    admin_id: String,
    producdetails: {
        pid:String,
        datecreated: { type: Date, default: Date.now },
        deltime: Number,
        numreview: { type: Number, default: 0 },
        weight: Number,
        height: Number,
        width: Number,
        price: {
            type: Number,
            required: true
        },
        name: { type: String, required: true, text: true },
        images: {
            imgname: String,
            data: Buffer,
            contentType: String,
        }
    },
    userinfo: {
        fname: { type: String },
        lname: { type: String },
        email: { type: String, required: true },
        address: {
            phno: { type: [Number], required: true },
            state: { type: String, required: true },
            district: { type: String, required: true },
            pincode: { type: Number, required: true },
            street: { type: String },
            landmark: { type: String, required: true }
        }
    },
    deleivery: {delstatus:{type:String,default: 'confirm'},shippadd:{type:String, default:''} },
    paymethod: {
        paymethod:{type:String,default:'COD'},
        paydetails: {
            payrcid:String,
            payoid: { type: String,  },
            payid: { type: String,  },
            paysign: { type: String,  }
        },
    }
})

module.exports = mongoose.model("Orders", OrderSchema)