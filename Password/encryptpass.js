const bcrypt = require("bcryptjs")
// const mongoose=require('mongoose')
// const user=require('../MySchema/User');
// const { use } = require("../routers/products");

const saltRounds = 12

const encrypt =(password)=> new Promise(function (resol,rej) {
    bcrypt.genSalt(saltRounds, function (saltError, salt) {
        if (saltError) {
            throw saltError
        } else {
            bcrypt.hash(password, salt, function (hashError, hash) {
                if (hashError) {
                    throw hashError
                } else {
                    console.log(hash)
                   return resol(hash)
                }
            })
        }
    })
});



// mongoose.connect("mongodb://127.0.0.1:27017/products",{ useNewUrlParser: true,
//     useUnifiedTopology: true  })
//     .then((result) => {
//         console.log("succed")
//     }).catch((err) => {
//         console.log(err)
//     });

module.exports=encrypt