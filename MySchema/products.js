const mongose = require('mongoose')
const { buffer } = require('stream/consumers')

const productsSchema =new mongose.Schema({
    pid:{type:String,required:true,unique:true,text:true},
    title: { type: String, required: true,text:true },
    admin_id: {
        type: String,
        required: true,
        
    },
    name: { type: String, required: true ,text:true},
    discription: { type: String, default: "" ,text:true},
    richdiscription: { type: String, default: "" ,text:true},
    images: [
        {
            imgname:String,
            data: Buffer,
            contentType: String, // Store the MIME type (e.g., 'image/jpeg', 'image/png')
          }
    ],
    brand: { type: String, default: "",text:true },
    price: {
        type: Number,
        required: true
    },
    // category:{
    //     type:mongose.Types.ObjectId,
    //     required:true
    // },
    category: {type:String,text:true},
    // //custom requierd data 
    instock: {
        type: Number,
        required: true,
        min: 0
    },
    rating: { type: Number, default: 0 },
    isfeatured: { type: Boolean, default: false },
    datecreated: { type: Date, default: Date.now },
    deltime: Number,
    numreview: { type: Number, default: 0 },
    weight:Number,
    height:Number,
    width:Number,

    // selerid:{type:String}
})

module.exports = mongose.model("Products", productsSchema)

