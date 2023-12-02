const OrderIdGenrator = require('../ProductsModule/productidGenrateor')
const Orders = require('../MySchema/orders')
const User = require('../MySchema/User')
const jwt_auth = require('../Password/jwt_auth')
const products = require('../MySchema/products')

async function NewUser(req, res) {
    try {
        const UserId = jwt_auth.jwtDecode(req.cookies.jwt).userId
        console.log("UserId",UserId);
        try {
            const FindUser = await User.findOne({umail: UserId})
            console.log("FindUser",FindUser);
            return FindUser
        } catch (err) {
            console.log("err",err);
            return false
        }
    } catch (er) {
        console.log("er",er);
        return undefined
    }
}

async function OrderCreation(req, res,doc,payMethod,payoid,payid,paysign,payrcid) {
    const UserDoc=await NewUser(req,res)
    console.log("UserDoc",UserDoc);
    if(UserDoc){
        console.log("doc :",doc);
    const NewOrders =new Orders({
        title: doc.title,
        oid: `oid_${OrderIdGenrator}${Date.now()}`,
        admin_id:doc.admin_id,
        producdetails: {
            pid:doc.pid,
            deltime: doc.deltime,
            numreview: doc.numreview,
            weight: doc.weight,
            height: doc.height,
            width: doc.width,
            price: doc.price,
            name: doc.name,
            images: {
                imgname: (doc.images[0].imgname) || " ",
                data: (doc.images[0].data) || " ",
                contentType:( doc.images[0].contentType) || " ",
            }
        },
        userinfo: {
            fname: UserDoc.uname.fname,
            lname: UserDoc.uname.lname,
            email: UserDoc.umail,
            address: {
                phno: UserDoc.address.phno,
                state: UserDoc.address.state,
                district: UserDoc.address.district,
                pincode: UserDoc.address.pincode,
                street: UserDoc.address.street,
                landmark: UserDoc.address.landmark
            }
        },
        paymethod: {
            paymethod:payMethod,
            paydetails: {
                payoid: payoid|| "",
                payid: payid || "",
                paysign:paysign || "",
                payrcid:payrcid || ""
            },
        }
    })
   const myOrders=await NewOrders.save()
   UserDoc.instock-=1
   await  products.updateOne({pid:doc.pid},{ $inc: { 
    instock: -1 }})
   return myOrders
}
else if(UserDoc===false) return false
else UserDoc
}

module.exports=OrderCreation